import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import cloudinary from "@/lib/cloudinary";
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

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "students", "access")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("GET Student Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "students", "manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

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

    const currentPhone = normalizeIndianPhone(student.phone).value;
    const currentAadhaar = normalizeAadhaar(student.aadhar_number).value;
    const phoneChanged = normalizedPhone.value !== currentPhone;
    const aadhaarChanged = normalizedAadhaar.value !== currentAadhaar;

    if (
      phoneChanged &&
      (await hasNormalizedPhoneConflict(Student, normalizedPhone.value, {
        excludeId: id,
      }))
    ) {
      return NextResponse.json(
        { error: "Phone number already in use" },
        { status: 409 },
      );
    }
    if (
      aadhaarChanged &&
      (await hasNormalizedAadhaarConflict(Student, normalizedAadhaar.value, {
        excludeId: id,
      }))
    ) {
      return NextResponse.json(
        { error: "Aadhaar number already in use" },
        { status: 409 },
      );
    }

    let imageUrl = student.image;
    let imagePublicId = student.imagePublicId;

    // If the frontend uploaded a new image, it sends new imageUrl + imagePublicId
    if (data.imageUrl && data.imageUrl !== student.image) {
      // Destroy old image from Cloudinary
      if (student.imagePublicId) {
        await cloudinary.uploader.destroy(student.imagePublicId);
      }
      imageUrl = data.imageUrl;
      imagePublicId = data.imagePublicId || "";
    }

    const updateData = {
      name: data.name,
      dob: data.dob ? new Date(data.dob) : student.dob,
      status: data.status || student.status,
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
      date_of_admission: data.date_of_admission
        ? new Date(data.date_of_admission)
        : student.date_of_admission,
      image: imageUrl,
      imagePublicId,
      identification_mark: data.identification_mark,
    };

    const unsetData = {};
    if (phoneChanged) {
      if (normalizedPhone.value) {
        updateData.phone = normalizedPhone.value;
      } else {
        unsetData.phone = "";
      }
    }
    if (aadhaarChanged) {
      if (normalizedAadhaar.value) {
        updateData.aadhar_number = normalizedAadhaar.value;
      } else {
        unsetData.aadhar_number = "";
      }
    }

    const updateOperation = { $set: updateData };
    if (Object.keys(unsetData).length) {
      updateOperation.$unset = unsetData;
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updateOperation, {
      new: true,
      runValidators: true,
    });

    await logActivity({
      actionType: "UPDATE",
      module: "Student Management",
      title: "Student Updated",
      description: `Updated student: "${updatedStudent.name}" (ID: ${updatedStudent.studentId})`,
      icon: "User",
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error("PUT Student Error:", error);

    const duplicateField = getDuplicateKeyField(error);
    if (duplicateField) {
      const messages = {
        phone: "Phone number already in use",
        aadhar_number: "Aadhaar number already in use",
      };
      return NextResponse.json(
        { error: messages[duplicateField] || "Duplicate information detected" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(session.user, "students", "manage")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (student.imagePublicId) {
      await cloudinary.uploader.destroy(student.imagePublicId);
    }

    await Student.findByIdAndDelete(id);

    await logActivity({
      actionType: "DELETE",
      module: "Student Management",
      title: "Student Deleted",
      description: `Deleted student: "${student.name}" (ID: ${student.studentId})`,
      icon: "UserMinus",
    });

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Student Error:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 },
    );
  }
}
