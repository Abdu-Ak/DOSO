import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "alumni", "student"]),
  phone: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Pending", "Inactive"]).default("Active"),
  image: z.any().optional(),
});
