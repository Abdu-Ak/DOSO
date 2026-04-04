"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/hooks";
import axios from "axios";
import { Box, HeartHandshake } from "lucide-react";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";

import WelfareCreateModal from "./_components/WelfareCreateModal";
import WelfareTable from "./_components/WelfareTable";

export default function AlumniWelfarePage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["welfare", "my-records", fromDate, toDate, debouncedSearchTerm],
    queryFn: async () => {
      const response = await axios.get("/api/welfare", {
        params: { fromDate, toDate, search: debouncedSearchTerm },
      });
      return response.data;
    },
  });

  const records = data?.records || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <HeartHandshake className="text-primary" />
            Welfare Fund
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your contributions and keep track of your welfare fund
            receipts.
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onClick={() => setIsCreateModalOpen(true)}
          className="font-bold shadow-lg shadow-primary/20 shrink-0"
        >
          Add Welfare
        </Button>
      </div>

      <WelfareTable
        records={records}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />

      <WelfareCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
