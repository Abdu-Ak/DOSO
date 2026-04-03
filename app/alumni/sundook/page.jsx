"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Box } from "lucide-react";

import SundookForm from "./_components/SundookForm";
import SundookHistory from "./_components/SundookHistory";

export default function AlumniSundookPage() {
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();

  const { data, isLoading } = useQuery({
    queryKey: ["sundook", "my-records"],
    queryFn: async () => {
      const response = await axios.get("/api/sundook");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/sundook", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sundook", "my-records"] });
      addToast({
        title: "Success",
        description: "Sundook record submitted successfully",
        color: "success",
      });
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
      box_number: parseInt(formData.box_number),
      amount: parseFloat(formData.amount),
    });
  };

  const records = data?.records || [];
  const hasSubmittedThisYear = records.some((r) => r.year === currentYear);

  const statusColors = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Box className="text-primary" />
          Sundook
        </h1>
      </div>

      <SundookForm
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        hasSubmittedThisYear={hasSubmittedThisYear}
        currentYear={currentYear}
      />

      <SundookHistory
        records={records}
        isLoading={isLoading}
        statusColors={statusColors}
      />
    </div>
  );
}
