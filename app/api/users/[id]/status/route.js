import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { logActivity } from "@/lib/activityLogger";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["Active", "Inactive"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update status
    user.status = status;
    await user.save();

    await logActivity({
      actionType: status === "Active" ? "ACTIVATE" : "DEACTIVATE",
      module: "User Management",
      title: `Account ${status === "Active" ? "Activated" : "Deactivated"}`,
      description: `${status === "Active" ? "Activated" : "Deactivated"} account for "${user.name}" (ID: ${user.userId})`,
      icon: status === "Active" ? "UserCheck" : "UserMinus",
    });

    return NextResponse.json({
      message: "Status updated successfully",
      status: user.status,
    });
  } catch (error) {
    console.error("PATCH Status Error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
