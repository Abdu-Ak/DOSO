import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logActivity } from "@/lib/activityLogger";
import { hasPermission } from "@/lib/permissions";
import { checkReceiptUniqueness } from "@/lib/receiptUtils";

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
    const { receipt_no } = body;

    if (!receipt_no || !receipt_no.trim()) {
      return NextResponse.json(
        { error: "Receipt number is required" },
        { status: 400 },
      );
    }

    const trimmedReceipt = receipt_no.trim();

    const debtRequest = await DebtRequest.findById(id).populate("requester", "name email");
    if (!debtRequest) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const check = await checkReceiptUniqueness("debt", trimmedReceipt, id);
    if (!check.isUnique) {
      return NextResponse.json({ error: check.message }, { status: 400 });
    }

    const oldReceipt = debtRequest.receipt_no || "None";
    debtRequest.receipt_no = trimmedReceipt;
    await debtRequest.save();

    await logActivity({
      actionType: "UPDATE",
      module: "Debt Module",
      title: "Debt Receipt Updated",
      description: `Updated receipt number for "${debtRequest.requester?.name || "Requester"}" from "${oldReceipt}" to "${trimmedReceipt}"`,
      icon: "Edit",
    });

    return NextResponse.json({
      message: "Receipt number updated successfully",
      debtRequest,
    });
  } catch (error) {
    console.error("PATCH Debt Receipt Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
