import dbConnect from "./mongodb";
import ActivityLog from "@/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Logs an admin activity to the database.
 *
 * @param {Object} params
 * @param {string} params.actionType - CREATE | UPDATE | DELETE | APPROVE | REJECT | ACTIVATE | DEACTIVATE | RENEW
 * @param {string} params.module - The module name (e.g., "User Management")
 * @param {string} params.title - Concise headline
 * @param {string} params.description - Human-readable summary
 * @param {string} params.icon - Icon identifier
 * @param {Object} [params.session] - Optional session object (if already fetched)
 */
export async function logActivity({
  actionType,
  module,
  title,
  description,
  icon,
  session: providedSession,
}) {
  try {
    const session = providedSession || (await getServerSession(authOptions));

    // Do not log if no session or if user is super_admin
    if (!session || !session.user || session.user.role === "super_admin") {
      return;
    }

    await dbConnect();

    await ActivityLog.create({
      adminId: session.user.id,
      actionType,
      module,
      title,
      description: `${description} by "${session.user.name}"`,
      icon,
    });
  } catch (error) {
    console.error("Activity Logging Error:", error);
  }
}
