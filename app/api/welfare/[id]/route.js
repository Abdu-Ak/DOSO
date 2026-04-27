import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Welfare from "@/models/Welfare";
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

    const record = await Welfare.findByIdAndDelete(id);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    await logActivity({
      actionType: "DELETE",
      module: "Welfare",
      title: "Welfare Record Deleted",
      description: `Deleted welfare record for "${record.alumni?.name || "unknown alumni"}"`,
      icon: "Trash2",
    });

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("DELETE Welfare Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
