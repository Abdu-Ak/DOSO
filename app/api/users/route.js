import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const query = {
      role: { $ne: "super_admin" },
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { userId: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role.toLowerCase();
    }

    if (status) {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

const DISTRICT_CODES = {
  Thiruvananthapuram: "TVM",
  Kollam: "KLM",
  Pathanamthitta: "PTA",
  Alappuzha: "ALP",
  Kottayam: "KTM",
  Idukki: "IDK",
  Ernakulam: "EKM",
  Thrissur: "TSR",
  Palakkad: "PKD",
  Malappuram: "MLP",
  Kozhikode: "KKD",
  Wayanad: "WYD",
  Kannur: "KNR",
  Kasaragod: "KSD",
  Other: "OTH",
};

async function generateUserId(role, district, yearDate) {
  if (role === "admin") return null;

  const districtCode = DISTRICT_CODES[district] || "OTH";
  const year = new Date(yearDate).getFullYear();
  const prefix = `${districtCode}-${year}`;

  // Find the highest sequence number for this prefix
  const lastUser = await User.findOne({ userId: new RegExp(`^${prefix}-`) })
    .sort({ userId: -1 })
    .select("userId");

  let sequence = 1;
  if (lastUser && lastUser.userId) {
    const parts = lastUser.userId.split("-");
    const lastSeq = parseInt(parts[2]);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  const paddedSequence = sequence.toString().padStart(3, "0");
  return `${prefix}-${paddedSequence}`;
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.formData();

    const role = data.get("role");
    const email = data.get("email");
    const password = data.get("password");
    const status = data.get("status");
    const imageFile = data.get("image");

    // Check if user already exists by email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Role-specific field extraction
    let userFields = {
      role,
      email: email.toLowerCase(),
      status,
      phone: data.get("phone"),
    };

    if (role === "admin") {
      const userId = data.get("userId");
      const existingUserId = await User.findOne({ userId });
      if (existingUserId) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 },
        );
      }
      userFields.name = data.get("name");
      userFields.userId = userId;
    } else if (role === "student") {
      userFields.madrasa_name = data.get("madrasa_name");
      userFields.name = data.get("name");
      userFields.house_name = data.get("house_name");
      userFields.address = data.get("address");
      userFields.district = data.get("district");
      userFields.custom_district = data.get("custom_district");
      userFields.dob = data.get("dob") ? new Date(data.get("dob")) : null;
      userFields.father_name = data.get("father_name");
      userFields.guardian_name = data.get("guardian_name");
      userFields.guardian_phone = data.get("guardian_phone");
      userFields.guardian_relation = data.get("guardian_relation");
      userFields.guardian_occupation = data.get("guardian_occupation");
      userFields.date_of_admission = data.get("date_of_admission")
        ? new Date(data.get("date_of_admission"))
        : null;

      const districtForId =
        data.get("district") === "Other"
          ? data.get("custom_district")
          : data.get("district");
      userFields.userId = await generateUserId(
        role,
        districtForId,
        userFields.date_of_admission || new Date(),
      );
    } else if (role === "alumni") {
      userFields.name = data.get("name");
      userFields.house_name = data.get("house_name");
      userFields.father_name = data.get("father_name");
      userFields.address = data.get("address");
      userFields.post_office = data.get("post_office");
      userFields.district = data.get("district");
      userFields.custom_district = data.get("custom_district");
      userFields.pincode = data.get("pincode");
      userFields.batch = data.get("batch");
      userFields.education = data.get("education");

      const districtForId =
        data.get("district") === "Other"
          ? data.get("custom_district")
          : data.get("district");
      const batchYear = data.get("batch")
        ? `${data.get("batch")}-01-01`
        : new Date();
      userFields.userId = await generateUserId(role, districtForId, batchYear);
    }

    let imageData = { url: "", publicId: "" };
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "doso_users" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...userFields,
      password: hashedPassword,
      image: imageData.url,
      imagePublicId: imageData.publicId,
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST User Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}
