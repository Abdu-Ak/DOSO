import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
    const lastSeq = parseInt(parts[3]);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  const paddedSequence = sequence.toString().padStart(3, "0");
  return `${prefix}-${paddedSequence}`;
}

async function generateAlumniId(district, yearDate) {
  const districtCode = DISTRICT_CODES[district] || "OTH";
  const year = new Date(yearDate).getFullYear();
  const prefix = `${districtCode}-${year}`;

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

  return `${prefix}-${sequence.toString().padStart(3, "0")}`;
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.formData();

    const role = data.get("role");
    const email = data.get("email");
    const imageFile = data.get("image");

    if (!["student", "alumni"].includes(role)) {
      return NextResponse.json(
        { error: "Only student and alumni registrations are allowed" },
        { status: 400 },
      );
    }

    const existingModel = role === "student" ? Student : User;
    if (email) {
      const existingEntry = await existingModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingEntry) {
        return NextResponse.json(
          {
            error: `${role.charAt(0).toUpperCase() + role.slice(1)} with this email already exists`,
          },
          { status: 400 },
        );
      }
    }

    let userFields = {
      role,
      email: email ? email.toLowerCase() : undefined,
      phone: data.get("phone"),
      status: "Pending",
      source: "public",
    };

    if (role === "student") {
      const studentData = {
        name: data.get("name"),
        phone: data.get("phone"),
        dob: new Date(data.get("dob")),
        status: "Pending",
        current_madrasa_class: data.get("current_madrasa_class"),
        current_school_class: data.get("current_school_class"),
        house_name: data.get("house_name"),
        address: data.get("address"),
        district: data.get("district"),
        custom_district: data.get("custom_district"),
        father_name: data.get("father_name"),
        guardian_name: data.get("guardian_name"),
        guardian_phone: data.get("guardian_phone"),
        guardian_relation: data.get("guardian_relation"),
        guardian_occupation: data.get("guardian_occupation"),
        date_of_admission: new Date(data.get("date_of_admission")),
        source: "public",
      };

      const districtForId =
        data.get("district") === "Other"
          ? data.get("custom_district")
          : data.get("district");
      studentData.studentId = await generateStudentId(
        districtForId,
        studentData.date_of_admission || new Date(),
      );

      // Handle image upload for student
      let imageData = { url: "", publicId: "" };
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "students" }, (error, result) => {
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

      await Student.create({
        ...studentData,
        image: imageData.url,
        imagePublicId: imageData.publicId,
      });

      return NextResponse.json(
        { message: "Registration submitted successfully" },
        { status: 201 },
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
      userFields.dob = data.get("dob") ? new Date(data.get("dob")) : undefined;
      userFields.current_job = data.get("current_job");
      userFields.custom_job = data.get("custom_job");
      userFields.job_location = data.get("job_location");

      const districtForId =
        data.get("district") === "Other"
          ? data.get("custom_district")
          : data.get("district");
      const batchYear = data.get("batch")
        ? `${data.get("batch")}-01-01`
        : new Date();
      userFields.userId = await generateAlumniId(districtForId, batchYear);
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

    // Set a placeholder password (user can't log in until approved)
    const placeholder = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(placeholder, 10);

    const newUser = await User.create({
      ...userFields,
      password: hashedPassword,
      image: imageData.url,
      imagePublicId: imageData.publicId,
    });

    return NextResponse.json(
      { message: "Registration submitted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Public Registration Error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 },
    );
  }
}
