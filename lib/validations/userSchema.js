import { z } from "zod";

const baseSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  userId: z.string().optional(),
  status: z.enum(["Active", "Pending", "Inactive"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
});

const adminSchema = baseSchema.extend({
  role: z.literal("admin"),
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  userId: z.string().min(3, "Username must be at least 3 characters"),
  image: z.any().optional(),
  permissions: z.any().optional(),
});

const alumniSchema = baseSchema.extend({
  role: z.literal("alumni"),
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  house_name: z.string().min(1, "House Name is required"),
  father_name: z.string().min(1, "Father Name is required"),
  address: z.string().min(1, "Address is required"),
  post_office: z.string().min(1, "Post Office is required"),
  district: z.string().min(1, "District is required"),
  custom_district: z.string().nullable().optional(),
  pincode: z.string().min(1, "Pincode is required"),
  batch: z.string().min(1, "Batch is required"),
  education: z.string().min(1, "Education is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  current_job: z.string().min(1, "Current Job is required"),
  custom_job: z.string().nullable().optional(),
  job_location: z.string().min(1, "Job Location is required"),
  image: z.any().refine((val) => val instanceof File || (typeof val === "string" && val.length > 0), {
    message: "Image is required",
  }),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
});

const superAdminSchema = baseSchema.extend({
  role: z.literal("super_admin"),
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  userId: z.string().min(3, "Username must be at least 3 characters"),
  image: z.any().optional(),
});

export const userSchema = z.discriminatedUnion("role", [
  superAdminSchema,
  adminSchema,
  alumniSchema,
]);
