import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logActivity } from "@/lib/activityLogger";

export async function DELETE(request, { params }) {
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
    const debtRequest = await DebtRequest.findByIdAndDelete(id);

    if (!debtRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await logActivity({
      actionType: "DELETE",
      module: "Debt Module",
      title: "Debt Deleted",
      description: `Deleted debt request for ${debtRequest.requester?.name || "unknown alumni"} (Amount: ₹${debtRequest.amount})`,
      icon: "Trash2",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Debt Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const debtRequest = await DebtRequest.findById(id)
      .populate("requester", "name email userId image phone")
      .populate("witness1", "name email userId image phone")
      .populate("witness2", "name email userId image phone");

    if (!debtRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(debtRequest);
  } catch (error) {
    console.error("GET Debt ID Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
