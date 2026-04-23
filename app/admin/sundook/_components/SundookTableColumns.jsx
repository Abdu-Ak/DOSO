"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { User as UserComponent } from "@heroui/user";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
} from "lucide-react";

export const getSundookColumns = ({ onApprove, onReject, onDelete }) => [
  {
    header: "Alumni",
    accessorKey: "alumni.name",
    cell: (info) => {
      const record = info.row.original;
      return (
        <div className="flex items-center justify-between gap-2 group">
          <UserComponent
            avatarProps={{
              radius: "lg",
              src: record.alumni?.image,
              fallback: record.alumni?.name?.charAt(0),
            }}
            description={record.alumni?.userId}
            name={record.alumni?.name || "Unknown Alumni"}
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <MoreVertical size={18} className="text-slate-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Sundook actions" variant="flat">
              {record.status === "pending" && (
                <DropdownItem
                  key="approve"
                  color="success"
                  startContent={<CheckCircle2 size={16} />}
                  onPress={() => onApprove(record)}
                  className="text-success font-bold"
                >
                  Approve Record
                </DropdownItem>
              )}
              {record.status === "pending" && (
                <DropdownItem
                  key="reject"
                  color="danger"
                  startContent={<XCircle size={16} />}
                  onPress={() => onReject(record)}
                  className="text-danger font-bold"
                >
                  Reject Record
                </DropdownItem>
              )}
              <DropdownItem
                key="delete"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(record)}
                className="text-danger font-bold"
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
    header: "Year",
    accessorKey: "year",
    cell: (info) => (
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {info.getValue()}
      </span>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info) => (
      <span className="text-xs font-bold text-primary">₹{info.getValue()}</span>
    ),
  },
  {
    header: "Box Number",
    accessorKey: "box_number",
    cell: (info) => (
      <span className="text-slate-700 dark:text-slate-300 text-xs font-bold">
        Box #{info.getValue()}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue();
      const colors = {
        pending: "warning",
        approved: "success",
        rejected: "danger",
      };
      return (
        <Chip
          className="font-black text-[10px] tracking-wider uppercase h-6"
          color={colors[status] || "default"}
          size="sm"
          variant="flat"
        >
          {status}
        </Chip>
      );
    },
  },
  {
    header: "Details",
    accessorKey: "details",
    cell: (info) => {
      const record = info.row.original;

      if (record.status === "approved" && record.receipt_number) {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileText size={10} /> Receipt
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px]">
              {record.receipt_number}
            </span>
          </div>
        );
      }

      if (record.status === "rejected" && record.rejection_reason) {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-danger uppercase tracking-wider flex items-center gap-1">
              <XCircle size={10} /> Reason
            </span>
            <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
              {record.rejection_reason}
            </span>
          </div>
        );
      }

      return <span className="text-slate-400 text-xs">-</span>;
    },
  },
];
