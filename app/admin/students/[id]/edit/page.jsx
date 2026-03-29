"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import StudentForm from "@/components/admin/StudentForm";
import { Loader2, UserPen } from "lucide-react";
import { addToast } from "@heroui/toast";

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await axios.get(`/api/students/${id}`);
      return response.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(`/api/students/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      addToast({
        title: "Success",
        description: "Student updated successfully",
        color: "success",
      });
      router.push("/admin/students");
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update student",
        color: "danger",
      });
    },
  });

  if (isLoading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <UserPen size={25} />
        </div>
        <div>
          <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
            Edit Student
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">
            Update the details for {student?.name}.
          </p>
        </div>
      </div>

      <StudentForm
        initialData={student}
        onSubmit={mutate}
        loading={isPending}
        isEdit={true}
      />
    </div>
  );
}
