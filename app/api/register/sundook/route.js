import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sundook from "@/models/Sundook";
import { publicCreateSundookSchema } from "@/lib/validations/sundook.validation";
import { logActivity } from "@/lib/activityLogger";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate request body
    const validatedData = publicCreateSundookSchema.parse(body);

    const record = await Sundook.create({
      ...validatedData,
      status: "pending",
    });

    // Populate alumni for activity logging
    const alumni = await User.findById(validatedData.alumni).select("name");

    await logActivity({
      actionType: "CREATE",
      module: "Sundook",
      title: "Public Sundook Submission",
      description: `New public sundook submission from "${alumni?.name || "Unknown"}" (Year: ${validatedData.year}, Amount: ₹${validatedData.amount})`,
      icon: "Box",
    });

    return NextResponse.json(
      { message: "Sundook submission received and pending approval", record },
      { status: 201 },
    );
  } catch (error) {
    console.error("Public Sundook POST Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to submit sundook record" },
      { status: 500 },
    );
  }
}
