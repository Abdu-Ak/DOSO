import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Academic", "Culture", "Sports", "Religious", "Seminar", "Other"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    heldingPlace: {
      type: String,
      required: true,
      trim: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    galleryImages: {
      type: [String],
      validate: [
        (val) => val.length <= 10,
        "Exceeds the limit of 10 gallery images",
      ],
      default: [],
    },
    galleryVideos: {
      type: [String],
      validate: [
        (val) => val.length <= 10,
        "Exceeds the limit of 10 gallery videos",
      ],
      default: [],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
