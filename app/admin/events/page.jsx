"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DataTable from "@/components/admin/ui/DataTable";
import EventHeader from "./_components/EventHeader";
import EventFilters from "./_components/EventFilters";
import MobileEventList from "./_components/MobileEventList";
import { getEventColumns } from "./_components/EventTableColumns";
import { useEventMutations } from "./_hooks/useEventMutations";

export default function EventsManagementPage() {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Queries & Mutations
  const { toggleVisibilityMutation, deleteMutation } = useEventMutations();

  const { data, isLoading } = useQuery({
    queryKey: ["events", page, searchTerm, type, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search: searchTerm,
        type,
        startDate,
        endDate,
      });
      const response = await axios.get(`/api/events?${params.toString()}`);
      return response.data;
    },
  });

  // Fixed data mapping to match API response
  const items = data?.events || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  const handleReset = () => {
    setSearchTerm("");
    setType("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleToggleVisibility = async (id, isVisible) => {
    await toggleVisibilityMutation.mutateAsync({ id, isVisible });
  };

  const handleDeleteClick = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      await deleteMutation.mutateAsync(event._id);
    }
  };

  // Columns definition
  const columns = useMemo(
    () =>
      getEventColumns({
        onDelete: handleDeleteClick,
        onToggleVisibility: handleToggleVisibility,
      }),
    [],
  );

  const filterProps = {
    searchTerm,
    setSearchTerm,
    type,
    setType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showFilters,
    setShowFilters,
    onReset: handleReset,
  };

  const paginationProps = {
    page,
    total: totalPages,
    onChange: setPage,
    totalItems,
    label: `Showing ${items.length} of ${totalItems} events`,
  };

  return (
    <div className="space-y-6">
      <EventHeader />

      {/* Desktop view */}
      <div className="hidden lg:block">
        <DataTable
          data={items}
          columns={columns}
          isLoading={isLoading}
          pagination={paginationProps}
          topContent={<EventFilters {...filterProps} />}
        />
      </div>

      {/* Mobile view */}
      <MobileEventList
        events={items}
        isLoading={isLoading}
        filterProps={filterProps}
        paginationProps={paginationProps}
        onToggleVisibility={handleToggleVisibility}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}
