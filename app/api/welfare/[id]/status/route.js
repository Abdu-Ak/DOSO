import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Welfare from "@/models/Welfare";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  approveWelfareSchema,
  rejectWelfareSchema,
} from "@/lib/validations/welfare.validation";
import {
  sendWelfareApprovalEmail,
  sendWelfareRejectionEmail,
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
    const { status } = body; // expecting "approved" or "rejected"

    const record = await Welfare.findById(id).populate("alumni", "name email");
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    if (status === "approved") {
      const { receipt_number } = approveWelfareSchema.parse(body);
      record.status = "approved";
      record.receipt_number = receipt_number;
    } else if (status === "rejected") {
      const { rejection_reason } = rejectWelfareSchema.parse(body);
      record.status = "rejected";
      record.rejection_reason = rejection_reason;
    } else {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await record.save();

    // Trigger Email Notification
    try {
      if (status === "approved") {
        await sendWelfareApprovalEmail(
          record.alumni.email,
          record.alumni.name,
          record.description,
          record.amount,
          record.receipt_number,
        );
      } else {
        await sendWelfareRejectionEmail(
          record.alumni.email,
          record.alumni.name,
          record.description,
          record.rejection_reason,
        );
      }
    } catch (emailError) {
      console.error("Failed to send Welfare notification email:", emailError);
      // We don't return error here because the status update was successful
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("PATCH Welfare Status Error:", error);
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
