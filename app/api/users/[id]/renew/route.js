import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { logActivity } from "@/lib/activityLogger";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { year, receipt_number } = body;

    if (!year || !receipt_number) {
      return NextResponse.json(
        { error: "Year and receipt number are required" },
        { status: 400 },
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "alumni") {
      return NextResponse.json(
        { error: "Only alumni memberships can be renewed" },
        { status: 400 },
      );
    }

    const parsedYear = parseInt(year);
    const trimmedReceipt = receipt_number.trim();

    // Check if receipt number is used by another user or in another year for this user
    const conflictUser = await User.findOne({
      _id: { $ne: id },
      "membership_renewals.receipt_number": new RegExp(
        `^${trimmedReceipt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ),
    });

    if (conflictUser) {
      return NextResponse.json(
        { error: `Receipt number '${trimmedReceipt}' is already in use` },
        { status: 400 },
      );
    }

    // Initialize if undefined
    if (!user.membership_renewals) {
      user.membership_renewals = [];
    }

    const sameUserOtherYear = user.membership_renewals.find(
      (r) =>
        r.year !== parsedYear &&
        r.receipt_number.toLowerCase() === trimmedReceipt.toLowerCase(),
    );

    if (sameUserOtherYear) {
      return NextResponse.json(
        { error: `Receipt number '${trimmedReceipt}' is already in use` },
        { status: 400 },
      );
    }

    // Check if the renewal already exists for this year
    const existingRenewalIndex = user.membership_renewals.findIndex(
      (r) => r.year === parsedYear,
    );

    let isUpdate = false;
    let oldReceipt = "";

    if (existingRenewalIndex >= 0) {
      isUpdate = true;
      oldReceipt = user.membership_renewals[existingRenewalIndex].receipt_number;
      user.membership_renewals[existingRenewalIndex].receipt_number = trimmedReceipt;
      user.membership_renewals[existingRenewalIndex].renewedAt = new Date();
    } else {
      user.membership_renewals.push({
        year: parsedYear,
        receipt_number: trimmedReceipt,
        renewedAt: new Date(),
      });
    }

    // Automatically set status to active if they are renewing
    user.status = "Active";

    await user.save();

    const logTitle = isUpdate ? "Membership Receipt Updated" : "Membership Renewed";
    const logDesc = isUpdate
      ? `Updated membership receipt for "${user.name}" (Year: ${parsedYear}) from "${oldReceipt}" to "${trimmedReceipt}"`
      : `Renewed membership for "${user.name}" (Year: ${parsedYear}, Receipt: ${trimmedReceipt})`;

    await logActivity({
      actionType: isUpdate ? "UPDATE" : "RENEW",
      module: "User Management",
      title: logTitle,
      description: logDesc,
      icon: isUpdate ? "Edit" : "RefreshCw",
    });

    return NextResponse.json({
      message: isUpdate
        ? "Receipt number updated successfully"
        : "Membership renewed successfully",
      renewals: user.membership_renewals,
    });
  } catch (error) {
    console.error("POST Renew Membership Error:", error);
    return NextResponse.json(
      { error: "Failed to renew membership" },
      { status: 500 },
    );
  }
}
