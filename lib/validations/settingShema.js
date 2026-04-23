import { z } from "zod";

const leaderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
  image: z.any().optional(),
});

export const settingSchema = z.object({
  leadership: z.object({
    president: leaderSchema,
    secretary: leaderSchema,
    treasurer: leaderSchema,
  }),
  contact: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    mapLink: z.url("Invalid map link URL").or(z.literal("")),
  }),
});
