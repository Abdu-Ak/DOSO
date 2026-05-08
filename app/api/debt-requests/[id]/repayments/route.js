import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    const { installmentNumber } = await request.json();

    const debtRequest = await DebtRequest.findById(id).populate(
      "requester",
      "name email",
    );
    if (!debtRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (debtRequest.status !== "approved") {
      return NextResponse.json(
        { error: "Debt is not in approved status" },
        { status: 400 },
      );
    }

    if (debtRequest.payment_type === "single") {
      debtRequest.status = "repaid";
      debtRequest.admin_status = "repaid";
    } else {
      const installment = debtRequest.installments.find(
        (i) => i.installmentNumber === installmentNumber,
      );
      if (!installment) {
        return NextResponse.json(
          { error: "Installment not found" },
          { status: 404 },
        );
      }
      if (installment.status === "paid") {
        return NextResponse.json(
          { error: "Installment already paid" },
          { status: 400 },
        );
      }

      installment.status = "paid";
      installment.paidAt = new Date();

      // Check if all installments are paid
      const allPaid = debtRequest.installments.every(
        (i) => i.status === "paid",
      );
      if (allPaid) {
        debtRequest.status = "repaid";
        debtRequest.admin_status = "repaid";
      }
    }

    await debtRequest.save();

    await logActivity({
      actionType: "REPAID",
      module: "Debt Module",
      title: "Repayment Recorded",
      description: `Recorded repayment for "${debtRequest.requester.name}" (Amount: ₹${debtRequest.amount})`,
      icon: "BadgeCheck",
    });

    return NextResponse.json({ success: true, debtRequest });
  } catch (error) {
    console.error("PATCH Repayments Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
