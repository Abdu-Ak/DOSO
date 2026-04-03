import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sundook from "@/models/Sundook";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateSundookStatusSchema } from "@/lib/validations/sundook.validation";
import {
  sendSundookApprovalEmail,
  sendSundookRejectionEmail,
} from "@/lib/email";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "super_admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, receipt_number, rejection_reason } =
      updateSundookStatusSchema.parse(body);

    const record = await Sundook.findById(id).populate("alumni", "name email");
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    record.status = status;
    if (status === "approved") {
      record.receipt_number = receipt_number;
    } else {
      record.rejection_reason = rejection_reason;
    }

    await record.save();

    // Trigger Email Notification
    try {
      if (status === "approved") {
        await sendSundookApprovalEmail(
          record.alumni.email,
          record.alumni.name,
          record.year,
          record.amount,
          receipt_number,
        );
      } else {
        await sendSundookRejectionEmail(
          record.alumni.email,
          record.alumni.name,
          record.year,
          rejection_reason,
        );
      }
    } catch (emailError) {
      console.error("Failed to send Sundook notification email:", emailError);
      // We don't return error here because the status update was successful
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("PATCH Sundook Status Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
