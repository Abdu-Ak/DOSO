import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminResponseSchema } from "@/lib/validations/debt.validation";
import { sendDebtAdminRespondNotification } from "@/lib/email";
import { logActivity } from "@/lib/activityLogger";
import { hasPermission } from "@/lib/permissions";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "debt_requests", "manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (status === "approved") {
      const now = new Date();
      debtRequest.approvedAt = now;

      if (debtRequest.payment_type === "single") {
        const dueDate = new Date(now);
        dueDate.setMonth(dueDate.getMonth() + debtRequest.duration_months);
        debtRequest.dueDate = dueDate;
      } else if (debtRequest.payment_type === "emi") {
        const installments = [];
        const baseAmount = Math.floor(debtRequest.amount / debtRequest.duration_months);
        let totalAssigned = 0;

        for (let i = 1; i <= debtRequest.duration_months; i++) {
          const installmentDueDate = new Date(now);
          installmentDueDate.setMonth(installmentDueDate.getMonth() + i);
          
          let amount = baseAmount;
          // Add remainder to the last installment
          if (i === debtRequest.duration_months) {
            amount = debtRequest.amount - totalAssigned;
          }
          totalAssigned += amount;

          installments.push({
            installmentNumber: i,
            amount: amount,
            dueDate: installmentDueDate,
            status: "pending",
          });
        }
        debtRequest.installments = installments;
        debtRequest.dueDate = installments[installments.length - 1].dueDate;
      }
    }

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
    if (error.name === "ZodError" || error.errors) {
      return NextResponse.json(
        { error: error.errors?.[0]?.message || "Validation error" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
