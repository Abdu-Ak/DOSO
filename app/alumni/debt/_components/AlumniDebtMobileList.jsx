"use client";

import React from "react";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  IndianRupee,
  FileText,
  Clock,
  UserCheck,
  AlertCircle,
  Check,
  X,
  UserX,
} from "lucide-react";

export default function AlumniDebtMobileList({
  records,
  currentUserId,
  onWitnessAction,
  witnessMutation,
}) {
  const statusColors = {
    pending_witness: "warning",
    pending_admin: "secondary",
    approved: "success",
    rejected: "danger",
    witness_rejected: "danger",
  };

  const statusLabels = {
    pending_witness: "Witnesses",
    pending_admin: "Admin",
    approved: "Approved",
    rejected: "Rejected",
    witness_rejected: "Witness Rejected",
  };

  return (
    <div className="space-y-4">
      {records.map((item) => {
        const isWitness1 = item.witness1?._id === currentUserId;
        const isWitness2 = item.witness2?._id === currentUserId;
        const myWitnessStatus = isWitness1
          ? item.witness1_status
          : isWitness2
            ? item.witness2_status
            : null;

        const canAction =
          (isWitness1 || isWitness2) &&
          myWitnessStatus === "pending" &&
          item.status === "pending_witness";

        const WitnessIndicator = ({ status }) => {
          if (status === "approved")
            return <Check size={14} className="text-success font-black" />;
          if (status === "rejected")
            return <X size={14} className="text-danger font-black" />;
          return <Clock size={12} className="text-warning animate-pulse" />;
        };

        return (
          <div
            key={item._id}
            className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Requester
                </p>
                <User
                  name={item.requester?.name}
                  description={item.requester?.userId}
                  avatarProps={{
                    src: item.requester?.image,
                    fallback: item.requester?.name?.[0],
                    className: "bg-primary/10 text-primary font-bold",
                    size: "sm",
                    radius: "lg",
                  }}
                />
              </div>
              <Chip
                variant="flat"
                color={statusColors[item.status]}
                size="sm"
                className="font-black text-[10px] tracking-wider uppercase h-6"
              >
                {statusLabels[item.status] || item.status}
              </Chip>
            </div>

            <div className="flex flex-wrap gap-5 py-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Amount
                </p>
                <div className="flex items-center gap-1 font-bold text-primary">
                  <IndianRupee size={16} />
                  <span className="text-sm">
                    {item.amount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Term
                </p>
                <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <Clock size={16} className="text-slate-400" />
                  <div className="text-xs">
                    {item.duration_months}{" "}
                    {item.duration_months > 1 ? "Months" : "Month"} •{" "}
                    <span className="capitalize">{item.payment_type}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Witnesses
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 px-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <span className="text-xs font-bold truncate max-w-[150px]">
                      {item.witness1?.name}
                    </span>
                    <WitnessIndicator status={item.witness1_status} />
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 px-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <span className="text-xs font-bold truncate max-w-[150px]">
                      {item.witness2?.name}
                    </span>
                    <WitnessIndicator status={item.witness2_status} />
                  </div>
                </div>
              </div>
            </div>

            {canAction ? (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <Button
                  size="md"
                  color="success"
                  variant="flat"
                  className="font-black shadow-sm w-full"
                  startContent={<UserCheck size={18} />}
                  onPress={() => onWitnessAction(item._id, "approved")}
                  isLoading={witnessMutation.isPending}
                  radius="lg"
                >
                  Approve
                </Button>
                <Button
                  size="md"
                  color="danger"
                  variant="flat"
                  className="font-bold shadow-sm w-full"
                  startContent={<UserX size={18} />}
                  onPress={() => onWitnessAction(item._id, "rejected")}
                  radius="lg"
                  isLoading={witnessMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {item.status === "approved" && item.receipt_no && (
                  <div className="flex items-center gap-2 text-xs font-bold text-success bg-success/10 px-3 py-2 rounded-xl">
                    <FileText size={14} />
                    Receipt: {item.receipt_no}
                  </div>
                )}
                {(item.status === "rejected" ||
                  item.status === "witness_rejected") && (
                  <div className="flex items-start gap-2 text-xs font-bold text-danger bg-danger/10 px-3 py-2 rounded-xl">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span className="flex-1">
                      {item.admin_reason ||
                        item.witness1_reason ||
                        item.witness2_reason ||
                        "No reason"}
                    </span>
                  </div>
                )}
                {item.status === "pending_witness" && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-bold italic flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning opacity-75 animate-pulse block" />
                      Awaiting witness verification
                    </p>
                  </div>
                )}
                {item.status === "pending_admin" && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-bold italic flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-75 animate-pulse block" />
                      Awaiting admin approval
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
