import mongoose from "mongoose";

const sundookSchema = new mongoose.Schema(
  {
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    box_number: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
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

sundookSchema.index({ receipt_number: 1 }, { sparse: true });

export default mongoose.models.Sundook ||
  mongoose.model("Sundook", sundookSchema);
