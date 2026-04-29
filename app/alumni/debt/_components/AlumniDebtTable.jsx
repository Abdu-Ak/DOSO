"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Check,
  X,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  UserX,
  CheckCircle2,
} from "lucide-react";
import { User } from "@heroui/user";

const STATUS_COLOR = {
  pending_witness: "warning",
  pending_admin: "secondary",
  approved: "success",
  rejected: "danger",
  witness_rejected: "danger",
  repaid: "primary",
};

const STATUS_LABEL = {
  pending_witness: "Witnesses",
  pending_admin: "Admin",
  approved: "Approved",
  rejected: "Rejected",
  witness_rejected: "Witness Rejected",
  repaid: "Repaid",
};

export default function AlumniDebtTable({
  records,
  isLoading,
  currentUserId,
  onWitnessAction,
  witnessMutation,
}) {
  const renderCell = (item, columnKey) => {
    const isWitness1 = item.witness1?._id === currentUserId;
    const isWitness2 = item.witness2?._id === currentUserId;
    const myWitnessStatus = isWitness1
      ? item.witness1_status
      : isWitness2
        ? item.witness2_status
        : null;

    switch (columnKey) {
      case "alumni":
        return (
          <User
            name={item.requester?.name}
            description={item.requester?.userId}
            avatarProps={{
              src: item.requester?.image,
              fallback: item.requester?.name?.[0],
              className: "bg-primary/10 text-primary font-bold",
              radius: "lg",
            }}
          />
        );
      case "amount":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">
              ₹{item.amount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
              {item.payment_type} • {item.duration_months}{" "}
              {item.duration_months > 1 ? "Months" : "Month"}
            </span>
          </div>
        );
      case "witnesses":
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
                <WitnessIndicator status={item.witness1_status} />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-24 truncate">
                {item.witness1?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                <WitnessIndicator status={item.witness2_status} />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-24 truncate">
                {item.witness2?.name}
              </span>
            </div>
          </div>
        );
      case "status":
        return (
          <Chip
            color={STATUS_COLOR[item.status]}
            variant="flat"
            size="sm"
            className="font-black text-[10px] tracking-wider uppercase h-6"
          >
            {STATUS_LABEL[item.status] || item.status}
          </Chip>
        );
      case "actions":
        if (
          item.status === "pending_witness" &&
          (isWitness1 || isWitness2) &&
          myWitnessStatus === "pending"
        ) {
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                color="success"
                variant="flat"
                className="font-black shadow-sm"
                startContent={<UserCheck size={14} />}
                onPress={() => onWitnessAction(item._id, "approved")}
                isLoading={witnessMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="font-bold shadow-sm"
                startContent={<UserX size={14} />}
                onPress={() => onWitnessAction(item._id, "rejected")}
                isLoading={witnessMutation.isPending}
              >
                Reject
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-end min-h-[32px] gap-2">
            {(item.status === "approved" || item.status === "repaid") && (
              <div
                className={`flex items-center gap-1.5 text-xs font-bold ${item.status === "repaid" ? "text-primary bg-primary/10" : "text-success bg-success/10"} px-3 py-1 rounded-full whitespace-nowrap`}
              >
                {item.status === "repaid" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <FileText size={13} />
                )}
                {item.receipt_no
                  ? `Receipt: ${item.receipt_no}`
                  : item.status === "repaid"
                    ? "Settled by Admin"
                    : "Approved by Admin"}
              </div>
            )}
            {(item.status === "rejected" ||
              item.status === "witness_rejected") && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-danger bg-danger/10 px-3 py-1 rounded-full max-w-[150px] truncate">
                <AlertCircle size={13} className="shrink-0" />
                {item.admin_reason ||
                  item.witness1_reason ||
                  item.witness2_reason ||
                  "No reason"}
              </div>
            )}
            {item.status === "pending_witness" && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-warning"></span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic whitespace-nowrap">
                  Awaiting witness
                </span>
              </div>
            )}
            {item.status === "pending_admin" && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic whitespace-nowrap">
                  Awaiting admin
                </span>
              </div>
            )}
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <Table aria-label="Alumni Debt Table" removeWrapper className="w-full">
      <TableHeader>
        <TableColumn className="font-black text-xs tracking-widest uppercase">
          Requester
        </TableColumn>
        <TableColumn className="font-black text-xs tracking-widest uppercase text-center">
          Amount & Plan
        </TableColumn>
        <TableColumn className="font-black text-xs tracking-widest uppercase">
          Witness Status
        </TableColumn>
        <TableColumn className="font-black text-xs tracking-widest uppercase text-center">
          Overall Status
        </TableColumn>
        <TableColumn className="font-black text-xs tracking-widest uppercase text-right">
          Action / Info
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent="No debt records found" isLoading={isLoading}>
        {records.map((item) => (
          <TableRow
            key={item._id}
            className="border-b border-slate-50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors h-20"
          >
            <TableCell>{renderCell(item, "alumni")}</TableCell>
            <TableCell className="text-center">
              {renderCell(item, "amount")}
            </TableCell>
            <TableCell>{renderCell(item, "witnesses")}</TableCell>
            <TableCell className="text-center">
              {renderCell(item, "status")}
            </TableCell>
            <TableCell className="text-right">
              {renderCell(item, "actions")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
