import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";

export const useEnquiries = () => {
  const queryClient = useQueryClient();

  // Fetch all enquiries
  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const response = await axios.get("/api/enquiries");
      return response.data.data;
    },
  });

  // Update enquiry status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axios.patch(`/api/enquiries/${id}`, { status });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      addToast({
        title: "Success",
        description: `Status updated to ${data.data.status}`,
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        color: "danger",
      });
    },
  });

  // Delete enquiry
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/enquiries/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      addToast({
        title: "Success",
        description: "Enquiry deleted successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete enquiry",
        color: "danger",
      });
    },
  });

  return {
    enquiries,
    isLoading,
    updateStatusMutation,
    deleteMutation,
  };
};
