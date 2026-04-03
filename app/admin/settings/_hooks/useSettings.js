import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await axios.get("/api/settings");
      return response.data.settings;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put("/api/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      addToast({
        title: "Success",
        description: "Settings updated successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update settings",
        color: "danger",
      });
    },
  });

  return { settings, isLoading, updateMutation };
};
