"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

const ActivityFilters = ({
  searchTerm,
  onSearchChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setPage,
}) => {
  const dateValue =
    startDate && endDate
      ? {
          start: parseDate(startDate),
          end: parseDate(endDate),
        }
      : null;

  const clearFilters = () => {
    onSearchChange("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
      <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
        <Input
          isClearable
          className="flex-1 lg:max-w-md"
          placeholder="Search admin or description..."
          startContent={<Search size={18} className="text-slate-400" />}
          value={searchTerm}
          onClear={() => onSearchChange("")}
          onValueChange={(val) => {
            onSearchChange(val);
            setPage(1);
          }}
          variant="bordered"
          radius="lg"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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
            setPage(1);
          }}
          aria-label="Filter by date range"
          showMonthAndYearPickers
        />

        {(searchTerm || startDate || endDate) && (
          <Button
            isIconOnly
            color="danger"
            variant="flat"
            onPress={clearFilters}
            className="shrink-0 h-10 w-10"
            radius="lg"
            title="Clear Filters"
          >
            <RotateCcw size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityFilters;
