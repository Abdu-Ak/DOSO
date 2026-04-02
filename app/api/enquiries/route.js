import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { createEnquirySchema } from "@/lib/validations/enquiry.validation";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate request body
    const validation = createEnquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 },
      );
    }

    const { name, phone, subject, message } = validation.data;

    const newEnquiry = await Enquiry.create({
      name,
      phone,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        data: newEnquiry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Enquiry Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    // Fetch all enquiries, sorted by newest first
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("GET Enquiries Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 },
    );
  }
}
