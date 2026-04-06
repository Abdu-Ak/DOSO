"use client";

import React from "react";
import { Button } from "@heroui/button";
import { FileDown, Plus } from "lucide-react";

const SundookHeader = ({ onReportClick, showReportButton }) => {
  return (
    <div className="px-1 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
          Sundook Management
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Review and manage alumni welfare box contributions.
        </p>
      </div>
      <div className="flex gap-2 self-start md:self-auto">
        {showReportButton && (
          <Button
            color="secondary"
            variant="flat"
            onPress={onReportClick}
            startContent={<FileDown size={18} />}
            className="font-bold shadow-sm"
          >
            Generate Report
          </Button>
        )}
      </div>
    </div>
  );
};

export default SundookHeader;
