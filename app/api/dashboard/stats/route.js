import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import Sundook from "@/models/Sundook";
import Welfare from "@/models/Welfare";
import Event from "@/models/Event";
import Enquiry from "@/models/Enquiry";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get basic counts (cumulative)
    const totalSystemUsers = await User.countDocuments({
      role: { $ne: "super_admin" },
    });
    const students = await Student.countDocuments();
    const alumni = await User.countDocuments({ role: "alumni" });
    const admins = await User.countDocuments({ role: "admin" });

    // Get stats for the specific range
    const rangeSystemUsers = await User.countDocuments({
      ...query,
      role: { $ne: "super_admin" },
    });
    const rangeStudents = await Student.countDocuments(query);
    const rangeAlumni = await User.countDocuments({ ...query, role: "alumni" });
    const rangeAdmins = await User.countDocuments({ ...query, role: "admin" });

    // Sundook & Welfare (Only Approved)
    const sundookStats = await Sundook.aggregate([
      { $match: { ...query, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const welfareStats = await Welfare.aggregate([
      { $match: { ...query, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Additional Stats for internal use
    const totalEvents = await Event.countDocuments(query);
    const pendingEnquiries = await Enquiry.countDocuments({
      ...query,
      status: "Pending",
    });

    const formatCurrency = (val) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(val);
    };

    const sundookTotal = sundookStats[0]?.total || 0;
    const welfareTotal = welfareStats[0]?.total || 0;

    const reportData = [
      {
        metric: "Total Users",
        value: rangeSystemUsers + rangeStudents,
        details: `Alumni: ${rangeAlumni}, Admins: ${rangeAdmins}`,
      },
      {
        metric: "Total Students",
        value: rangeStudents,
        details: "",
      },
      {
        metric: "Sundook Total (Approved)",
        value: formatCurrency(sundookTotal),
        details: "",
      },
      {
        metric: "Welfare Total (Approved)",
        value: formatCurrency(welfareTotal),
        details: "",
      },
      {
        metric: "Total Events",
        value: totalEvents,
        details: "",
      },
      {
        metric: "Pending Enquiries",
        value: pendingEnquiries,
        details: "",
      },
    ];

    return NextResponse.json({
      totalUsers: rangeSystemUsers + rangeStudents,
      students: rangeStudents,
      alumni: rangeAlumni,
      admins: rangeAdmins,
      sundookTotal,
      welfareTotal,
      totalEvents,
      pendingEnquiries,
      reportData,
      cumulative: {
        totalUsers: totalSystemUsers + students,
        students,
        alumni,
        admins,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
