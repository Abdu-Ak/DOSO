import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";

export async function GET() {
  try {
    await dbConnect();

    // Get counts
    const totalSystemUsers = await User.countDocuments({
      role: { $ne: "super_admin" },
    });
    const students = await Student.countDocuments();
    const totalUsers = totalSystemUsers + students;

    const alumni = await User.countDocuments({ role: "alumni" });
    const admins = await User.countDocuments({ role: "admin" });

    // New users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newSystemUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      role: { $ne: "super_admin" },
    });
    const newStudentsLast30Days = await Student.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const newUsersLast30Days = newSystemUsersLast30Days + newStudentsLast30Days;

    // Calculate growth percentages
    const previousTotal = totalUsers - newUsersLast30Days;
    const growthTrend =
      previousTotal > 0
        ? `+${Math.round((newUsersLast30Days / previousTotal) * 100)}%`
        : "+100%";

    return NextResponse.json({
      totalUsers,
      students,
      alumni,
      admins,
      newUsersLast30Days,
      trends: {
        total: growthTrend,
        alumni: "+5%", // These could be calculated similarly if needed
        student: "+8%",
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
