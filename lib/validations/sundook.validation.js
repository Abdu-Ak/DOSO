import { z } from "zod";

export const createSundookSchema = z.object({
  box_number: z.number().int().min(1, "Box number is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
});

export const adminCreateSundookSchema = z.object({
  alumni: z.string().min(1, "Alumni ID is required"),
  box_number: z.number().int().min(1, "Box number is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  year: z.number().int().min(2000, "Invalid year"),
  receipt_number: z.string().min(1, "Receipt number is required"),
});

export const updateSundookStatusSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    receipt_number: z.string().optional(),
    rejection_reason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "approved" && !data.receipt_number) {
        return false;
      }
      if (data.status === "rejected" && !data.rejection_reason) {
        return false;
      }
      return true;
    },
    {
      message:
        "Receipt number is required for approval, and rejection reason is required for rejection",
      path: ["status"],
    },
  );
