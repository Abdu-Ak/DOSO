"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import { CheckCircle2, AlertCircle, Calendar, IndianRupee } from "lucide-react";

export default function WelfareMobileList({ records, statusColors }) {
  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record._id}
          className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Calendar size={14} />
              </div>
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Chip
              variant="flat"
              color={statusColors[record.status]}
              size="sm"
              className="font-black text-[10px] tracking-wider uppercase h-6"
            >
              {record.status}
            </Chip>
          </div>

          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Amount
              </p>
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <IndianRupee size={14} />
                {record.amount}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Description
              </p>
              <div className="font-medium text-slate-700 dark:text-slate-300">
                {record.description}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {record.status === "approved" && (
              <div className="flex items-center gap-2 text-xs font-bold text-success bg-success/10 px-3 py-2 rounded-xl">
                <CheckCircle2 size={14} />
                Receipt: {record.receipt_number}
              </div>
            )}
            {record.status === "rejected" && (
              <div className="flex items-start gap-2 text-xs font-bold text-danger bg-danger/10 px-3 py-2 rounded-xl">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span className="flex-1">{record.rejection_reason}</span>
              </div>
            )}
            {record.status === "pending" && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400 font-bold italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse block" />
                  Awaiting administrative review
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
