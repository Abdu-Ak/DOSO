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
  BadgeCheck,
  Download,
  Bell,
  Wallet,
} from "lucide-react";
import { generateDebtNoticePdf } from "@/lib/pdf/generateDebtNoticePdf";

export const getDebtColumns = ({
  onApprove,
  onReject,
  onDelete,
  onRepaid,
  onManageRepayments,
}) => [
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
              {record.status === "approved" &&
                record.payment_type === "single" && (
                  <DropdownItem
                    key="repaid"
                    startContent={<BadgeCheck size={16} />}
                    onPress={() => onRepaid(record)}
                    className="text-primary font-bold"
                    color="primary"
                  >
                    Mark as Repaid
                  </DropdownItem>
                )}
              {record.status === "approved" &&
                record.payment_type === "emi" && (
                  <DropdownItem
                    key="manage_repayments"
                    startContent={<Wallet size={16} />}
                    onPress={() => onManageRepayments(record)}
                    className="text-primary font-bold"
                    color="primary"
                  >
                    Manage Repayments
                  </DropdownItem>
                )}
              {record.status === "approved" && (
                <DropdownItem
                  key="whatsapp_reminder"
                  startContent={<Bell size={16} />}
                onPress={() => {
                    const name = record.requester?.name;
                    const phone = record.requester?.phone;
                    const id = record.requester?.userId || record._id;
                    
                    // Find target due date (next pending installment or main due date)
                    let targetDate;
                    if (record.payment_type === "emi" && record.installments?.length > 0) {
                      const nextInstallment = record.installments.find(i => i.status === "pending");
                      targetDate = nextInstallment ? new Date(nextInstallment.dueDate) : new Date(record.dueDate);
                    } else {
                      targetDate = new Date(record.dueDate);
                    }

                    const isValidDate = targetDate instanceof Date && !isNaN(targetDate);
                    const dateStr = isValidDate ? targetDate.toLocaleDateString("en-IN") : "the specified date";
                    const daysLeft = isValidDate 
                      ? Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24))
                      : null;

                    let message;
                    if (daysLeft !== null && daysLeft < 0) {
                      message = `Hello ${name}, your debt repayment for DOSO (ID: ${id}) is OVERDUE since ${dateStr}. Please ensure immediate repayment to avoid any issues. Thank you.`;
                    } else if (daysLeft !== null && daysLeft <= 7) {
                      message = `Hello ${name}, your debt repayment for DOSO (ID: ${id}) is reaching its due date on ${dateStr}. Only ${daysLeft} days left. Please ensure timely repayment. Thank you.`;
                    } else {
                      message = `Hello ${name}, this is a friendly reminder regarding your debt repayment for DOSO (ID: ${id}) due on ${dateStr}. Please ensure timely repayment. Thank you.`;
                    }
                    
                    const whatsappUrl = `https://wa.me/${phone?.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="text-warning font-bold"
                  color="warning"
                >
                  WhatsApp Reminder
                </DropdownItem>
              )}
              {(record.status === "approved" || record.status === "repaid") && (
                <DropdownItem
                  key="download"
                  startContent={<Download size={16} />}
                  onPress={() => generateDebtNoticePdf(record)}
                  className="text-slate-700 font-bold"
                >
                  Download PDF
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
        repaid: "primary",
      };
      const labels = {
        pending_witness: "Witnesses",
        pending_admin: "Admin",
        approved: "Approved",
        rejected: "Rejected",
        witness_rejected: "Witness Rejected",
        repaid: "Repaid",
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

      if (record.status === "approved" || record.status === "repaid") {
        const isRepaid = record.status === "repaid";
        const paidCount =
          record.installments?.filter((i) => i.status === "paid").length || 0;
        const totalCount = record.installments?.length || 0;

        return (
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-[10px] font-bold ${isRepaid ? "text-primary" : "text-success"} uppercase tracking-wider flex items-center gap-1`}
              >
                {isRepaid ? <BadgeCheck size={10} /> : <CheckCircle2 size={10} />}{" "}
                {isRepaid ? "Settled" : "Approved"}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold truncate max-w-[120px]">
                {record.receipt_no
                  ? `Receipt: ${record.receipt_no}`
                  : isRepaid
                    ? "Settled by Admin"
                    : "Approved by Admin"}
              </span>
            </div>
            {record.payment_type === "emi" && record.status === "approved" && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-md w-fit">
                <span className="text-[9px] font-black text-primary uppercase tracking-tighter">
                  {paidCount} / {totalCount} Repaid
                </span>
              </div>
            )}
          </div>
        );
      }

      if (
        record.status === "rejected" ||
        record.status === "witness_rejected"
      ) {
        const isWitnessRejected = record.status === "witness_rejected";
        const reason =
          record.admin_reason ||
          record.witness1_reason ||
          record.witness2_reason;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-danger uppercase tracking-wider flex items-center gap-1">
              <XCircle size={10} />{" "}
              {isWitnessRejected ? "Witness Rejected" : "Rejected"}
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
