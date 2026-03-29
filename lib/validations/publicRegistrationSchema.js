import { z } from "zod";

const requiredImage = z.any().refine((val) => {
  if (typeof val === "string" && val.trim().length > 0) return true;
  if (val && typeof val === "object" && val.size > 0) return true;
  return false;
}, "Image is required");

const publicBaseSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export const publicStudentSchema = publicBaseSchema
  .omit({ email: true })
  .extend({
    role: z.literal("student"),
    current_madrasa_class: z.string().min(1, "Madrasa Class is required"),
    current_school_class: z.string().min(1, "School Class is required"),
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
    image: requiredImage,
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
  dob: z.string().min(1, "Date of Birth is required"),
  current_job: z.string().min(1, "Current Job is required"),
  custom_job: z.string().nullable().optional(),
  image: requiredImage,
});

export const publicRegistrationSchema = z.discriminatedUnion("role", [
  publicStudentSchema,
  publicAlumniSchema,
]);
