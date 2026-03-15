"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Edit2, Loader2, ArrowLeft, UserPen } from "lucide-react";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import UserForm from "@/components/admin/UserForm";

export default function AlumniProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, update } = useSession();

  const userId = session?.user?.id || session?.user?._id;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      update({ image: data.user?.image, name: data.user?.name });
      addToast({
        title: "Success",
        description: "Profile updated successfully",
        color: "success",
      });
      router.push("/alumni/profile");
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update profile",
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

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="light"
            onPress={() => router.push("/alumni/profile")}
            className="p-2 min-w-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <UserPen size={25} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Profile
            </h2>
            <p className="text-slate-600 text-sm dark:text-slate-400">
              Update your personal information.
            </p>
          </div>
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
