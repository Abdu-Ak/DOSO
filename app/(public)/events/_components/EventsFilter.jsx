"use client";

import { Calendar, RotateCcw, Search, X, Filter } from "lucide-react";
import React from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { EVENT_TYPES } from "@/app/admin/events/_components/EventFilters";

export default function EventsFilter({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  dateRange,
  setDateRange,
  showFilters,
  setShowFilters,
  onReset,
  onSearch,
}) {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-12 flex flex-col gap-6 sticky top-24 z-30 transition-shadow hover:shadow-md">
      {/* Mobile Header with Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="flex-1 relative">
          <Input
            placeholder="Search events..."
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
            placeholder="All"
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

        {/* Date Range Picker */}
        <div className="md:col-span-3">
          <DateRangePicker
            label="Event Dates"
            variant="bordered"
            value={dateRange}
            onChange={setDateRange}
            className="w-full"
            showMonthAndYearPickers
          />
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
