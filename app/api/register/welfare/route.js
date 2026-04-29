import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Welfare from "@/models/Welfare";
import { publicCreateWelfareSchema } from "@/lib/validations/welfare.validation";
import { logActivity } from "@/lib/activityLogger";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate request body
    const validatedData = publicCreateWelfareSchema.parse(body);

    const record = await Welfare.create({
      ...validatedData,
      status: "pending",
    });

    // Populate alumni for activity logging
    const alumni = await User.findById(validatedData.alumni).select("name");

    await logActivity({
      actionType: "CREATE",
      module: "Welfare",
      title: "Public Welfare Submission",
      description: `New public welfare submission from "${alumni?.name || "Unknown"}" (Amount: ₹${validatedData.amount})`,
      icon: "HeartHandshake",
    });

    return NextResponse.json(
      { message: "Welfare submission received and pending approval", record },
      { status: 201 },
    );
  } catch (error) {
    console.error("Public Welfare POST Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to submit welfare record" },
      { status: 500 },
    );
  }
}
