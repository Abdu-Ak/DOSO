import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedActivity = await ActivityLog.findByIdAndDelete(id);

    if (!deletedActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Activity Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
