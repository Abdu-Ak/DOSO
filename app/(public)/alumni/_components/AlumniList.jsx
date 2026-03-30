"use client";

import React, { useState, useEffect } from "react";
import SearchFilter from "./SearchFilter";
import AlumniGrid from "./AlumniGrid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "@/lib/hooks";

export default function AlumniList() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [batchYear, setBatchYear] = useState("All Batches");
  const [industry, setIndustry] = useState("All Industries");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, batchYear, industry]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "public_alumni",
      page,
      limit,
      debouncedSearchTerm,
      batchYear,
      industry,
    ],
    queryFn: async () => {
      const params = {
        role: "alumni",
        status: "Active",
        page,
        limit,
      };

      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (batchYear !== "All Batches") params.batch = batchYear;
      if (industry !== "All Industries") params.industry = industry;

      const response = await axios.get("/api/users", { params });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const handleReset = () => {
    setSearchTerm("");
    setBatchYear("All Batches");
    setIndustry("All Industries");
    setPage(1);
  };

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        batchYear={batchYear}
        setBatchYear={setBatchYear}
        industry={industry}
        setIndustry={setIndustry}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onReset={handleReset}
      />
      <AlumniGrid
        alumni={data?.users || []}
        totalCount={data?.total || 0}
        page={page}
        setPage={setPage}
        totalPages={data?.pages || 1}
        isLoading={isLoading}
      />
    </>
  );
}
