import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const user = await User.findById(id).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (session.user.id !== id && session.user.role !== "super_admin") {
      if (user.role === "admin" && !hasPermission(session.user, "permission_management", "manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (user.role === "alumni" && !hasPermission(session.user, "alumni", "manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const {
      name, userId, email, password, role, phone, dob, status,
      house_name, father_name, address, district, custom_district,
      post_office, pincode, batch, education, current_job, custom_job,
      job_location, imageUrl, imagePublicId, permissions,
    } = data;

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
      job_location,
    };

    if (session.user.role === "super_admin" || (session.user.id !== id && hasPermission(session.user, "permission_management", "manage"))) {
      if (permissions) {
        updateData.permissions = permissions;
      }
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // If the frontend uploaded a new image, destroy old one and save new URL
    if (imageUrl && imageUrl !== user.image) {
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }
      updateData.image = imageUrl;
      updateData.imagePublicId = imagePublicId || "";
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    await logActivity({
      actionType: "UPDATE",
      module: "User Management",
      title: "User Updated",
      description: `Updated profile for ${updatedUser.role}: "${updatedUser.name || updatedUser.userId}"`,
      icon: updatedUser.role === "admin" ? "UserCog" : "User",
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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (session.user.role !== "super_admin") {
      if (user.role === "admin" && !hasPermission(session.user, "permission_management", "manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (user.role === "alumni" && !hasPermission(session.user, "alumni", "manage")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Destroy image in Cloudinary
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    await User.findByIdAndDelete(id);

    await logActivity({
      actionType: "DELETE",
      module: "User Management",
      title: "User Deleted",
      description: `Deleted ${user.role}: "${user.name || user.userId}"`,
      icon: "UserMinus",
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
