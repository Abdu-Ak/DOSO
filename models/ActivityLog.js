import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "APPROVE",
        "REJECT",
        "ACTIVATE",
        "DEACTIVATE",
        "RENEW",
        "REPAID",
      ],
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Model for Activity Logs - Updated with REPAID action support
const model =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", ActivityLogSchema);

// Force update enum if model is already compiled in dev environment
if (
  model.schema.path("actionType") &&
  !model.schema.path("actionType").enumValues.includes("REPAID")
) {
  model.schema.path("actionType").enumValues.push("REPAID");
}

export default model;
