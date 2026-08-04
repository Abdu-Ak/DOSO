import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const isVisible = searchParams.get("isVisible");

    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { heldingPlace: { $regex: search, $options: "i" } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (isVisible !== null && isVisible !== undefined && isVisible !== "") {
      query.isVisible = isVisible === "true";
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Event.countDocuments(query);
    const sortOrder =
      searchParams.get("sort") === "asc" ? { date: 1 } : { date: -1 };

    const events = await Event.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      events,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET Events Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "events", "manage")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const {
      title,
      description,
      type,
      date,
      time,
      heldingPlace,
      isVisible,
      mainImageUrl,
      galleryImages = [],
      galleryVideos = [],
    } = data;

    const newEvent = await Event.create({
      title,
      description,
      type,
      date: new Date(date),
      time,
      heldingPlace,
      isVisible,
      mainImage: mainImageUrl,
      galleryImages,
      galleryVideos,
    });

    await logActivity({
      actionType: "CREATE",
      module: "Events",
      title: "Event Created",
      description: `Created new event: "${title}"`,
      icon: "CalendarPlus",
    });

    return NextResponse.json(
      {
        success: true,
        data: newEvent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Event Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create event" },
      { status: 500 },
    );
  }
}
