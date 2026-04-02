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
      select: false,
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "alumni"],
      default: "alumni",
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

    // Alumni specific fields
    house_name: String,
    father_name: String,
    address: String,
    district: String,
    custom_district: String,
    post_office: String,
    pincode: String,
    batch: String,
    education: String,
    current_job: String,
    custom_job: String,

    // Public registration fields
    source: {
      type: String,
      enum: ["admin", "public"],
      default: "admin",
    },
    rejectionReason: String,
    tempPasswordSet: {
      type: Boolean,
      default: false,
    },

    // Backend generated ID or Admin Username
    userId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
