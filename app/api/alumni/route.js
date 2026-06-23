import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";
    const district = searchParams.get("district") || "";
    const batch = searchParams.get("batch") || "";

    const skip = (page - 1) * limit;

    // Only allow fetching Active Alumni on the public API
    const query = {
      role: "alumni",
      status: "Active",
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { current_job: { $regex: search, $options: "i" } },
        { custom_job: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { custom_district: { $regex: search, $options: "i" } },
        { father_name: { $regex: search, $options: "i" } },
        { batch: { $regex: search, $options: "i" } },
      ];
    }

    if (district) {
      query.district = district;
    }

    if (batch) {
      const yearMatch = batch.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : batch;
      query.batch = { $regex: year, $options: "i" };
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("name email phone image house_name father_name address district custom_district post_office pincode batch education current_job custom_job job_location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET Public Alumni Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
