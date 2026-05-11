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
    job_location: String,

    // Membership renewals for alumni
    membership_renewals: [
      {
        year: { type: Number, required: true },
        receipt_number: { type: String, required: true },
        renewedAt: { type: Date, default: Date.now },
      },
    ],

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

    // Module-wise admin permissions
    permissions: {
      alumni: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      students: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      events: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      sundook: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      debt_requests: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      welfare: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      enquiries: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      settings: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
      permission_management: { access: { type: Boolean, default: false }, manage: { type: Boolean, default: false } },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
