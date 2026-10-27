import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  getDuplicateKeyField,
  hasNormalizedAadhaarConflict,
  hasNormalizedPhoneConflict,
  normalizeAadhaar,
  normalizeEmail,
  normalizeIndianPhone,
} from "@/lib/uniqueIdentityFields";

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

    const { role, imageUrl = "", imagePublicId = "" } = data;
    const email = normalizeEmail(data.email);

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
            error: "Email address already in use",
          },
          { status: 409 },
        );
      }
    }

    if (role === "student") {
      const normalizedPhone = normalizeIndianPhone(data.phone);
      const normalizedAadhaar = normalizeAadhaar(data.aadhar_number);

      if (normalizedPhone.error) {
        return NextResponse.json(
          { error: normalizedPhone.error },
          { status: 400 },
        );
      }
      if (normalizedAadhaar.error) {
        return NextResponse.json(
          { error: normalizedAadhaar.error },
          { status: 400 },
        );
      }

      if (
        await hasNormalizedPhoneConflict(Student, normalizedPhone.value)
      ) {
        return NextResponse.json(
          { error: "Phone number already in use" },
          { status: 409 },
        );
      }
      if (
        await hasNormalizedAadhaarConflict(Student, normalizedAadhaar.value)
      ) {
        return NextResponse.json(
          { error: "Aadhaar number already in use" },
          { status: 409 },
        );
      }

      const studentId = await generateStudentId();

      await Student.create({
        name: data.name,
        phone: normalizedPhone.value,
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
        aadhar_number: normalizedAadhaar.value,
        identification_mark: data.identification_mark,
        image: imageUrl,
        imagePublicId,
      });

      return NextResponse.json(
        { message: "Registration submitted successfully" },
        { status: 201 },
      );
    }

    // Alumni registration
    const normalizedPhone = normalizeIndianPhone(data.phone);
    if (normalizedPhone.error || !normalizedPhone.value) {
      return NextResponse.json(
        { error: normalizedPhone.error || "Phone number is required" },
        { status: 400 },
      );
    }

    if (
      await hasNormalizedPhoneConflict(User, normalizedPhone.value, {
        query: { role: "alumni" },
      })
    ) {
      return NextResponse.json(
        { error: "Phone number already in use" },
        { status: 409 },
      );
    }

    const userFields = {
      role,
      email,
      phone: normalizedPhone.value,
      phoneUniqueKey: normalizedPhone.value,
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

    const duplicateField = getDuplicateKeyField(error);
    if (duplicateField) {
      const messages = {
        email: "Email address already in use",
        phone: "Phone number already in use",
        phoneUniqueKey: "Phone number already in use",
        aadhar_number: "Aadhaar number already in use",
        studentId: "Generated student ID conflict. Please try again.",
        userId: "Generated alumni ID conflict. Please try again.",
      };
      return NextResponse.json(
        { error: messages[duplicateField] || "Duplicate information detected" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 },
    );
  }
}
