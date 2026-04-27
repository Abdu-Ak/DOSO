"use client";

import React from "react";

const ActivityHeader = () => {
  return (
    <div className="px-1 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
          Activity Log
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Track all administrative actions on the platform.
        </p>
      </div>
    </div>
  );
};

export default ActivityHeader;
