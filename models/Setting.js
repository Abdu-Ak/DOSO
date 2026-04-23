import mongoose from "mongoose";

// Simple extension schema for leadership roles
const leaderSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  title: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  image: { type: String, default: "" },
});

const settingSchema = new mongoose.Schema(
  {
    leadership: {
      president: { type: leaderSchema, default: () => ({}) },
      secretary: { type: leaderSchema, default: () => ({}) },
      treasurer: { type: leaderSchema, default: () => ({}) },
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      mapLink: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", settingSchema);
