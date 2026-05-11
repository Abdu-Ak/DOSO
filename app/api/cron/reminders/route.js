import { NextResponse } from "next/server";
import { checkAndSendReminders } from "@/lib/reminderService";

export async function GET(request) {
  try {
    // Basic security check (can be enhanced with a secret header)
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await checkAndSendReminders();

    return NextResponse.json({
      success: true,
      message: "Reminders checked and sent",
    });
  } catch (error) {
    console.error("Cron Reminders Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
