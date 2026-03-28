"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import UserForm from "@/components/admin/UserForm";
import { Users, Loader2, AlertCircle, UserPen } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { canManageUser } from "@/lib/permissions";

import { useSession } from "next-auth/react";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, update } = useSession();
  const currentUser = session?.user;

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });

      // Update session if editing self
      if (session?.user?.id === id || session?.user?._id === id) {
        update({ image: data.user?.image });
      }

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

  if (!user || !canManageUser(currentUser, user, "edit")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle size={48} className="text-danger" />
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p className="text-slate-500">
          You do not have permission to edit this profile.
        </p>
        <Button color="primary" onPress={() => router.push("/admin/users")}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <UserPen size={25} />
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
