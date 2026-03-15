import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const pendingUsers = await User.find({
      status: "Pending",
      source: "public",
    })
      .sort({ createdAt: -1 })
      .select("name email role image createdAt userId");

    return NextResponse.json({
      notifications: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error) {
    console.error("Notifications Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
