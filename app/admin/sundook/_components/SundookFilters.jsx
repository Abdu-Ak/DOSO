"use client";

import React from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

const SundookFilters = ({
  status,
  setStatus,
  year,
  setYear,
  setPage,
  showFilters = true,
  setShowFilters,
  searchTerm,
  onSearchChange,
  onCreateOpen,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear - i).toString(),
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
      {/* Search and Mobile Actions */}
      <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
        <Input
          isClearable
          className="flex-1 lg:max-w-md"
          placeholder="Search alumni name or ID..."
          startContent={<Search size={18} className="text-slate-400" />}
          value={searchTerm}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
          variant="bordered"
          radius="lg"
        />
        <Button
          isIconOnly
          variant="flat"
          onPress={() => setShowFilters(!showFilters)}
          className="lg:hidden text-slate-600 dark:text-slate-400"
          radius="lg"
        >
          <Filter size={18} />
        </Button>
        <Button
          isIconOnly
          color="primary"
          onPress={onCreateOpen}
          className="lg:hidden shadow-lg shadow-primary/20"
          radius="lg"
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Filters (Collapsible on mobile) */}
      <div
        className={`flex flex-wrap items-center gap-3 w-full lg:w-auto ${!showFilters ? "hidden lg:flex" : "flex"}`}
      >
        <Select
          className="w-full sm:w-36"
          placeholder="Status"
          variant="bordered"
          radius="lg"
          selectedKeys={status ? [status] : []}
          onSelectionChange={(keys) => {
            setStatus(Array.from(keys)[0] || "");
            setPage(1);
          }}
        >
          <SelectItem key="" value="">
            All Status
          </SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="approved">Approved</SelectItem>
          <SelectItem key="rejected">Rejected</SelectItem>
        </Select>

        <Select
          className="w-full sm:w-36"
          placeholder="Year"
          variant="bordered"
          radius="lg"
          selectedKeys={year ? [year] : []}
          onSelectionChange={(keys) => {
            setYear(Array.from(keys)[0] || "");
            setPage(1);
          }}
        >
          <SelectItem key="" value="">
            All Years
          </SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </Select>

        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={onCreateOpen}
          className="hidden lg:flex font-bold shadow-lg shadow-primary/20 w-auto"
          radius="lg"
        >
          Create Record
        </Button>
      </div>
    </div>
  );
};

export default SundookFilters;
