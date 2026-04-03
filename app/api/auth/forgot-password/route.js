import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validations/auth.validation";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 },
      );
    }

    const { email } = validation.data;
    const user = await User.findOne({ email });

    // For security reasons, don't reveal if user exists or not
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash and set to resetPasswordToken field
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create reset URL
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const resetUrl = `${protocol}://${host}/reset-password?token=${resetToken}`;

    try {
      await sendResetPasswordEmail(user.email, user.name || "User", resetUrl);

      return NextResponse.json({
        success: true,
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json(
        {
          success: false,
          message: "Email could not be sent. Please try again later.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 },
    );
  }
}
