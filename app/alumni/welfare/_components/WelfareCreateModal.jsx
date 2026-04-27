"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWelfareSchema } from "@/lib/validations/welfare.validation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { CircleX } from "lucide-react";

export default function WelfareCreateModal({ isOpen, onOpenChange }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createWelfareSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/welfare", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["welfare"] });
      addToast({
        title: "Success",
        description: "Welfare record submitted successfully",
        color: "success",
      });
      onOpenChange(false);
      reset();
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit record",
        color: "danger",
      });
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-body! font-semibold text-slate-800 dark:text-white">
                Add Welfare Fund
              </h3>

              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-full hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <CircleX size={22} />
              </button>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
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
                <Textarea
                  {...register("description")}
                  label="Description"
                  placeholder="Describe the welfare fund purpose"
                  variant="bordered"
                  labelPlacement="outside"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                isLoading={mutation.isPending}
                className="font-bold"
              >
                Submit
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
