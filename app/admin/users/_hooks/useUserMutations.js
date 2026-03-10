"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { signOut } from "next-auth/react";

export function useUserMutations(currentUser) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: "Success",
        description: "User deleted successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to delete user",
        color: "danger",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axios.patch(`/api/users/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: "Success",
        description: "Status updated successfully",
        color: "success",
      });

      const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
      if (
        currentUserId === variables.id?.toString() &&
        variables.status === "Inactive"
      ) {
        signOut({ callbackUrl: "/login" });
      }
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update status",
        color: "danger",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`/api/users/${id}/approve`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      addToast({
        title: "User Approved",
        description: data.tempPassword
          ? `Temporary password: ${data.tempPassword}`
          : "User approved successfully",
        color: "success",
        timeout: data.tempPassword ? 10000 : 3000,
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to approve user",
        color: "danger",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      await axios.post(`/api/users/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      addToast({
        title: "User Rejected",
        description: "Rejection email sent",
        color: "warning",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to reject user",
        color: "danger",
      });
    },
  });

  return { deleteMutation, statusMutation, approveMutation, rejectMutation };
}
