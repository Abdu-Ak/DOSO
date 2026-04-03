"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSundookSchema } from "@/lib/validations/sundook.validation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { CheckCircle2, Plus } from "lucide-react";

export default function SundookForm({
  onSubmit,
  isPending,
  hasSubmittedThisYear,
  currentYear,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSundookSchema),
    defaultValues: {
      box_number: "",
      amount: "",
    },
  });

  if (hasSubmittedThisYear) {
    return (
      <Card className="bg-primary/5 border-primary/20 shadow-none rounded-3xl">
        <CardBody className="p-6 md:p-8 flex flex-row items-center gap-6">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Year {currentYear} Submission Completed
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              You have already submitted your Sundook record for this year.
              Thank you for your support!
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl mosque-arch-card">
      <CardHeader className="px-6 md:px-8 pt-8 flex flex-col items-start gap-1">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Submit Your Contribution
        </h2>
        <p className="text-sm text-slate-500 font-medium italic">
          Record your financial contribution for the year {currentYear}.
        </p>
      </CardHeader>
      <CardBody className="px-6 md:px-8 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("box_number", { valueAsNumber: true })}
              label="Box Number"
              placeholder="e.g. 101"
              variant="bordered"
              labelPlacement="outside"
              radius="lg"
              isInvalid={!!errors.box_number}
              errorMessage={errors.box_number?.message}
            />
            <Input
              {...register("amount", { valueAsNumber: true })}
              label="Amount (₹)"
              placeholder="0.00"
              type="number"
              variant="bordered"
              labelPlacement="outside"
              radius="lg"
              isInvalid={!!errors.amount}
              errorMessage={errors.amount?.message}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              color="primary"
              isLoading={isPending}
              startContent={!isPending && <Plus size={18} />}
              className="font-bold shadow-lg shadow-primary/20 px-8 w-full md:w-auto"
            >
              Submit Contribution
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
