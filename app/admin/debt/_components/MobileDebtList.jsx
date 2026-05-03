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
  Loader2,
  Inbox,
  Clock,
  UserCheck,
  Check,
  X,
  BadgeCheck,
  Download,
} from "lucide-react";
import { generateDebtNoticePdf } from "@/lib/pdf/generateDebtNoticePdf";
import { formatDate } from "@/lib/utils";

export default function MobileDebtList({
  records,
  isLoading,
  onApprove,
  onReject,
  onDelete,
  onRepaid,
}) {
  const statusColors = {
    pending_witness: "warning",
    pending_admin: "secondary",
    approved: "success",
    rejected: "danger",
    witness_rejected: "danger",
    repaid: "primary",
  };

  const statusLabels = {
    pending_witness: "Witnesses",
    pending_admin: "Admin",
    approved: "Approved",
    rejected: "Rejected",
    witness_rejected: "Witness Rejected",
    repaid: "Repaid",
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-medium text-slate-400">
          Loading debt records...
        </p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
        <p className="text-slate-400 font-medium">No debt data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record._id}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <User
              name={record.requester?.name}
              description={record.requester?.userId}
              avatarProps={{
                src: record.requester?.image,
                fallback: record.requester?.name?.[0],
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
              {statusLabels[record.status] || record.status}
            </Chip>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Date
              </p>
              <div className="flex items-start gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Calendar size={14} className="text-slate-400 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs">
                    {formatDate(record.createdAt)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(record.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Amount
              </p>
              <div className="flex items-center gap-1 font-bold text-primary">
                <IndianRupee size={16} />
                <span className="text-sm">
                  {record.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Witness Status
              </p>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 px-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-700 group w-full">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate flex-1">
                  {record.witness1?.name}
                </span>
                <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-600 flex items-center justify-center border border-slate-200/50 dark:border-slate-500/50 shadow-sm">
                  {record.witness1_status === "approved" ? (
                    <Check size={12} className="text-success" />
                  ) : record.witness1_status === "rejected" ? (
                    <X size={12} className="text-danger" />
                  ) : (
                    <Clock size={10} className="text-warning animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 px-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-700 group w-full">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate flex-1">
                  {record.witness2?.name}
                </span>
                <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-600 flex items-center justify-center border border-slate-200/50 dark:border-slate-500/50 shadow-sm">
                  {record.witness2_status === "approved" ? (
                    <Check size={12} className="text-success" />
                  ) : record.witness2_status === "rejected" ? (
                    <X size={12} className="text-danger" />
                  ) : (
                    <Clock size={10} className="text-warning animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {(record.status === "approved" || record.status === "repaid") && (
              <div
                className={`p-2 ${record.status === "repaid" ? "bg-primary/5" : "bg-success/5"} rounded-xl col-span-2`}
              >
                <p
                  className={`text-[10px] ${record.status === "repaid" ? "text-primary" : "text-success"} font-black uppercase mb-1 flex items-center gap-1`}
                >
                  {record.status === "repaid" ? (
                    <BadgeCheck size={10} />
                  ) : (
                    <CheckCircle2 size={10} />
                  )}{" "}
                  {record.status === "repaid" ? "Settled" : "Approved"}
                </p>
                <p className="font-bold text-sm truncate">
                  {record.receipt_no
                    ? `Receipt: ${record.receipt_no}`
                    : record.status === "repaid"
                      ? "Settled by Admin"
                      : "Approved by Admin"}
                </p>
              </div>
            )}

            {(record.status === "rejected" ||
              record.status === "witness_rejected") && (
              <div className="p-2 bg-danger/10 rounded-xl col-span-2">
                <p className="text-[10px] text-danger font-black uppercase mb-1 flex items-center gap-1">
                  <XCircle size={10} />{" "}
                  {record.status === "witness_rejected"
                    ? "Witness Rejected"
                    : "Rejected"}
                </p>
                <p className="font-bold text-sm text-danger wrap-break-word">
                  {record.admin_reason ||
                    record.witness1_reason ||
                    record.witness2_reason ||
                    "No reason provided"}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            {record.status === "pending_admin" && (
              <div className="flex gap-2 w-full">
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
              </div>
            )}
            {(record.status === "approved" || record.status === "repaid") && (
              <div className="flex gap-2 w-full">
                {record.status === "approved" && (
                  <Button
                    size="sm"
                    className="flex-1 font-bold bg-primary/10 text-primary"
                    startContent={<BadgeCheck size={16} />}
                    onPress={() => onRepaid(record)}
                  >
                    Repaid
                  </Button>
                )}
                <Button
                  size="sm"
                  className="flex-1 font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  startContent={<Download size={16} />}
                  onPress={() => generateDebtNoticePdf(record)}
                >
                  PDF
                </Button>
              </div>
            )}
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
        </div>
      ))}
    </div>
  );
}
