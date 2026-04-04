"use client";

import React from "react";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Calendar,
  IndianRupee,
  FileText,
} from "lucide-react";

export default function MobileWelfareList({
  records,
  onApprove,
  onReject,
  onDelete,
}) {
  const statusColors = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record._id}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <User
              name={record.alumni?.name}
              description={record.alumni?.userId}
              avatarProps={{
                src: record.alumni?.image,
                fallback: record.alumni?.name?.[0],
                className: "bg-primary/10 text-primary font-bold",
                radius: "lg",
              }}
            />
            <Chip
              variant="flat"
              color={statusColors[record.status]}
              size="sm"
              className="font-black text-[10px] tracking-wider uppercase h-6"
            >
              {record.status}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Date
              </p>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Calendar size={14} className="text-slate-400" />
                {new Date(record.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Amount
              </p>
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <IndianRupee size={14} />
                {record.amount}
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Description
              </p>
              <div className="font-medium text-slate-700 dark:text-slate-300 wrap-break-word">
                {record.description}
              </div>
            </div>
            {record.status === "approved" && record.receipt_number && (
              <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl col-span-2">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                  <FileText size={10} /> Receipt
                </p>
                <p className="font-bold text-sm truncate">
                  {record.receipt_number}
                </p>
              </div>
            )}
            {record.status === "rejected" && record.rejection_reason && (
              <div className="p-2 bg-danger/10 rounded-xl col-span-2">
                <p className="text-[10px] text-danger font-black uppercase mb-1 flex items-center gap-1">
                  <XCircle size={10} /> Reason
                </p>
                <p className="font-bold text-sm text-danger truncate">
                  {record.rejection_reason}
                </p>
              </div>
            )}
          </div>

          {record.status === "pending" ? (
            <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="sm"
                className="flex-1 font-bold bg-success/10 text-success"
                startContent={<CheckCircle2 size={16} />}
                onPress={() => onApprove(record)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                className="flex-1 font-bold bg-danger/10 text-danger"
                startContent={<XCircle size={16} />}
                onPress={() => onReject(record)}
              >
                Reject
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => onDelete(record)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => onDelete(record)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
