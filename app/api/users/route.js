import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";

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
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const isSuperAdmin = session.user?.role === "super_admin";
    const isAdmin = session.user?.role === "admin";

    if (!isSuperAdmin) {
      if (!isAdmin) {
        // Standard users (alumni/students) can only list/search alumni
        if (role.toLowerCase() !== "alumni") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } else {
        // Admins must have alumni:access or alumni:manage permission
        if (
          !hasPermission(session.user, "alumni", "access") &&
          !hasPermission(session.user, "alumni", "manage")
        ) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    const status = searchParams.get("status") || "";
    const district = searchParams.get("district") || "";
    const batch = searchParams.get("batch") || "";
    const industry = searchParams.get("industry") || "";
    const all = searchParams.get("all") === "true";

    const skip = (page - 1) * limit;

    const query = {
      role: { $ne: "super_admin" },
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { userId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { father_name: { $regex: search, $options: "i" } },
        { batch: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role.toLowerCase();
    }

    if (status) {
      query.status = status;
    }

    if (district) {
      query.district = district;
    }

    if (batch) {
      // Extract 4-digit year if present (handles "Batch of 2024" or just "2024")
      const yearMatch = batch.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : batch;

      // Use regex to match the year, ensuring it works even if stored as a slightly different string
      // or to handle potential leading/trailing characters.
      query.batch = { $regex: year, $options: "i" };
    }

    if (industry && industry !== "All Industries") {
      query.$or = [
        ...(query.$or || []),
        { current_job: { $regex: industry, $options: "i" } },
        { custom_job: { $regex: industry, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);

    let usersQuery = User.find(query).sort({ createdAt: -1 });

    if (!all) {
      usersQuery = usersQuery.skip(skip).limit(limit);
    }

    const users = await usersQuery;

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

async function generateUserId(role) {
  if (role === "admin") return null;

  const prefix = `DOSO-AL`;

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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const role = data.get("role");

    if (role === "admin") {
      if (!hasPermission(session.user, "permission_management", "manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      if (!hasPermission(session.user, "alumni", "manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
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
      userFields.dob = data.get("dob") ? new Date(data.get("dob")) : undefined;
      userFields.current_job = data.get("current_job");
      userFields.custom_job = data.get("custom_job");
      userFields.job_location = data.get("job_location");

      userFields.userId = await generateUserId(role);
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

    await logActivity({
      actionType: "CREATE",
      module: "User Management",
      title: `${role === "admin" ? "Admin" : "Alumni"} Created`,
      description: `Created new ${role}: "${userFields.name || userFields.userId}"`,
      icon: role === "admin" ? "UserCog" : "User",
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
