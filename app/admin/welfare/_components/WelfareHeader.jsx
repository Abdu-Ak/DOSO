"use client";

import React from "react";

import { Button } from "@heroui/button";
import { FileDown } from "lucide-react";

export default function WelfareHeader({ onReportClick, showReportButton }) {
  return (
    <div className="px-1 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
          Welfare Fund Management
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Manage and review alumni welfare fund submissions.
        </p>
      </div>
      {showReportButton && (
        <Button
          color="secondary"
          variant="flat"
          onPress={onReportClick}
          startContent={<FileDown size={18} />}
          className="font-bold self-start md:self-auto shadow-sm"
        >
          Generate Report
        </Button>
      )}
    </div>
  );
}
