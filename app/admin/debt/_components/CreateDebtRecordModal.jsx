"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { CircleX, PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCreateDebtSchema } from "@/lib/validations/debt.validation";
import { useEffect } from "react";
import { Select, SelectItem } from "@heroui/select";

export default function CreateDebtRecordModal({
  isOpen,
  onOpenChange,
  alumniList = [],
  onSubmit,
  isLoading,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(adminCreateDebtSchema),
    defaultValues: {
      alumni: "",
      amount: "",
      payment_type: "single",
      duration_months: 1,
      receipt_no: "",
      witness1: "",
      witness2: "",
    },
    mode: "onChange",
  });

  const paymentType = watch("payment_type");
  const durationMonths = watch("duration_months");

  useEffect(() => {
    if (paymentType === "single") {
      setValue("duration_months", 1, { shouldValidate: true });
    } else if (paymentType === "emi" && durationMonths === 1) {
      setValue("duration_months", 2, { shouldValidate: true });
    }
  }, [paymentType, setValue, durationMonths]);

  useEffect(() => {
    if (isOpen) {
      reset({
        alumni: "",
        amount: "",
        payment_type: "single",
        duration_months: 1,
        receipt_no: "",
        witness1: "",
        witness2: "",
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      size="xl"
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                  Create Debt Record
                </h3>
                <p className="text-sm text-slate-600 font-normal dark:text-slate-400 -mt-2">
                  Create and auto-approve a record for an alumni.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Controller
                name="alumni"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="Select Alumni"
                    labelPlacement="outside"
                    placeholder="Choose an alumni"
                    variant="bordered"
                    radius="lg"
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    isInvalid={!!errors.alumni}
                    errorMessage={errors.alumni?.message}
                    defaultItems={alumniList || []}
                    isVirtualized={false}
                  >
                    {(u) => (
                      <AutocompleteItem
                        key={u._id}
                        textValue={`${u.name} (${u.userId})`}
                      >
                        <div className="flex flex-col h-full">
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {u.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {u.userId}
                          </span>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />

              <Input
                {...register("amount", { valueAsNumber: true })}
                label="Amount (₹)"
                placeholder="0.00"
                type="number"
                variant="bordered"
                labelPlacement="outside"
                radius="lg"
                fullWidth
                isInvalid={!!errors.amount}
                errorMessage={errors.amount?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="payment_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Payment Type"
                      placeholder="Select"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      selectedKeys={[field.value]}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0])
                      }
                      isInvalid={!!errors.payment_type}
                      errorMessage={errors.payment_type?.message}
                    >
                      <SelectItem key="single" value="single">
                        Single
                      </SelectItem>
                      <SelectItem key="emi" value="emi">
                        EMI
                      </SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  name="duration_months"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Duration (Months)"
                      placeholder="Select"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      selectedKeys={[String(field.value)]}
                      onSelectionChange={(keys) =>
                        field.onChange(Number(Array.from(keys)[0]))
                      }
                      isInvalid={!!errors.duration_months}
                      errorMessage={errors.duration_months?.message}
                    >
                      {paymentType === "single"
                        ? [
                            <SelectItem key="1" value="1">
                              1 Month
                            </SelectItem>,
                            <SelectItem key="2" value="2">
                              2 Months
                            </SelectItem>,
                            <SelectItem key="3" value="3">
                              3 Months
                            </SelectItem>,
                          ]
                        : [
                            <SelectItem key="2" value="2">
                              2 Months
                            </SelectItem>,
                            <SelectItem key="3" value="3">
                              3 Months
                            </SelectItem>,
                          ]}
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="witness1"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Witness 1"
                      labelPlacement="outside"
                      placeholder="Choose witness 1"
                      variant="bordered"
                      radius="lg"
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      isInvalid={!!errors.witness1}
                      errorMessage={errors.witness1?.message}
                      isVirtualized={false}
                    >
                      {(alumniList || []).map((u) => (
                        <AutocompleteItem
                          key={u._id}
                          textValue={`${u.name} (${u.userId})`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {u.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {u.userId}
                            </span>
                          </div>
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  )}
                />
                <Controller
                  name="witness2"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Witness 2"
                      labelPlacement="outside"
                      placeholder="Choose witness 2"
                      variant="bordered"
                      radius="lg"
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      isInvalid={!!errors.witness2}
                      errorMessage={errors.witness2?.message}
                      isVirtualized={false}
                    >
                      {(alumniList || []).map((u) => (
                        <AutocompleteItem
                          key={u._id}
                          textValue={`${u.name} (${u.userId})`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {u.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {u.userId}
                            </span>
                          </div>
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                fullWidth
                isLoading={isLoading}
                isDisabled={!isValid}
                className="font-bold text-white h-12 rounded-xl"
                startContent={<PlusCircle size={18} />}
              >
                Create & Approve Record
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
