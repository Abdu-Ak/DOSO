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
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  FileText,
} from "lucide-react";

export const getWelfareColumns = ({ onApprove, onReject, onDelete }) => [
  {
    header: "Alumni",
    accessorKey: "alumni.name",
    cell: (info) => {
      const record = info.row.original;
      return (
        <div className="flex items-center justify-between gap-2 group">
          <User
            name={record?.alumni?.name}
            description={record?.alumni?.userId}
            avatarProps={{
              src: record?.alumni?.image,
              fallback: record?.alumni?.name?.[0],
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
            <DropdownMenu aria-label="Welfare actions" variant="flat">
              {record.status === "pending" && (
                <DropdownItem
                  key="approve"
                  startContent={<CheckCircle2 size={16} />}
                  onPress={() => onApprove(record)}
                  className="text-success font-bold"
                  color="success"
                >
                  Approve Record
                </DropdownItem>
              )}
              {record.status === "pending" && (
                <DropdownItem
                  key="reject"
                  startContent={<XCircle size={16} />}
                  onPress={() => onReject(record)}
                  className="text-danger font-bold"
                  color="danger"
                >
                  Reject Record
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
    header: "Date",
    accessorKey: "createdAt",
    cell: (info) => {
      const record = info.row.original;
      return (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {new Date(record.createdAt).toLocaleDateString()}
        </span>
      );
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (info) => (
      <span
        className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px] block"
        title={info.getValue()}
      >
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
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue() || "pending";
      const colors = {
        pending: "warning",
        approved: "success",
        rejected: "danger",
      };
      return (
        <Chip
          variant="flat"
          color={colors[status] || "default"}
          size="sm"
          className="font-black text-[10px] tracking-wider uppercase h-6 w-[80px]"
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
