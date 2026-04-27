"use client";

import React from "react";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Check,
  X,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  FileText,
  Clock,
} from "lucide-react";

export const getDebtColumns = ({ onApprove, onReject, onDelete }) => [
  {
    header: "Alumni",
    accessorKey: "requester.name",
    cell: (info) => {
      const record = info.row.original;
      return (
        <div className="flex items-center justify-between gap-2 group">
          <User
            name={record?.requester?.name}
            description={record?.requester?.userId}
            avatarProps={{
              src: record?.requester?.image,
              fallback: record?.requester?.name?.[0],
              className: "bg-primary/10 text-primary font-bold",
              radius: "lg",
            }}
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <MoreVertical size={18} className="text-slate-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Debt actions" variant="flat">
              {record.status === "pending_admin" && (
                <DropdownItem
                  key="approve"
                  startContent={<CheckCircle2 size={16} />}
                  onPress={() => onApprove(record)}
                  className="text-success font-bold"
                  color="success"
                >
                  Approve Debt
                </DropdownItem>
              )}
              {record.status === "pending_admin" && (
                <DropdownItem
                  key="reject"
                  startContent={<XCircle size={16} />}
                  onPress={() => onReject(record)}
                  className="text-danger font-bold"
                  color="danger"
                >
                  Reject Debt
                </DropdownItem>
              )}
              <DropdownItem
                key="delete"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(record)}
                className="text-danger font-bold"
                color="danger"
              >
                Delete Record
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info) => {
      const record = info.row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary">
            ₹{info.getValue().toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
            {record.payment_type} • {record.duration_months} Months
          </span>
        </div>
      );
    },
  },
  {
    header: "Witnesses",
    accessorKey: "witnesses",
    cell: (info) => {
      const record = info.row.original;
      const WitnessIndicator = ({ status }) => {
        if (status === "approved")
          return <Check size={14} className="text-success" />;
        if (status === "rejected")
          return <X size={14} className="text-danger" />;
        return <Clock size={12} className="text-warning animate-pulse" />;
      };

      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 group">
            <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
              <WitnessIndicator status={record.witness1_status} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-24 truncate">
              {record.witness1?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
              <WitnessIndicator status={record.witness2_status} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-24 truncate">
              {record.witness2?.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue();
      const colors = {
        pending_witness: "warning",
        pending_admin: "secondary",
        approved: "success",
        rejected: "danger",
        witness_rejected: "danger",
      };
      const labels = {
        pending_witness: "Witnesses",
        pending_admin: "Admin",
        approved: "Approved",
        rejected: "Rejected",
        witness_rejected: "Witness Rejected",
      };
      return (
        <Chip
          variant="flat"
          color={colors[status] || "default"}
          size="sm"
          className="font-black text-[10px] tracking-wider uppercase h-6"
        >
          {labels[status] || status}
        </Chip>
      );
    },
  },
  {
    header: "Requested On",
    accessorKey: "createdAt",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {new Date(info.getValue()).toLocaleDateString("en-IN")}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">
          {new Date(info.getValue()).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ),
  },
  {
    header: "Outcome",
    accessorKey: "outcome",
    cell: (info) => {
      const record = info.row.original;

      if (record.status === "approved" && record.receipt_no) {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
              <FileText size={10} /> Receipt
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold truncate max-w-[120px]">
              {record.receipt_no}
            </span>
          </div>
        );
      }

      if (
        record.status === "rejected" ||
        record.status === "witness_rejected"
      ) {
        const reason =
          record.admin_reason ||
          record.witness1_reason ||
          record.witness2_reason;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-danger uppercase tracking-wider flex items-center gap-1">
              <XCircle size={10} /> Reason
            </span>
            <span
              className="text-xs text-slate-500 font-medium truncate max-w-[120px]"
              title={reason}
            >
              {reason || "No reason provided"}
            </span>
          </div>
        );
      }

      return <span className="text-slate-400 text-xs">-</span>;
    },
  },
];
