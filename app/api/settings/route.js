import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne();
    if (!settings) {
      return NextResponse.json({ success: true, settings: {} });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "settings", "manage")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const { leadership, contact } = data;

    const updatedSettings = await Setting.findOneAndUpdate(
      {},
      { leadership, contact },
      { upsert: true, new: true },
    );

    await logActivity({
      actionType: "UPDATE",
      module: "Settings",
      title: "Settings Updated",
      description: "Updated platform leadership and contact settings",
      icon: "Settings",
    });

    revalidatePath("/");
    revalidatePath("/contact");

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("PUT Settings Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 },
    );
  }
}
