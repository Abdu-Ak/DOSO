import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Welfare from "@/models/Welfare";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logActivity } from "@/lib/activityLogger";
import { hasPermission } from "@/lib/permissions";

export async function DELETE(request, { params }) {
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
