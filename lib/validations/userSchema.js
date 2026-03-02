import { z } from "zod";

const baseSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required"),
  status: z.enum(["Active", "Pending", "Inactive"], {
    errorMap: () => ({ message: "Please select a status" }),
  }),
});

const adminSchema = baseSchema.extend({
  role: z.literal("admin"),
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  userId: z.string().min(3, "Username must be at least 3 characters"),
  image: z.any().optional(),
});

const studentSchema = baseSchema.extend({
  role: z.literal("student"),
  madrasa_name: z.string().min(1, "Madrasa Name is required"),
  name: z.string().min(2, "Student Name must be at least 2 characters"),
  house_name: z.string().min(1, "House Name is required"),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  custom_district: z.string().optional(),
  dob: z.string().min(1, "Date of Birth is required"),
  father_name: z.string().min(1, "Father Name is required"),
  guardian_name: z.string().min(1, "Guardian Name is required"),
  guardian_phone: z.string().min(1, "Guardian Phone Number is required"),
  guardian_relation: z.enum(["Father", "Mother", "Other"], {
    errorMap: () => ({ message: "Please select a relation" }),
  }),
  guardian_occupation: z.string().min(1, "Guardian Occupation is required"),
  date_of_admission: z.string().min(1, "Date of Admission is required"),
  image: z
    .any()
    .refine((file) => file !== null && file !== undefined, "Image is required"),
});

const alumniSchema = baseSchema.extend({
  role: z.literal("alumni"),
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  house_name: z.string().min(1, "House Name is required"),
  father_name: z.string().min(1, "Father Name is required"),
  address: z.string().min(1, "Address is required"),
  post_office: z.string().min(1, "Post Office is required"),
  district: z.string().min(1, "District is required"),
  custom_district: z.string().optional(),
  pincode: z.string().min(1, "Pincode is required"),
  batch: z.string().min(1, "Batch is required"),
  education: z.string().min(1, "Education is required"),
  image: z
    .any()
    .refine((file) => file !== null && file !== undefined, "Image is required"),
});

export const userSchema = z.discriminatedUnion("role", [
  adminSchema,
  studentSchema,
  alumniSchema,
]);
