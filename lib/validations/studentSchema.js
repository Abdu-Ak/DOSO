import { z } from "zod";

const requiredImage = z.any().refine((val) => {
  if (typeof val === "string" && val.trim().length > 0) return true;
  if (val && typeof val === "object" && val.size > 0) return true;
  return false;
}, "Image is required");

export const createStudentSchema = z.object({
  name: z.string().min(2, "Student Name must be at least 2 characters"),
  phone: z.string().optional().or(z.literal("")),
  dob: z.string().min(1, "Date of Birth is required"),
  current_madrasa_class: z.string().min(1, "Madrasa Class is required"),
  current_school_class: z.string().min(1, "School Class is required"),
  house_name: z.string().min(1, "House Name is required"),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  custom_district: z.string().nullable().optional(),
  father_name: z.string().min(1, "Father Name is required"),
  guardian_name: z.string().min(1, "Guardian Name is required"),
  guardian_phone: z.string().min(1, "Guardian Phone Number is required"),
  guardian_relation: z.enum(["Father", "Mother", "Other"], {
    errorMap: () => ({ message: "Please select a relation" }),
  }),
  guardian_occupation: z.string().min(1, "Guardian Occupation is required"),
  date_of_admission: z.string().min(1, "Date of Admission is required"),
  status: z
    .enum(["Active", "Pending", "Inactive"], {
      errorMap: () => ({ message: "Please select a status" }),
    })
    .optional(),
  aadhar_number: z.string().optional().or(z.literal("")),
  identification_mark: z.string().optional().or(z.literal("")),
  image: requiredImage,
  studentId: z.string().optional(),
});
