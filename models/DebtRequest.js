import mongoose from "mongoose";

const DebtRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      max: 50000,
    },
    payment_type: {
      type: String,
      enum: ["single", "emi"],
      required: true,
    },
    duration_months: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    witness1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    witness2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    witness1_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    witness2_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    witness1_reason: String,
    witness2_reason: String,
    admin_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    admin_reason: String,
    receipt_no: String,
    purpose: String,
    status: {
      type: String,
      enum: [
        "pending_witness",
        "pending_admin",
        "approved",
        "rejected",
        "witness_rejected",
      ],
      default: "pending_witness",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.DebtRequest ||
  mongoose.model("DebtRequest", DebtRequestSchema);
