import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";
import cloudinary from "@/lib/cloudinary";

// Helper for Cloudinary Uploads
const uploadToCloudinary = async (file, folder) => {
  if (!file || typeof file === "string") return file;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
};

export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne();
    if (!settings) {
      // Return empty structure or defaults if needed,
      // but usually the frontend handles the absence.
      return NextResponse.json({ success: true, settings: {} });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.formData();

    // Parse leadership data
    const leadership = {
      president: {
        name: data.get("leadership.president.name"),
        title: data.get("leadership.president.title"),
        email: data.get("leadership.president.email"),
        phone: data.get("leadership.president.phone"),
      },
      secretary: {
        name: data.get("leadership.secretary.name"),
        title: data.get("leadership.secretary.title"),
        email: data.get("leadership.secretary.email"),
        phone: data.get("leadership.secretary.phone"),
      },
      headmaster: {
        name: data.get("leadership.headmaster.name"),
        title: data.get("leadership.headmaster.title"),
        email: data.get("leadership.headmaster.email"),
        phone: data.get("leadership.headmaster.phone"),
      },
    };

    // Handle Images
    const presidentImage = data.get("leadership.president.image");
    const secretaryImage = data.get("leadership.secretary.image");
    const headmasterImage = data.get("leadership.headmaster.image");

    if (presidentImage && typeof presidentImage !== "string") {
      leadership.president.image = await uploadToCloudinary(
        presidentImage,
        "doso_settings/leadership",
      );
    } else {
      leadership.president.image =
        data.get("leadership.president.currentImage") || "";
    }

    if (secretaryImage && typeof secretaryImage !== "string") {
      leadership.secretary.image = await uploadToCloudinary(
        secretaryImage,
        "doso_settings/leadership",
      );
    } else {
      leadership.secretary.image =
        data.get("leadership.secretary.currentImage") || "";
    }

    if (headmasterImage && typeof headmasterImage !== "string") {
      leadership.headmaster.image = await uploadToCloudinary(
        headmasterImage,
        "doso_settings/leadership",
      );
    } else {
      leadership.headmaster.image =
        data.get("leadership.headmaster.currentImage") || "";
    }

    // Parse contact data
    const contact = {
      email: data.get("contact.email"),
      phone: data.get("contact.phone"),
      address: data.get("contact.address"),
      mapLink: data.get("contact.mapLink"),
    };

    const updatedSettings = await Setting.findOneAndUpdate(
      {},
      { leadership, contact },
      { upsert: true, new: true },
    );

    revalidatePath("/");
    revalidatePath("/contact");

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("PUT Settings Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 },
    );
  }
}
