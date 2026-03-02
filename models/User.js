import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      select: false,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "alumni", "student"],
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
    // Student specific fields
    madrasa_name: String,
    house_name: String,
    address: String,
    district: String,
    custom_district: String,
    father_name: String,
    guardian_name: String,
    guardian_phone: String,
    guardian_relation: String,
    guardian_occupation: String,
    date_of_admission: Date,

    // Alumni specific fields
    post_office: String,
    pincode: String,
    batch: String,
    education: String,

    // Backend generated ID or Admin Username
    userId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
