"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

const EnquiryFilters = ({
  searchTerm,
  onSearchChange,
  status,
  setStatus,
  startDate,
  endDate,
  onDateRangeChange,
  onClearFilters,
  showFilters = true,
  setShowFilters,
}) => {
  const dateValue =
    startDate && endDate
      ? {
          start: parseDate(startDate),
          end: parseDate(endDate),
        }
      : null;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
      {/* Search and Mobile Toggle */}
      <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
        <Input
          isClearable
          className="flex-1 lg:max-w-md"
          placeholder="Search name or phone..."
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
      </div>

      {/* Filters Area */}
      <div
        className={`flex flex-wrap items-center gap-3 w-full lg:w-auto ${!showFilters ? "hidden lg:flex" : "flex"}`}
      >
        <Select
          className="w-full sm:w-40"
          placeholder="Status"
          variant="bordered"
          radius="lg"
          selectedKeys={status ? [status] : []}
          onSelectionChange={(keys) => setStatus(Array.from(keys)[0] || "")}
        >
          <SelectItem key="" value="">
            All Status
          </SelectItem>
          <SelectItem key="Pending">Pending</SelectItem>
          <SelectItem key="Completed">Completed</SelectItem>
          <SelectItem key="Cancelled">Cancelled</SelectItem>
        </Select>

        <DateRangePicker
          className="w-full sm:w-64"
          variant="bordered"
          radius="lg"
          value={dateValue}
          onChange={(val) => {
            if (val) {
              onDateRangeChange(val.start.toString(), val.end.toString());
            } else {
              onDateRangeChange("", "");
            }
          }}
          aria-label="Filter by date range"
          placeholderValue={parseDate(new Date().toISOString().split("T")[0])}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10",
          }}
        />

        {(searchTerm || status || startDate || endDate) && (
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onPress={onClearFilters}
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

export default EnquiryFilters;
