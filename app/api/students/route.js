import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import cloudinary from "@/lib/cloudinary";

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

async function generateStudentId(district, yearDate) {
  const districtCode = DISTRICT_CODES[district] || "OTH";
  const year = new Date(yearDate).getFullYear();
  const prefix = `S-${districtCode}-${year}`;

  const lastStudent = await Student.findOne({
    studentId: new RegExp(`^${prefix}-`),
  })
    .sort({ studentId: -1 })
    .select("studentId");

  let sequence = 1;
  if (lastStudent && lastStudent.studentId) {
    const parts = lastStudent.studentId.split("-");
    const lastSeq = parseInt(parts[3]); // S-MLP-2024-001 -> index 3
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  const paddedSequence = sequence.toString().padStart(3, "0");
  return `${prefix}-${paddedSequence}`;
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const district = searchParams.get("district") || "";
    const madrasa_class = searchParams.get("current_madrasa_class") || "";
    const school_class = searchParams.get("current_school_class") || "";

    const all = searchParams.get("all") === "true";
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (district) query.district = district;
    if (madrasa_class) query.current_madrasa_class = madrasa_class;
    if (school_class) query.current_school_class = school_class;

    const total = await Student.countDocuments(query);
    let studentsQuery = Student.find(query).sort({ createdAt: -1 });

    if (!all) {
      studentsQuery = studentsQuery.skip(skip).limit(limit);
    }

    const students = await studentsQuery;

    return NextResponse.json({
      students,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET Students Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.formData();

    const email = data.get("email");
    const imageFile = data.get("image");
    const district = data.get("district");
    const dob = data.get("dob");

    if (email) {
      const existingStudent = await Student.findOne({
        email: email.toLowerCase(),
      });
      if (existingStudent) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 },
        );
      }
    }

    const studentId = await generateStudentId(district, dob);

    let imageUrl = "";
    let imagePublicId = "";

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "students" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      const result = await uploadPromise;
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const studentData = {
      name: data.get("name"),
      email: email ? email.toLowerCase() : undefined,
      phone: data.get("phone"),
      dob: new Date(dob),
      status: data.get("status") || "Pending",
      current_madrasa_class: data.get("current_madrasa_class"),
      current_school_class: data.get("current_school_class"),
      house_name: data.get("house_name"),
      address: data.get("address"),
      district: district,
      custom_district: data.get("custom_district"),
      father_name: data.get("father_name"),
      guardian_name: data.get("guardian_name"),
      guardian_phone: data.get("guardian_phone"),
      guardian_relation: data.get("guardian_relation"),
      guardian_occupation: data.get("guardian_occupation"),
      date_of_admission: new Date(data.get("date_of_admission")),
      source: data.get("source") || "admin",
      studentId,
      image: imageUrl,
      imagePublicId,
    };

    const student = await Student.create(studentData);

    return NextResponse.json({ success: true, student }, { status: 201 });
  } catch (error) {
    console.error("POST Student Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 500 },
    );
  }
}
