import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
  type: z.enum(
    ["Academic", "Culture", "Sports", "Religious", "Seminar", "Other"],
    {
      errorMap: () => ({ message: "Please select a valid event type" }),
    },
  ),
  date: z.any().refine((val) => !!val, "Date is required"),
  time: z.any().refine((val) => !!val, "Time is required"),
  heldingPlace: z.string().min(1, "Held place is required"),
  mainImageUrl: z.string().min(1, "Main image is required"),
  galleryImages: z
    .array(z.string())
    .max(10, "Cannot upload more than 10 gallery images")
    .optional()
    .default([]),
  galleryVideos: z
    .array(z.string())
    .max(10, "Cannot upload more than 10 gallery videos")
    .optional()
    .default([]),
  isVisible: z.boolean().default(true),
});
