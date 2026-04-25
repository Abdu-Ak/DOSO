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
  Clock,
  Trash2,
} from "lucide-react";
import CustomTooltip from "@/components/admin/ui/CustomTooltip";

const statusColorMap = {
  Pending: "warning",
  Completed: "success",
  Cancelled: "danger",
};

const statusIconMap = {
  Pending: <Clock size={16} />,
  Completed: <CheckCircle2 size={16} />,
  Cancelled: <XCircle size={16} />,
};

export const getEnquiryColumns = ({ onStatusChange, onDelete }) => [
  {
    header: "CONTACT INFO",
    accessorKey: "name",
    cell: (info) => {
      const enquiry = info.row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
            {enquiry.name || "Unknown"}
          </p>
          <p className="text-xs text-slate-500 font-medium">{enquiry.phone}</p>
        </div>
      );
    },
  },
  {
    header: "SUBJECT",
    accessorKey: "subject",
    cell: (info) => (
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {info.getValue()}
      </span>
    ),
  },
  {
    header: "ENQUIRY DETAILS",
    accessorKey: "message",
    cell: (info) => {
      const message = info.getValue();
      return (
        <CustomTooltip
          content={message}
          placement="bottom-start"
          className="max-w-[400px]"
        >
          <p className="text-sm truncate max-w-[250px] text-slate-600 dark:text-slate-400 cursor-help">
            {message}
          </p>
        </CustomTooltip>
      );
    },
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue();
      const enquiry = info.row.original;

      return (
        <Dropdown>
          <DropdownTrigger>
            <div className="cursor-pointer">
              <Chip
                className="select-none font-bold text-[10px] tracking-wider uppercase h-6"
                color={statusColorMap[status]}
                size="sm"
                variant="flat"
                startContent={statusIconMap[status]}
              >
                {status}
              </Chip>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Change Status"
            onAction={(key) => onStatusChange(enquiry._id, key)}
            selectionMode="single"
            selectedKeys={[status]}
          >
            <DropdownItem
              key="Completed"
              startContent={<CheckCircle2 className="text-success" size={16} />}
            >
              Mark Completed
            </DropdownItem>
            <DropdownItem
              key="Cancelled"
              startContent={<XCircle className="text-danger" size={16} />}
            >
              Mark Cancelled
            </DropdownItem>
            <DropdownItem
              key="Pending"
              startContent={<Clock className="text-warning" size={16} />}
            >
              Mark Pending
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    },
  },
  {
    header: "RECEIVED ON",
    accessorKey: "createdAt",
    cell: (info) => (
      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
        {new Date(info.getValue()).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    header: "ACTIONS",
    id: "actions",
    cell: (info) => {
      const enquiry = info.row.original;
      return (
        <div className="flex justify-end items-center px-2">
          <CustomTooltip color="danger" content="Delete permanently">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              className="hover:bg-danger/10"
              onPress={() => onDelete(enquiry)}
            >
              <Trash2 size={18} />
            </Button>
          </CustomTooltip>
        </div>
      );
    },
    meta: { align: "end" },
  },
];
