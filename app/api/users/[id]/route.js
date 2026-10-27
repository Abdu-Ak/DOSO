import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "@/lib/permissions";
import {
  getDuplicateKeyField,
  hasNormalizedPhoneConflict,
  normalizeEmail,
  normalizeIndianPhone,
} from "@/lib/uniqueIdentityFields";

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

    const normalizedEmail = normalizeEmail(email);

    const existingEmail = await User.exists({
      _id: { $ne: id },
      email: normalizedEmail,
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email address already in use" },
        { status: 409 },
      );
    }

    const existingUserId = await User.exists({
      _id: { $ne: id },
      userId,
    });
    if (existingUserId) {
      return NextResponse.json(
        { error: "User ID already in use" },
        { status: 409 },
      );
    }

    const updateData = {
      name,
      userId,
      email: normalizedEmail,
      role,
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

    const updateOperation = { $set: updateData };
    const destinationIsAlumni = role === "alumni";

    if (destinationIsAlumni) {
      const normalizedPhone = normalizeIndianPhone(phone);
      const currentPhone = normalizeIndianPhone(user.phone).value;
      const rawPhoneUnchanged =
        user.role === "alumni" &&
        String(phone ?? "").trim() === String(user.phone ?? "").trim();
      const normalizedPhoneUnchanged =
        user.role === "alumni" &&
        Boolean(normalizedPhone.value) &&
        normalizedPhone.value === currentPhone;
      const phoneChanged =
        !rawPhoneUnchanged && !normalizedPhoneUnchanged;

      if (phoneChanged) {
        if (normalizedPhone.error || !normalizedPhone.value) {
          return NextResponse.json(
            { error: normalizedPhone.error || "Phone number is required" },
            { status: 400 },
          );
        }

        if (
          await hasNormalizedPhoneConflict(User, normalizedPhone.value, {
            excludeId: id,
            query: { role: "alumni" },
          })
        ) {
          return NextResponse.json(
            { error: "Phone number already in use" },
            { status: 409 },
          );
        }

        updateData.phone = normalizedPhone.value;
        updateData.phoneUniqueKey = normalizedPhone.value;
      }
    } else {
      updateData.phone = phone;
      updateOperation.$unset = { phoneUniqueKey: "" };
    }

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

    const updatedUser = await User.findByIdAndUpdate(id, updateOperation, {
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

    const duplicateField = getDuplicateKeyField(error);
    if (duplicateField) {
      const message =
        duplicateField === "phoneUniqueKey"
          ? "Phone number already in use"
          : duplicateField === "email"
            ? "Email address already in use"
            : duplicateField === "userId"
              ? "User ID already in use"
              : "A user with the same unique information already exists";
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to update user" },
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
