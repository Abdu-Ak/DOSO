import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Sundook from "@/models/Sundook";
import Welfare from "@/models/Welfare";
import Student from "@/models/Student";
import DebtRequest from "@/models/DebtRequest";

export async function GET() {
  try {
    await dbConnect();

    const pendingUsers = await User.find({
      status: "Pending",
      source: "public",
    })
      .sort({ createdAt: -1 })
      .select("name email role image createdAt userId");

    const pendingSundooks = await Sundook.find({ status: "pending" })
      .populate("alumni", "name image userId")
      .sort({ createdAt: -1 });

    const pendingWelfare = await Welfare.find({ status: "pending" })
      .populate("alumni", "name image userId")
      .sort({ createdAt: -1 });

    const pendingStudents = await Student.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .select("name email phone createdAt studentId image");

    const pendingDebtActions = await DebtRequest.find({
      status: "pending_admin",
    })
      .populate("requester", "name image userId")
      .sort({ createdAt: -1 });

    const today = new Date();
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(today.getDate() + 10);

    const upcomingDebts = await DebtRequest.find({
      status: "approved",
      $or: [
        { payment_type: "single", dueDate: { $lte: tenDaysFromNow } },
        {
          payment_type: "emi",
          "installments.dueDate": { $lte: tenDaysFromNow },
          "installments.status": "pending",
        },
      ],
    })
      .populate("requester", "name image userId phone")
      .sort({ dueDate: 1 });

    return NextResponse.json({
      notifications: pendingUsers,
      count: pendingUsers.length,
      pendingSundooks: pendingSundooks.length,
      pendingWelfare: pendingWelfare.length,
      pendingStudents: pendingStudents.length,
      pendingDebt: pendingDebtActions.length + upcomingDebts.length,
      sundookNotifications: pendingSundooks,
      welfareNotifications: pendingWelfare,
      studentNotifications: pendingStudents,
      debtNotifications: [
        ...pendingDebtActions.map((d) => ({
          ...d.toObject(),
          type: "pending_approval",
        })),
        ...upcomingDebts.map((d) => ({ ...d.toObject(), type: "due_soon" })),
      ],
      upcomingDebts,
    });
  } catch (error) {
    console.error("Notifications Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
