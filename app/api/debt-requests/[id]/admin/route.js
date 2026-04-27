import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminResponseSchema } from "@/lib/validations/debt.validation";
import { sendDebtAdminRespondNotification } from "@/lib/email";
import { logActivity } from "@/lib/activityLogger";

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

    if (
      debtRequest.status !== "pending_admin" &&
      (status === "approved" || status === "rejected")
    ) {
      return NextResponse.json(
        { error: "Request is not ready for admin response" },
        { status: 400 },
      );
    }

    if (debtRequest.status !== "approved" && status === "repaid") {
      return NextResponse.json(
        { error: "Only approved debts can be marked as repaid" },
        { status: 400 },
      );
    }

    debtRequest.admin_status = status;
    debtRequest.admin_reason = reason;
    debtRequest.receipt_no = receipt_no;
    debtRequest.status = status;

    await debtRequest.save();

    const actionTypeMap = {
      approved: "APPROVE",
      rejected: "REJECT",
      repaid: "REPAID",
    };

    const iconMap = {
      approved: "CheckCircle",
      rejected: "XCircle",
      repaid: "BadgeCheck",
    };

    const description =
      status === "repaid"
        ? `Debt request is marked as repaid for "${debtRequest.requester.name}" (Amount: ₹${debtRequest.amount})`
        : `${status.charAt(0).toUpperCase() + status.slice(1)}d debt request for "${debtRequest.requester.name}" (Amount: ₹${debtRequest.amount})`;

    await logActivity({
      actionType: actionTypeMap[status] || "UPDATE",
      module: "Debt Module",
      title: `Debt ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description,
      icon: iconMap[status] || "Info",
    });

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
