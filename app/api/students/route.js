import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logActivity } from "@/lib/activityLogger";
import { hasPermission } from "@/lib/permissions";
import {
  getDuplicateKeyField,
  hasNormalizedAadhaarConflict,
  hasNormalizedPhoneConflict,
  normalizeAadhaar,
  normalizeIndianPhone,
} from "@/lib/uniqueIdentityFields";

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
    const lastSeq = parseInt(parts[2]); // DOSO-ST-001 -> index 2
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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "students", "access")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "students", "manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const { district, dob, imageUrl, imagePublicId } = data;
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

    if (await hasNormalizedPhoneConflict(Student, normalizedPhone.value)) {
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

    const studentData = {
      name: data.name,
      phone: normalizedPhone.value,
      dob: new Date(dob),
      status: data.status || "Pending",
      current_madrasa_class: data.current_madrasa_class,
      current_school_class: data.current_school_class,
      house_name: data.house_name,
      address: data.address,
      district,
      custom_district: data.custom_district,
      father_name: data.father_name,
      guardian_name: data.guardian_name,
      guardian_phone: data.guardian_phone,
      guardian_relation: data.guardian_relation,
      guardian_occupation: data.guardian_occupation,
      date_of_admission: new Date(data.date_of_admission),
      source: data.source || "admin",
      studentId,
      aadhar_number: normalizedAadhaar.value,
      identification_mark: data.identification_mark,
      image: imageUrl || "",
      imagePublicId: imagePublicId || "",
    };

    const student = await Student.create(studentData);

    await logActivity({
      actionType: "CREATE",
      module: "Student Management",
      title: "Student Created",
      description: `Created new student: "${studentData.name}" (ID: ${studentId})`,
      icon: "UserPlus",
    });

    return NextResponse.json({ success: true, student }, { status: 201 });
  } catch (error) {
    console.error("POST Student Error:", error);

    const duplicateField = getDuplicateKeyField(error);
    if (duplicateField) {
      const messages = {
        phone: "Phone number already in use",
        aadhar_number: "Aadhaar number already in use",
        studentId: "Generated student ID conflict. Please try again.",
      };
      return NextResponse.json(
        { error: messages[duplicateField] || "Duplicate information detected" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 },
    );
  }
}
