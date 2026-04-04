"use client";

import React from "react";
import { Plus, Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

const WelfareFilters = ({
  status,
  setStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  setPage,
  showFilters = true,
  setShowFilters,
  searchTerm,
  onSearchChange,
  onCreateOpen,
}) => {
  const dateValue =
    fromDate && toDate
      ? {
          start: parseDate(fromDate),
          end: parseDate(toDate),
        }
      : null;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
      {/* Search and Mobile Actions */}
      <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
        <Input
          isClearable
          className="flex-1 lg:max-w-md"
          placeholder="Search by alumni, description..."
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
          className="w-full sm:w-32"
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

        <DateRangePicker
          className="w-full sm:w-64"
          variant="bordered"
          radius="lg"
          placeholderValue={parseDate(new Date().toISOString().split("T")[0])}
          value={dateValue}
          onChange={(val) => {
            if (val) {
              setFromDate(val.start.toString());
              setToDate(val.end.toString());
            } else {
              setFromDate("");
              setToDate("");
            }
            setPage(1);
          }}
          aria-label="Filter by date range"
        />

        {(status || fromDate || toDate || searchTerm) && (
          <Button
            isIconOnly
            color="danger"
            variant="flat"
            onPress={() => {
              onSearchChange("");
              setStatus("");
              setFromDate("");
              setToDate("");
              setPage(1);
            }}
            className="shrink-0 h-10 w-10"
            radius="lg"
            title="Clear Filters"
          >
            <RotateCcw size={18} />
          </Button>
        )}

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

export default WelfareFilters;
