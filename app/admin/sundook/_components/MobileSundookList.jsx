"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { User as UserComponent } from "@heroui/user";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  IndianRupee,
  Package,
  FileText,
  Loader2,
  Trash2,
  Inbox,
} from "lucide-react";

/**
 * Mobile view for Sundook list in Admin panel
 */
const MobileSundookList = ({
  records,
  isLoading,
  onApprove,
  onReject,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-medium text-slate-400">Loading records...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
        <p className="text-slate-400 font-medium">No records found.</p>
      </div>
    );
  }

  const colors = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  return (
    <div className="flex flex-col gap-4 lg:hidden">
      {records.map((record) => (
        <div
          key={record._id}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
            <UserComponent
              avatarProps={{
                radius: "lg",
                src: record.alumni?.image,
                fallback: record.alumni?.name?.charAt(0),
                className: "bg-primary/10 text-primary font-bold",
              }}
              description={record.alumni?.userId}
              name={record.alumni?.name}
            />
            <Chip
              className="font-black text-[10px] tracking-wider uppercase h-6"
              color={colors[record.status] || "default"}
              size="sm"
              variant="flat"
            >
              {record.status}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Year
              </p>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Calendar size={14} className="text-slate-400" />
                {record.year}
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
                Box No
              </p>
              <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Package size={14} className="text-slate-400" />
                Box #{record.box_number}
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
                color="success"
                className="flex-1 font-bold bg-success/10 text-success"
                onPress={() => onApprove(record)}
                startContent={<CheckCircle2 size={16} />}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                className="flex-1 font-bold bg-danger/10 text-danger"
                onPress={() => onReject(record)}
                startContent={<XCircle size={16} />}
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
};

export default MobileSundookList;
