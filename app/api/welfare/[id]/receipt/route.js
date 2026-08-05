import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Welfare from "@/models/Welfare";
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

    if (!hasPermission(session.user, "welfare", "manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { receipt_number } = body;

    if (!receipt_number || !receipt_number.trim()) {
      return NextResponse.json(
        { error: "Receipt number is required" },
        { status: 400 },
      );
    }

    const trimmedReceipt = receipt_number.trim();

    const record = await Welfare.findById(id).populate("alumni", "name email");
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const check = await checkReceiptUniqueness("welfare", trimmedReceipt, id);
    if (!check.isUnique) {
      return NextResponse.json({ error: check.message }, { status: 400 });
    }

    const oldReceipt = record.receipt_number || "None";
    record.receipt_number = trimmedReceipt;
    await record.save();

    await logActivity({
      actionType: "UPDATE",
      module: "Welfare",
      title: "Welfare Receipt Updated",
      description: `Updated receipt number for "${record.alumni?.name || "Alumni"}" from "${oldReceipt}" to "${trimmedReceipt}"`,
      icon: "Edit",
    });

    return NextResponse.json({
      message: "Receipt number updated successfully",
      record,
    });
  } catch (error) {
    console.error("PATCH Welfare Receipt Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
