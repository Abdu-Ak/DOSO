import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      addToast({
        title: "Success",
        description: "Event created successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create event",
        color: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await axios.put(`/api/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
      addToast({
        title: "Success",
        description: "Event updated successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update event",
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      addToast({
        title: "Success",
        description: "Event deleted successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete event",
        color: "danger",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }) => {
      const formData = new FormData();
      formData.append("isVisible", isVisible);
      const response = await axios.put(`/api/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
      addToast({
        title: "Success",
        description: "Visibility updated",
        color: "success",
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    toggleVisibilityMutation,
  };
};
