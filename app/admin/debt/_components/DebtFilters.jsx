"use client";

import React from "react";
import { Search, Filter, RotateCcw, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

const DebtFilters = ({
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
  onCreateClick,
  canManage,
}) => {
  const dateValue =
    fromDate && toDate
      ? {
          start: parseDate(fromDate),
          end: parseDate(toDate),
        }
      : null;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2 w-full lg:w-max">
        <Input
          isClearable
          className="flex-1 lg:w-72"
          placeholder="Search by alumni, user ID..."
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
        {canManage && (
          <Button
            isIconOnly
            color="primary"
            onPress={onCreateClick}
            className="lg:hidden shadow-lg shadow-primary/20 shrink-0"
            radius="lg"
          >
            <Plus size={18} />
          </Button>
        )}
      </div>

      <div
        className={`flex flex-wrap items-center gap-3 w-full lg:w-auto ${
          !showFilters ? "hidden lg:flex" : "flex"
        }`}
      >
        <Select
          className="w-full sm:w-44"
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
            All Statuses
          </SelectItem>
          <SelectItem key="pending_witness" value="pending_witness">
            Pending Witness
          </SelectItem>
          <SelectItem key="pending_admin" value="pending_admin">
            Pending Admin
          </SelectItem>
          <SelectItem key="approved" value="approved">
            Approved
          </SelectItem>
          <SelectItem key="rejected" value="rejected">
            Rejected
          </SelectItem>
          <SelectItem key="witness_rejected" value="witness_rejected">
            Witness Rejected
          </SelectItem>
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
          showMonthAndYearPickers
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

        {canManage && (
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onPress={onCreateClick}
            className="hidden lg:flex font-bold shadow-lg shadow-primary/20 w-auto"
            radius="lg"
          >
            Create Record
          </Button>
        )}
      </div>
    </div>
  );
};

export default DebtFilters;
