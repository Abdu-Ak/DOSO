import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendApprovalEmail } from "@/lib/email";

function generateTempPassword() {
  return crypto.randomBytes(4).toString("hex"); // 8 char hex string
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

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

    // Only public-registered users get a temp password and email
    if (user.source === "public") {
      const tempPassword = generateTempPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user.password = hashedPassword;
      user.status = "Active";
      user.tempPasswordSet = true;
      await user.save();

      try {
        await sendApprovalEmail(user.email, user.name, tempPassword);
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }

      return NextResponse.json({
        message: "User approved successfully. Temporary password email sent.",
        tempPassword,
      });
    }

    // Admin-created users already have a password, just activate
    user.status = "Active";
    await user.save();

    return NextResponse.json({
      message: "User approved successfully",
    });
  } catch (error) {
    console.error("Approve User Error:", error);
    return NextResponse.json(
      { error: "Failed to approve user" },
      { status: 500 },
    );
  }
}
