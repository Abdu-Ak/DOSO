"use client";

import {
  AlignHorizontalDistributeCenter,
  Calendar,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import React from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { EVENT_TYPES } from "@/app/admin/events/_components/EventFilters";

export default function EventsFilter({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
  onSearch,
}) {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-12 flex flex-col gap-6 sticky top-24 z-30 transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Bar */}
        <div className="md:col-span-5">
          <Input
            label="Find Event"
            placeholder="Search by title or location..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Search className="text-slate-400" size={18} />}
            variant="bordered"
            isClearable
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <Select
            label="Category"
            placeholder="All Categories"
            variant="bordered"
            selectedKeys={category ? [category] : []}
            onSelectionChange={(keys) => setCategory([...keys][0] || "")}
          >
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Date Range */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2">
          <Input
            type="date"
            label="From"
            variant="bordered"
            value={startDate}
            onValueChange={setStartDate}
          />
          <Input
            type="date"
            label="To"
            variant="bordered"
            value={endDate}
            onValueChange={setEndDate}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            color="default"
            startContent={<RotateCcw size={16} />}
            onPress={onReset}
            size="sm"
            className="font-medium"
          >
            Reset Filters
          </Button>
        </div>

        <Button
          color="primary"
          onPress={onSearch}
          startContent={<Search size={18} />}
          className="px-8 font-bold shadow-lg shadow-primary/20"
        >
          Search Events
        </Button>
      </div>
    </div>
  );
}
