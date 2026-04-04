import { z } from "zod";

export const createWelfareSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(3, "Description is required"),
});

export const adminCreateWelfareSchema = z.object({
  alumni: z.string().min(1, "Alumni is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(3, "Description is required"),
  receipt_number: z.string().min(1, "Receipt number is required"),
});

export const approveWelfareSchema = z.object({
  receipt_number: z.string().min(1, "Receipt number is required"),
});

export const rejectWelfareSchema = z.object({
  rejection_reason: z.string().min(1, "Rejection reason is required"),
});
