"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/lib/hooks";
import { Card, CardBody } from "@heroui/card";
import { Pagination } from "@heroui/pagination";
import { addToast } from "@heroui/toast";

import ActivityHeader from "./_components/ActivityHeader";
import ActivityFilters from "./_components/ActivityFilters";
import ActivityList from "./_components/ActivityList";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";

export default function ActivityLogPage() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["activities", page, debouncedSearchTerm, startDate, endDate],
    queryFn: async () => {
      const response = await axios.get("/api/activities/all", {
        params: {
          page,
          search: debouncedSearchTerm,
          startDate,
          endDate,
          limit: 15,
        },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/activities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activities"]);
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
      addToast({
        title: "Success",
        description: "Activity log deleted successfully",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Failed to delete activity:", error);
      addToast({
        title: "Error",
        description: "Failed to delete activity log",
        color: "danger",
      });
    },
  });

  const handleDelete = (activity) => {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  const activities = data?.activities || [];
  const totalPages = data?.pages || 1;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <ActivityHeader />

      <Card className="border-none shadow-sm bg-surface-light dark:bg-surface-dark">
        <CardBody className="p-6">
          <ActivityFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setPage={setPage}
          />
        </CardBody>
      </Card>

      <Card className="border-none shadow-sm bg-surface-light dark:bg-surface-dark min-h-[400px]">
        <CardBody className="p-0">
          <ActivityList
            activities={activities}
            isLoading={isLoading}
            currentUser={currentUser}
            onDelete={handleDelete}
          />
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            color="default"
            variant="flat"
          />
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setActivityToDelete(null);
        }}
        onConfirm={() => {
          deleteMutation.mutate(activityToDelete?._id);
        }}
        isLoading={deleteMutation.isPending}
        title="Delete Activity Log"
        message={
          <>
            <p>
              Do you want to delete this activity log: &quot;
              {activityToDelete?.title}&quot;?
            </p>
            <p className="mt-1">This process can&apos;t be undone.</p>
          </>
        }
      />
    </div>
  );
}
