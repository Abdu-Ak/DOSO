import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { logActivity } from "@/lib/activityLogger";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const { status } = await request.json();

    if (!["Active", "Inactive"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await logActivity({
      actionType: status === "Active" ? "ACTIVATE" : "DEACTIVATE",
      module: "Student Management",
      title: `Student ${status === "Active" ? "Activated" : "Deactivated"}`,
      description: `${status === "Active" ? "Activated" : "Deactivated"} student: "${student.name}" (ID: ${student.studentId})`,
      icon: status === "Active" ? "UserCheck" : "UserMinus",
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("PATCH Student Status Error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
