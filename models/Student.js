import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the student's name"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Please provide the date of birth"],
    },
    image: String,
    imagePublicId: String,
    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive"],
      default: "Pending",
    },
    current_madrasa_class: {
      type: String,
      required: [true, "Please provide the current madrasa class"],
    },
    current_school_class: {
      type: String,
      required: [true, "Please provide the current school class"],
    },
    house_name: {
      type: String,
      required: [true, "Please provide the house name"],
    },
    address: {
      type: String,
      required: [true, "Please provide the address"],
    },
    district: {
      type: String,
      required: [true, "Please provide the district"],
    },
    custom_district: String,
    father_name: {
      type: String,
      required: [true, "Please provide the father's name"],
    },
    guardian_name: {
      type: String,
      required: [true, "Please provide the guardian's name"],
    },
    guardian_phone: {
      type: String,
      required: [true, "Please provide the guardian's phone number"],
    },
    guardian_relation: {
      type: String,
      enum: ["Father", "Mother", "Other"],
      required: [true, "Please provide the guardian's relation"],
    },
    guardian_occupation: {
      type: String,
      required: [true, "Please provide the guardian's occupation"],
    },
    date_of_admission: {
      type: Date,
      required: [true, "Please provide the date of admission"],
    },
    source: {
      type: String,
      enum: ["admin", "public"],
      default: "admin",
    },
    rejectionReason: String,
    studentId: {
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

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
