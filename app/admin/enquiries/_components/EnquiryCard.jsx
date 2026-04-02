"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import {
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
} from "lucide-react";
import CustomTooltip from "@/components/admin/ui/CustomTooltip";

const EnquiryCard = ({
  enquiry,
  onStatusChange,
  onDelete,
  statusColorMap,
  statusIconMap,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Name and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-white capitalize">
            {enquiry.name}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <Calendar size={12} />
            {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <Dropdown>
          <DropdownTrigger>
            <div className="cursor-pointer">
              <Chip
                className="capitalize select-none"
                color={statusColorMap[enquiry.status]}
                size="sm"
                variant="flat"
                startContent={statusIconMap[enquiry.status]}
              >
                {enquiry.status}
              </Chip>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Change Status"
            onSelectionChange={(keys) => onStatusChange(enquiry._id, keys)}
            selectionMode="single"
            selectedKeys={[enquiry.status]}
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
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Phone size={14} className="text-slate-400" />
          <span>{enquiry.phone}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MessageSquare size={14} className="text-slate-400 mt-1 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {enquiry.subject}
            </span>
            <p className="text-xs mt-1 line-clamp-3">{enquiry.message}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
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
      </div>
    </div>
  );
};

export default EnquiryCard;
