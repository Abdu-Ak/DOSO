"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import UserForm from "@/components/admin/UserForm";
import { Users, Loader2 } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(`/api/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      addToast({
        title: "Success",
        description: "User updated successfully",
        color: "success",
      });
      router.push("/admin/users");
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update user",
        color: "danger",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Users size={25} />
        </div>
        <div>
          <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
            Edit User
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">
            Update account information for {user?.name}.
          </p>
        </div>
      </div>

      <UserForm
        initialData={user}
        onSubmit={mutate}
        loading={isPending}
        isEdit={true}
      />
    </div>
  );
}
