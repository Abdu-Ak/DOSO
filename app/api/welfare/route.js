import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Welfare from "@/models/Welfare";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  createWelfareSchema,
  adminCreateWelfareSchema,
} from "@/lib/validations/welfare.validation";

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (session.user.role === "admin" || session.user.role === "super_admin") {
      const status = searchParams.get("status");
      const alumniId = searchParams.get("alumniId");
      const fromDate = searchParams.get("fromDate");
      const toDate = searchParams.get("toDate");
      const search = searchParams.get("search");

      if (status) query.status = status;
      if (alumniId) query.alumni = alumniId;
      if (fromDate && toDate) {
        query.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate + "T23:59:59.999Z"),
        };
      } else if (fromDate) {
        query.createdAt = { $gte: new Date(fromDate) };
      } else if (toDate) {
        query.createdAt = { $lte: new Date(toDate + "T23:59:59.999Z") };
      }

      if (search) {
        const matchingUsers = await User.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
          ],
        }).select("_id");
        query.$or = [
          { alumni: { $in: matchingUsers.map((u) => u._id) } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    } else {
      // Alumni can only see their own records
      query.alumni = session.user.id;

      const fromDate = searchParams.get("fromDate");
      const toDate = searchParams.get("toDate");
      const search = searchParams.get("search");

      if (fromDate && toDate) {
        query.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate + "T23:59:59.999Z"),
        };
      } else if (fromDate) {
        query.createdAt = { $gte: new Date(fromDate) };
      } else if (toDate) {
        query.createdAt = { $lte: new Date(toDate + "T23:59:59.999Z") };
      }

      if (search) {
        query.description = { $regex: search, $options: "i" };
      }
    }

    const total = await Welfare.countDocuments(query);
    const records = await Welfare.find(query)
      .populate("alumni", "name email userId phone image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      records,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET Welfare Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (session.user.role === "admin" || session.user.role === "super_admin") {
      // Admin creation
      const validatedData = adminCreateWelfareSchema.parse(body);

      const newRecord = await Welfare.create({
        ...validatedData,
        status: "approved", // Admin created entries are auto-approved
      });

      return NextResponse.json(newRecord, { status: 201 });
    } else {
      // Alumni submission
      const validatedData = createWelfareSchema.parse(body);

      const newRecord = await Welfare.create({
        ...validatedData,
        alumni: session.user.id,
        status: "pending",
      });

      return NextResponse.json(newRecord, { status: 201 });
    }
  } catch (error) {
    console.error("POST Welfare Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
