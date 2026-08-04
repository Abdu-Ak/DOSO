import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("GET Event Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "events", "manage")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

    const updateData = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.time !== undefined) updateData.time = data.time;
    if (data.heldingPlace !== undefined) updateData.heldingPlace = data.heldingPlace;
    if (data.isVisible !== undefined) updateData.isVisible = data.isVisible;
    if (data.mainImageUrl !== undefined) updateData.mainImage = data.mainImageUrl;
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages;
    if (data.galleryVideos !== undefined) updateData.galleryVideos = data.galleryVideos;

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    await logActivity({
      actionType: "UPDATE",
      module: "Events",
      title: "Event Updated",
      description: `Updated event: "${updatedEvent.title}"`,
      icon: "Calendar",
    });

    return NextResponse.json(
      { success: true, data: updatedEvent },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT Event Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update event" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "events", "manage")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

    await logActivity({
      actionType: "DELETE",
      module: "Events",
      title: "Event Deleted",
      description: `Deleted event: "${event.title}"`,
      icon: "CalendarX",
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event" },
      { status: 500 },
    );
  }
}
