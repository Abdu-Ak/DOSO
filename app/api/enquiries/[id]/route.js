import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { updateEnquiryStatusSchema } from "@/lib/validations/enquiry.validation";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "enquiries", "manage")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const validation = updateEnquiryStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 },
      );
    }

    const { status } = validation.data;

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedEnquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 },
      );
    }

    await logActivity({
      actionType: "UPDATE",
      module: "Enquiries",
      title: "Enquiry Status Updated",
      description: `Updated status to ${status} for enquiry from "${updatedEnquiry.name}"`,
      icon: "MessageSquare",
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated",
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error("PATCH Enquiry Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enquiry status" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "enquiries", "manage")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 },
      );
    }

    await logActivity({
      actionType: "DELETE",
      module: "Enquiries",
      title: "Enquiry Deleted",
      description: `Deleted enquiry from "${deletedEnquiry.name}"`,
      icon: "MessageSquareX",
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Enquiry Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry" },
      { status: 500 },
    );
  }
}
