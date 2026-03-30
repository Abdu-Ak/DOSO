import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";

// Helper for Cloudinary Uploads
const uploadToCloudinary = async (file, folder, resourceType = "auto") => {
  if (!file || file.size === 0 || typeof file === "string") return file; // if already URL string
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
    const isVisible = searchParams.get("isVisible"); // Optional filter for public side

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
    // Sort upcoming events first on public side? The query asks "upcoming need to be on top like that".
    // We can just sort by date ascending if upcoming implies future ones first, or -1 for newest first.
    // Assuming standard date descending (newest on top).
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
    const data = await request.formData();

    const title = data.get("title");
    const description = data.get("description");
    const type = data.get("type");
    const date = data.get("date");
    const time = data.get("time");
    const heldingPlace = data.get("heldingPlace");
    const isVisible = data.get("isVisible") === "true";

    // Files
    const mainImageFile = data.get("mainImage");
    const galleryImageFiles = data.getAll("galleryImages");
    const galleryVideoFiles = data.getAll("galleryVideos");

    // Upload Main Image
    const mainImageUrl =
      mainImageFile && mainImageFile.size > 0
        ? await uploadToCloudinary(mainImageFile, "doso_events/main", "image")
        : "";

    // Upload Gallery Images
    const uploadedGalleryImages = [];
    for (const img of galleryImageFiles) {
      if (img && img.size > 0 && typeof img !== "string") {
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

    // Upload Gallery Videos
    const uploadedGalleryVideos = [];
    for (const vid of galleryVideoFiles) {
      if (vid && vid.size > 0 && typeof vid !== "string") {
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

    const newEvent = await Event.create({
      title,
      description,
      type,
      date: new Date(date),
      time,
      heldingPlace,
      isVisible,
      mainImage: mainImageUrl,
      galleryImages: uploadedGalleryImages,
      galleryVideos: uploadedGalleryVideos,
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
