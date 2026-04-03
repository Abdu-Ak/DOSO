import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Sundook from "@/models/Sundook";

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

    return NextResponse.json({
      notifications: pendingUsers,
      count: pendingUsers.length,
      pendingSundooks: pendingSundooks.length,
      sundookNotifications: pendingSundooks,
    });
  } catch (error) {
    console.error("Notifications Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
