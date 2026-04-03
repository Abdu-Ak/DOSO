import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";

export const useAuth = () => {
  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const response = await axios.post("/api/auth/forgot-password", { email });
      return response.data;
    },
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: data.message,
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to send reset link",
        color: "danger",
      });
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password, confirmPassword }) => {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });
      return response.data;
    },
    onSuccess: (data) => {
      addToast({
        title: "Success",
        description: data.message,
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to reset password",
        color: "danger",
      });
    },
  });

  return {
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};
