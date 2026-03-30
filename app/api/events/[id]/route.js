import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";

const uploadToCloudinary = async (file, folder, resourceType = "auto") => {
  if (!file || file.size === 0 || typeof file === "string") return file;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: resourceType },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
};

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
    const { id } = await params;
    await dbConnect();
    const data = await request.formData();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

    const updateData = {};

    if (data.has("title")) updateData.title = data.get("title");
    if (data.has("description"))
      updateData.description = data.get("description");
    if (data.has("type")) updateData.type = data.get("type");
    if (data.has("date")) updateData.date = new Date(data.get("date"));
    if (data.has("time")) updateData.time = data.get("time");
    if (data.has("heldingPlace"))
      updateData.heldingPlace = data.get("heldingPlace");
    if (data.has("isVisible")) {
      updateData.isVisible = data.get("isVisible") === "true";
    }

    // Process Files only if provided
    if (data.has("mainImage")) {
      const mainImageFile = data.get("mainImage");
      let mainImageUrl = event.mainImage;
      if (
        mainImageFile &&
        mainImageFile !== "undefined" &&
        typeof mainImageFile !== "string" &&
        mainImageFile.size > 0
      ) {
        mainImageUrl = await uploadToCloudinary(
          mainImageFile,
          "doso_events/main",
          "image",
        );
      } else if (
        typeof mainImageFile === "string" &&
        mainImageFile.startsWith("http")
      ) {
        mainImageUrl = mainImageFile;
      }
      updateData.mainImage = mainImageUrl;
    }

    if (data.has("galleryImages")) {
      const galleryImageFiles = data.getAll("galleryImages");
      const uploadedGalleryImages = [];
      for (const img of galleryImageFiles) {
        if (img && typeof img !== "string" && img.size > 0) {
          const url = await uploadToCloudinary(
            img,
            "doso_events/gallery_images",
            "image",
          );
          if (url) uploadedGalleryImages.push(url);
        } else if (typeof img === "string" && img.startsWith("http")) {
          uploadedGalleryImages.push(img);
        }
      }
      updateData.galleryImages = uploadedGalleryImages;
    }

    if (data.has("galleryVideos")) {
      const galleryVideoFiles = data.getAll("galleryVideos");
      const uploadedGalleryVideos = [];
      for (const vid of galleryVideoFiles) {
        if (vid && typeof vid !== "string" && vid.size > 0) {
          const url = await uploadToCloudinary(
            vid,
            "doso_events/gallery_videos",
            "video",
          );
          if (url) uploadedGalleryVideos.push(url);
        } else if (typeof vid === "string" && vid.startsWith("http")) {
          uploadedGalleryVideos.push(vid);
        }
      }
      updateData.galleryVideos = uploadedGalleryVideos;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
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
    const { id } = await params;
    await dbConnect();
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

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
