import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function generateStudentId() {
  const prefix = `DOSO-ST`;

  const lastStudent = await Student.findOne({
    studentId: new RegExp(`^${prefix}-`),
  })
    .sort({ studentId: -1 })
    .select("studentId");

  let sequence = 1;
  if (lastStudent && lastStudent.studentId) {
    const parts = lastStudent.studentId.split("-");
    const lastSeq = parseInt(parts[2]);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  const paddedSequence = sequence.toString().padStart(3, "0");
  return `${prefix}-${paddedSequence}`;
}

async function generateAlumniId() {
  const prefix = `DOSO-AL`;

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
    const data = await request.json();

    const { role, email, imageUrl = "", imagePublicId = "" } = data;

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

    if (role === "student") {
      const studentId = await generateStudentId();

      await Student.create({
        name: data.name,
        phone: data.phone,
        email: email ? email.toLowerCase() : undefined,
        dob: new Date(data.dob),
        status: "Pending",
        current_madrasa_class: data.current_madrasa_class,
        current_school_class: data.current_school_class,
        house_name: data.house_name,
        address: data.address,
        district: data.district,
        custom_district: data.custom_district,
        father_name: data.father_name,
        guardian_name: data.guardian_name,
        guardian_phone: data.guardian_phone,
        guardian_relation: data.guardian_relation,
        guardian_occupation: data.guardian_occupation,
        date_of_admission: new Date(data.date_of_admission),
        source: "public",
        studentId,
        image: imageUrl,
        imagePublicId,
      });

      return NextResponse.json(
        { message: "Registration submitted successfully" },
        { status: 201 },
      );
    }

    // Alumni registration
    const userFields = {
      role,
      email: email ? email.toLowerCase() : undefined,
      phone: data.phone,
      name: data.name,
      house_name: data.house_name,
      father_name: data.father_name,
      address: data.address,
      post_office: data.post_office,
      district: data.district,
      custom_district: data.custom_district,
      pincode: data.pincode,
      batch: data.batch,
      education: data.education,
      dob: data.dob ? new Date(data.dob) : undefined,
      current_job: data.current_job,
      custom_job: data.custom_job,
      job_location: data.job_location,
      status: "Pending",
      source: "public",
      userId: await generateAlumniId(),
    };

    // Set a placeholder password (user can't log in until approved)
    const placeholder = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(placeholder, 10);

    await User.create({
      ...userFields,
      password: hashedPassword,
      image: imageUrl,
      imagePublicId,
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
