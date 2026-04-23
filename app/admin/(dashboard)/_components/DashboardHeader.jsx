"use client";

import React from "react";
import { DateRangePicker } from "@heroui/date-picker";
import { Button } from "@heroui/button";
import { FileDown } from "lucide-react";
import { parseDate } from "@internationalized/date";

const DashboardHeader = ({
  session,
  startDate,
  endDate,
  onDateRangeChange,
  onReportOpen,
}) => {
  const dateValue =
    startDate && endDate
      ? {
          start: parseDate(startDate),
          end: parseDate(endDate),
        }
      : null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {session?.user?.name || "Admin"}!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Dashboard overview based on your selected filters.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <DateRangePicker
          className="w-full sm:w-64"
          variant="bordered"
          radius="lg"
          placeholderValue={parseDate(new Date().toISOString().split("T")[0])}
          value={dateValue}
          onChange={(val) => {
            if (val) {
              onDateRangeChange(val.start.toString(), val.end.toString());
            } else {
              onDateRangeChange("", "");
            }
          }}
          aria-label="Filter dashboard by date range"
          showMonthAndYearPickers
        />

        <Button
          color="primary"
          variant="shadow"
          startContent={<FileDown size={18} />}
          onPress={onReportOpen}
          className="font-bold w-full sm:w-auto h-10 px-6"
          radius="lg"
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
