"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserForm from "@/components/admin/UserForm";
import { Users } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function CreateUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: "Success",
        description: "User created successfully",
        color: "success",
      });
      router.push("/admin/users");
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create user",
        color: "danger",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Users size={25} />
        </div>
        <div>
          <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
            Add New User
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">
            Fill in the details to create a new user account.
          </p>
        </div>
      </div>

      <UserForm onSubmit={mutate} loading={isPending} />
    </div>
  );
}
