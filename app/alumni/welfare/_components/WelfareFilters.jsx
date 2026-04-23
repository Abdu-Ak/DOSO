"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { RotateCcw, Search, X } from "lucide-react";
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

export default function WelfareFilters({
  search,
  setSearch,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) {
  const hasFilters = search || fromDate || toDate;

  const dateValue =
    fromDate && toDate
      ? {
          start: parseDate(fromDate),
          end: parseDate(toDate),
        }
      : null;

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end w-full">
      <div className="flex-1 w-full">
        <Input
          isClearable
          onClear={() => setSearch("")}
          value={search}
          onValueChange={setSearch}
          placeholder="Search by description..."
          startContent={<Search className="text-slate-400" size={18} />}
          variant="bordered"
          radius="lg"
          className="w-full"
          classNames={{
            inputWrapper:
              "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
          }}
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto items-center">
        <DateRangePicker
          className="flex-1 sm:w-64"
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
          }}
          aria-label="Filter by date range"
          showMonthAndYearPickers
        />
        {hasFilters && (
          <Button
            isIconOnly
            color="danger"
            variant="flat"
            onPress={clearFilters}
            className="h-10 w-10 shrink-0"
          >
            <RotateCcw size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
