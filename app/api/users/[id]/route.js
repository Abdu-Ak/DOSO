import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET User Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.formData();

    const user = await User.findById(id).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const name = data.get("name");
    const userId = data.get("userId");
    const email = data.get("email");
    const password = data.get("password");
    const role = data.get("role");
    const phone = data.get("phone");
    const dob = data.get("dob");
    const status = data.get("status");
    const imageFile = data.get("image");

    // Alumni fields
    const house_name = data.get("house_name");
    const father_name = data.get("father_name");
    const address = data.get("address");
    const district = data.get("district");
    const custom_district = data.get("custom_district");
    const post_office = data.get("post_office");
    const pincode = data.get("pincode");
    const batch = data.get("batch");
    const education = data.get("education");
    const current_job = data.get("current_job");
    const custom_job = data.get("custom_job");

    // Check if new email/userId is taken by another user
    const existingUser = await User.findOne({
      _id: { $ne: id },
      $or: [{ email: email.toLowerCase() }, { userId }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or User ID already in use" },
        { status: 400 },
      );
    }

    let updateData = {
      name,
      userId,
      email: email.toLowerCase(),
      role,
      phone,
      dob: dob ? new Date(dob) : null,
      status,
      // alumni fields
      house_name,
      father_name,
      address,
      district,
      custom_district,
      post_office,
      pincode,
      batch,
      education,
      current_job,
      custom_job,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (imageFile && imageFile.name && imageFile.size > 0) {
      // Destroy old image if exists
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }

      // Upload new image
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

      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Destroy image in Cloudinary
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
