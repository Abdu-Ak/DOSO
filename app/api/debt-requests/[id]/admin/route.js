import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminResponseSchema } from "@/lib/validations/debt.validation";
import { sendDebtAdminRespondNotification } from "@/lib/email";

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
    const { status, receipt_no, reason } = adminResponseSchema.parse(body);

    const debtRequest = await DebtRequest.findById(id).populate(
      "requester",
      "name email",
    );
    if (!debtRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (debtRequest.status !== "pending_admin" && status === "approved") {
      return NextResponse.json(
        { error: "Request is not ready for admin approval" },
        { status: 400 },
      );
    }

    debtRequest.admin_status = status;
    debtRequest.admin_reason = reason;
    debtRequest.receipt_no = receipt_no;
    debtRequest.status = status; // "approved" or "rejected"

    await debtRequest.save();

    // Notify requester
    if (debtRequest.requester?.email) {
      await sendDebtAdminRespondNotification(
        debtRequest.requester.email,
        debtRequest.requester.name,
        status,
        receipt_no,
        reason,
      );
    }

    return NextResponse.json(debtRequest);
  } catch (error) {
    console.error("PATCH Admin Error:", error);
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
