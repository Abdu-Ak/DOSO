"use client";

import React from "react";
import { Button } from "@heroui/button";
import { FileDown } from "lucide-react";

const UserHeader = ({ onReportClick, showReportButton }) => {
  return (
    <div className="px-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-xl font-body! font-bold text-slate-900 dark:text-white">
          User Management
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Manage and monitor all users across the platform.
        </p>
      </div>
      {showReportButton && (
        <Button
          color="secondary"
          variant="flat"
          onPress={onReportClick}
          startContent={<FileDown size={18} />}
          className="font-bold shrink-0"
          radius="lg"
        >
          Generate Report
        </Button>
      )}
    </div>
  );
};

export default UserHeader;
