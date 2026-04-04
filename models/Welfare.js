import mongoose from "mongoose";

const welfareSchema = new mongoose.Schema(
  {
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    receipt_number: {
      type: String,
    },
    rejection_reason: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Welfare ||
  mongoose.model("Welfare", welfareSchema);
