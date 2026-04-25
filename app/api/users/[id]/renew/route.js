import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

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

    // Initialize if undefined
    if (!user.membership_renewals) {
      user.membership_renewals = [];
    }

    // Check if the renewal already exists for this year
    const existingRenewalIndex = user.membership_renewals.findIndex(
      (r) => r.year === parsedYear,
    );

    if (existingRenewalIndex >= 0) {
      // Update existing renewal
      user.membership_renewals[existingRenewalIndex].receipt_number =
        receipt_number;
      user.membership_renewals[existingRenewalIndex].renewedAt = new Date();
    } else {
      // Add new renewal
      user.membership_renewals.push({
        year: parsedYear,
        receipt_number,
        renewedAt: new Date(),
      });
    }

    // Automatically set status to active if they are renewing
    user.status = "Active";

    await user.save();

    return NextResponse.json({
      message: "Membership renewed successfully",
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
