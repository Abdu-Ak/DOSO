"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search, Filter, RotateCcw, MapPin } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

export const EVENT_TYPES = [
  "Academic",
  "Culture",
  "Sports",
  "Religious",
  "Seminar",
  "Other",
];

export default function EventFilters({
  searchTerm,
  setSearchTerm,
  type,
  setType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showFilters = true,
  setShowFilters,
  onReset,
}) {
  const dateValue =
    startDate && endDate
      ? {
          start: parseDate(startDate),
          end: parseDate(endDate),
        }
      : null;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
      {/* Search and Mobile Actions */}
      <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
        <Input
          isClearable
          className="flex-1 lg:max-w-md"
          placeholder="Search by title or place..."
          startContent={<Search size={18} className="text-slate-400" />}
          value={searchTerm}
          onClear={() => setSearchTerm("")}
          onValueChange={setSearchTerm}
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
          as={Link}
          href="/admin/events/create"
          isIconOnly
          color="primary"
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
          className="w-full sm:w-40"
          placeholder="Category"
          variant="bordered"
          radius="lg"
          selectedKeys={type ? [type] : []}
          onSelectionChange={(keys) => setType([...keys][0] || "")}
        >
          <SelectItem key="" value="">
            All Categories
          </SelectItem>
          {EVENT_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </Select>

        <DateRangePicker
          className="w-full sm:w-64"
          variant="bordered"
          radius="lg"
          placeholderValue={parseDate(new Date().toISOString().split("T")[0])}
          value={dateValue}
          onChange={(val) => {
            if (val) {
              setStartDate(val.start.toString());
              setEndDate(val.end.toString());
            } else {
              setStartDate("");
              setEndDate("");
            }
          }}
          aria-label="Filter by date range"
          showMonthAndYearPickers
        />

        <Button
          variant="flat"
          onPress={onReset}
          isIconOnly
          className="text-slate-500"
          radius="lg"
          title="Reset Filters"
        >
          <RotateCcw size={18} />
        </Button>

        <Button
          as={Link}
          href="/admin/events/create"
          color="primary"
          startContent={<Plus size={18} />}
          className="hidden lg:flex font-bold shadow-lg shadow-primary/20 w-auto"
          radius="lg"
        >
          Add Event
        </Button>
      </div>
    </div>
  );
}
