import { z } from "zod";

export const createDebtRequestSchema = z
  .object({
    amount: z.coerce
      .number()
      .min(5000, "Amount must be at least 5000")
      .max(50000, "Maximum amount is 50,000"),
    payment_type: z.enum(["single", "emi"], {
      required_error: "Please select a payment type",
    }),
    duration_months: z.coerce
      .number()
      .min(1)
      .max(3, "Maximum duration is 3 months"),
    witness1: z.string().min(1, "Please select witness 1"),
    witness2: z.string().min(1, "Please select witness 2"),
  })
  .refine((data) => data.witness1 !== data.witness2, {
    message: "Witnesses must be different people",
    path: ["witness2"],
  });

export const witnessResponseSchema = z
  .object({
    status: z.enum(["approved", "rejected"]),
    reason: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      data.status === "approved" ||
      (data.status === "rejected" && data.reason?.trim()),
    {
      message: "Reason is mandatory when rejecting",
      path: ["reason"],
    },
  );

export const adminResponseSchema = z
  .object({
    status: z.enum(["approved", "rejected", "repaid"]),
    receipt_no: z.string().optional().or(z.literal("")),
    reason: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      data.status !== "rejected" ||
      (data.status === "rejected" && data.reason?.trim()),
    {
      message: "Reason is required when rejecting",
      path: ["reason"],
    },
  );
export const adminCreateDebtSchema = z
  .object({
    alumni: z.string().min(1, "Please select an alumni"),
    amount: z.coerce
      .number()
      .min(5000, "Amount must be at least 5000")
      .max(50000, "Maximum amount is 50,000"),
    payment_type: z.enum(["single", "emi"], {
      required_error: "Please select a payment type",
    }),
    duration_months: z.coerce
      .number()
      .min(1)
      .max(3, "Maximum duration is 3 months"),
    witness1: z.string().min(1, "Please select witness 1"),
    witness2: z.string().min(1, "Please select witness 2"),
  })
  .refine((data) => data.witness1 !== data.witness2, {
    message: "Witnesses must be different people",
    path: ["witness2"],
  });
