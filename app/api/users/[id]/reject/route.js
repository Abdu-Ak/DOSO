import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendRejectionEmail } from "@/lib/email";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { reason } = await request.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status !== "Pending") {
      return NextResponse.json(
        { error: "User is not in Pending status" },
        { status: 400 },
      );
    }

    user.status = "Inactive";
    user.rejectionReason = reason || "";
    await user.save();

    try {
      await sendRejectionEmail(user.email, user.name, reason);
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    return NextResponse.json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("Reject User Error:", error);
    return NextResponse.json(
      { error: "Failed to reject user" },
      { status: 500 },
    );
  }
}
