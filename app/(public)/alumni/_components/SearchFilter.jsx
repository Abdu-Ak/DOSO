"use client";

import React from "react";
import { Search, RotateCcw, Filter, X } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

const BATCHES = [
  "All Batches",
  "Batch of 2023",
  "Batch of 2022",
  "Batch of 2021",
  "Batch of 2020",
  "Batch of 2019",
];

const INDUSTRIES = [
  "All Industries",
  "Islamic Studies",
  "Education",
  "Technology",
  "Healthcare",
  "Business",
];

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  batchYear,
  setBatchYear,
  industry,
  setIndustry,
  showFilters,
  setShowFilters,
  onReset,
}) {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-12 flex flex-col gap-6 sticky top-24 z-30 transition-shadow hover:shadow-md">
      {/* Mobile Header with Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="flex-1 relative">
          <Input
            placeholder="Search alumni..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Search className="text-slate-400" size={16} />}
            variant="bordered"
            isClearable
            className="w-full"
          />
        </div>
        <Button
          isIconOnly
          variant={showFilters ? "solid" : "flat"}
          color={showFilters ? "primary" : "default"}
          onPress={() => setShowFilters(!showFilters)}
          radius="lg"
          size="sm"
        >
          {showFilters ? <X size={18} /> : <Filter size={18} />}
        </Button>
      </div>

      {/* Filter Grid (Collapsible on mobile) */}
      <div
        className={`${!showFilters ? "hidden md:grid" : "grid"} grid-cols-1 md:grid-cols-12 gap-4 items-end`}
      >
        {/* Desktop Search Bar (Hidden on mobile as it's in the header) */}
        <div className="hidden md:block md:col-span-4">
          <Input
            label="Find Alumni"
            placeholder="Search by name, company, or location..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Search className="text-slate-400" size={18} />}
            variant="bordered"
            isClearable
            className="w-full"
          />
        </div>

        {/* Batch Filter */}
        <div className="md:col-span-3">
          <Select
            label="Batch Year"
            placeholder="All Batches"
            variant="bordered"
            selectedKeys={batchYear ? [batchYear] : []}
            onSelectionChange={(keys) =>
              setBatchYear([...keys][0] || "All Batches")
            }
          >
            {BATCHES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Occupation Filter */}
        <div className="md:col-span-3">
          <Select
            label="Field / Industry"
            placeholder="All Industries"
            variant="bordered"
            selectedKeys={industry ? [industry] : []}
            onSelectionChange={(keys) =>
              setIndustry([...keys][0] || "All Industries")
            }
          >
            {INDUSTRIES.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-2 flex items-center justify-start md:justify-end">
          <Button
            variant="light"
            color="default"
            startContent={<RotateCcw size={16} />}
            onPress={onReset}
            size="sm"
            className="font-medium bg-slate-100 dark:bg-slate-300 w-fit"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
