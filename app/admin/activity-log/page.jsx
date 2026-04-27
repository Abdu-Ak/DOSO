"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "@/lib/hooks";
import { Card, CardBody } from "@heroui/card";
import { Pagination } from "@heroui/pagination";

import ActivityHeader from "./_components/ActivityHeader";
import ActivityFilters from "./_components/ActivityFilters";
import ActivityList from "./_components/ActivityList";

export default function ActivityLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          <ActivityList activities={activities} isLoading={isLoading} />
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
    </div>
  );
}
