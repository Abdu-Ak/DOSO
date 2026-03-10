import { z } from "zod";

const publicBaseSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export const publicStudentSchema = publicBaseSchema.extend({
  role: z.literal("student"),
  madrasa_name: z.string().min(1, "Madrasa Name is required"),
  name: z.string().min(2, "Student Name must be at least 2 characters"),
  house_name: z.string().min(1, "House Name is required"),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  custom_district: z.string().nullable().optional(),
  dob: z.string().min(1, "Date of Birth is required"),
  father_name: z.string().min(1, "Father Name is required"),
  guardian_name: z.string().min(1, "Guardian Name is required"),
  guardian_phone: z.string().min(1, "Guardian Phone Number is required"),
  guardian_relation: z.enum(["Father", "Mother", "Other"], {
    errorMap: () => ({ message: "Please select a relation" }),
  }),
  guardian_occupation: z.string().min(1, "Guardian Occupation is required"),
  date_of_admission: z.string().min(1, "Date of Admission is required"),
  image: z.any().optional(),
});

export const publicAlumniSchema = publicBaseSchema.extend({
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
  image: z.any().optional(),
});

export const publicRegistrationSchema = z.discriminatedUnion("role", [
  publicStudentSchema,
  publicAlumniSchema,
]);
