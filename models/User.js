import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["admin", "alumni", "student"],
      default: "student",
    },
    name: {
      type: String,
      trim: true,
    },
    image: String,
    imagePublicId: String,
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
