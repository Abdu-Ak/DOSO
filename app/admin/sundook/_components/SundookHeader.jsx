"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Box, Plus } from "lucide-react";

const SundookHeader = ({ onCreateOpen }) => {
  return (
    <div className="px-1 mb-6">
      <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
        Sundook Management
      </h2>
      <p className="text-slate-600 text-sm dark:text-slate-400">
        Review and manage alumni welfare box contributions.
      </p>
    </div>
  );
};

export default SundookHeader;
