"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { History, Box } from "lucide-react";
import SundookTable from "./SundookTable";
import SundookMobileList from "./SundookMobileList";

export default function SundookHistory({ records, isLoading, statusColors }) {
  if (isLoading) {
    return (
      <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
        <CardBody className="py-12 flex justify-center items-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="px-6 md:px-8 pt-8 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <History size={20} className="text-primary" />
          My Contribution History
        </h2>
      </CardHeader>
      <CardBody className="px-5 md:px-8 py-8">
        {records.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              <SundookTable records={records} statusColors={statusColors} />
            </div>
            {/* Mobile View */}
            <div className="md:hidden">
              <SundookMobileList
                records={records}
                statusColors={statusColors}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Box size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-400">
              No records found
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              You haven't submitted any Sundook records yet.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
