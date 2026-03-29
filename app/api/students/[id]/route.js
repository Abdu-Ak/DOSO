import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import cloudinary from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
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
    const { id } = await params;
    await dbConnect();
    const data = await request.formData();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const email = data.get("email");
    if (email && email.toLowerCase() !== student.email) {
      const existingStudent = await Student.findOne({
        email: email.toLowerCase(),
      });
      if (existingStudent) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }
    }

    let imageUrl = student.image;
    let imagePublicId = student.imagePublicId;
    const imageFile = data.get("image");

    if (imageFile && imageFile.size > 0 && typeof imageFile !== "string") {
      // Delete old image if exists
      if (student.imagePublicId) {
        await cloudinary.uploader.destroy(student.imagePublicId);
      }

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

    const dob = data.get("dob");
    const admissionDate = data.get("date_of_admission");

    const updateData = {
      name: data.get("name"),
      email: email ? email.toLowerCase() : student.email,
      phone: data.get("phone"),
      dob: dob ? new Date(dob) : student.dob,
      status: data.get("status") || student.status,
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
      date_of_admission: admissionDate
        ? new Date(admissionDate)
        : student.date_of_admission,
      image: imageUrl,
      imagePublicId,
    };

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error("PUT Student Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update student" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (student.imagePublicId) {
      await cloudinary.uploader.destroy(student.imagePublicId);
    }

    await Student.findByIdAndDelete(id);

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
