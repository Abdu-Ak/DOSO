"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { addToast } from "@heroui/toast";
import { CircleX, Wallet } from "lucide-react";
import { createDebtRequestSchema } from "@/lib/validations/debt.validation";

export default function DebtRequestForm({ isOpen, onOpenChange }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDebtRequestSchema),
    defaultValues: {
      amount: "",
      payment_type: "single",
      duration_months: 1,
      witness1: "",
      witness2: "",
    },
  });

  const paymentType = watch("payment_type");
  const durationMonths = watch("duration_months");

  // Handle duration logic based on payment type
  useEffect(() => {
    if (paymentType === "single") {
      setValue("duration_months", 1);
    } else if (paymentType === "emi" && durationMonths === 1) {
      setValue("duration_months", 2);
    }
  }, [paymentType, setValue, durationMonths]);

  const { data: alumniData, isLoading: alumniLoading } = useQuery({
    queryKey: ["users", "alumni-list"],
    queryFn: async () => {
      const res = await axios.get("/api/users", {
        params: { role: "alumni", limit: 1000 },
      });
      return res.data;
    },
  });

  const alumniList = alumniData?.users || [];

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/api/debt-requests", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt-requests"] });
      addToast({
        title: "Success",
        description: "Debt request submitted successfully",
        color: "success",
      });
      onOpenChange(false);
      reset();
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit request",
        color: "danger",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="lg"
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Request New Debt/Loan
              </h3>

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
              <Input
                {...register("amount", { valueAsNumber: true })}
                label="Amount (₹)"
                placeholder="0.00"
                type="number"
                variant="bordered"
                labelPlacement="outside"
                isInvalid={!!errors.amount}
                errorMessage={errors.amount?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select
                  label="Payment Type"
                  placeholder="Select payment type"
                  variant="bordered"
                  selectedKeys={[paymentType]}
                  onSelectionChange={(keys) =>
                    setValue("payment_type", Array.from(keys)[0])
                  }
                  isInvalid={!!errors.payment_type}
                  errorMessage={errors.payment_type?.message}
                  labelPlacement="outside"
                  radius="lg"
                >
                  <SelectItem key="single" value="single">
                    Single Payment
                  </SelectItem>
                  <SelectItem key="emi" value="emi">
                    EMI (Installments)
                  </SelectItem>
                </Select>

                <Select
                  label="Duration (Months)"
                  placeholder="Select duration"
                  variant="bordered"
                  selectedKeys={[String(durationMonths)]}
                  onSelectionChange={(keys) =>
                    setValue("duration_months", Number(Array.from(keys)[0]))
                  }
                  isInvalid={!!errors.duration_months}
                  errorMessage={errors.duration_months?.message}
                  labelPlacement="outside"
                  radius="lg"
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="witness1"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Witness 1"
                      placeholder="Search witness 1"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      onSelectionChange={field.onChange}
                      selectedKey={field.value}
                      isLoading={alumniLoading}
                      isInvalid={!!errors.witness1}
                      errorMessage={errors.witness1?.message}
                    >
                      {alumniList.map((u) => (
                        <AutocompleteItem
                          key={u._id}
                          textValue={`${u.name} (${u.userId})`}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold">{u.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
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
                      placeholder="Search witness 2"
                      variant="bordered"
                      labelPlacement="outside"
                      radius="lg"
                      onSelectionChange={field.onChange}
                      selectedKey={field.value}
                      isLoading={alumniLoading}
                      isInvalid={!!errors.witness2}
                      errorMessage={errors.witness2?.message}
                    >
                      {alumniList.map((u) => (
                        <AutocompleteItem
                          key={u._id}
                          textValue={`${u.name} (${u.userId})`}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold">{u.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
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
                isLoading={mutation.isPending}
                className="font-black px-8 shadow-lg shadow-primary/20"
                radius="lg"
              >
                Submit Request
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
