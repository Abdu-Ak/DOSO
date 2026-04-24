import { z } from "zod";

export const createEnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.enum(
    [
      "Admissions Enquiry",
      "General Information",
      "Support Our Institute",
      "Technical Issue",
    ],
    {
      errorMap: () => ({ message: "Please select a valid subject" }),
    },
  ),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(["Pending", "Completed", "Cancelled"]),
});
