"use client";

import React from "react";
import Link from "next/link";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { User as UserComponent } from "@heroui/user";
import CustomTooltip from "@/components/admin/ui/CustomTooltip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Trash2,
  Eye,
  UserPen,
  ChevronDown,
  UserCheck,
  UserX,
  MoreVertical,
} from "lucide-react";
import { canManageUser } from "@/lib/permissions";

const STATUS_COLORS = {
  Active: "success",
  Pending: "warning",
  Inactive: "danger",
};

export function getStudentColumns({
  currentUser,
  handleStatusChange,
  approveMutation,
  onReject,
  onDelete,
  basePath = "/admin/students",
}) {
  return [
    {
      header: "Student",
      accessorKey: "name",
      cell: (info) => {
        const student = info.row.original;
        const showActions = canManageUser(currentUser, student);
        const isPendingPublic =
          student.status === "Pending" && student.source === "public";

        return (
          <div className="flex items-center justify-between gap-2 group">
            <UserComponent
              avatarProps={{
                radius: "lg",
                src: student.image,
                fallback: student.name?.charAt(0),
              }}
              description={student.studentId || ""}
              name={info.getValue()}
            />
            {showActions && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreVertical size={18} className="text-slate-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Student actions" variant="flat">
                  <DropdownItem
                    key="view"
                    as={Link}
                    href={`${basePath}/${student._id}`}
                    startContent={<Eye size={16} />}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    as={Link}
                    href={`${basePath}/${student._id}/edit`}
                    startContent={<UserPen size={16} />}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Edit Student
                  </DropdownItem>
                  {isPendingPublic && (
                    <DropdownItem
                      key="approve"
                      color="success"
                      startContent={<UserCheck size={16} />}
                      onPress={() => approveMutation.mutate(student._id)}
                      className="text-success"
                    >
                      Approve Student
                    </DropdownItem>
                  )}
                  {isPendingPublic && (
                    <DropdownItem
                      key="reject"
                      color="danger"
                      startContent={<UserX size={16} />}
                      onPress={() => onReject(student)}
                      className="text-danger"
                    >
                      Reject Student
                    </DropdownItem>
                  )}
                  <DropdownItem
                    key="delete"
                    color="danger"
                    startContent={<Trash2 size={16} />}
                    onPress={() => onDelete(student)}
                    className="text-danger"
                  >
                    Delete Student
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        );
      },
    },
    {
      header: "Source",
      accessorKey: "source",
      cell: (info) => {
        const value = info.getValue();
        return (
          <Chip
            className="capitalize font-black text-xs tracking-wider"
            color={value === "public" ? "secondary" : "default"}
            size="sm"
            variant="flat"
          >
            {value || "admin"}
          </Chip>
        );
      },
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (info) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {info.getValue() || "N/A"}
        </span>
      ),
    },
    {
      header: "Admission",
      id: "admission",
      cell: (info) => {
        const student = info.row.original;
        const admission = student.date_of_admission
          ? new Date(student.date_of_admission).toLocaleDateString()
          : null;
        const created = student.createdAt
          ? new Date(student.createdAt).toLocaleDateString()
          : "N/A";
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Joined: {created}
            </span>
            {admission && (
              <span className="text-xs text-primary font-medium">
                Adm: {admission}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "District",
      accessorKey: "district",
      cell: (info) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {info.getValue() === "Other"
            ? info.row.original.custom_district
            : info.getValue() || "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const student = info.row.original;
        const status = info.getValue();
        const showActions = canManageUser(currentUser, student, "status");

        if (!showActions) {
          return (
            <Chip
              className="capitalize font-black text-xs tracking-wider"
              color={STATUS_COLORS[status] || "default"}
              size="sm"
              variant="flat"
            >
              {status}
            </Chip>
          );
        }

        let availableStatuses = [];
        if (status === "Pending") availableStatuses = ["Active", "Inactive"];
        else if (status === "Active") availableStatuses = ["Inactive"];
        else if (status === "Inactive") availableStatuses = ["Active"];

        if (availableStatuses.length === 0) {
          return (
            <Chip
              className="capitalize font-black text-xs tracking-wider"
              color={STATUS_COLORS[status] || "default"}
              size="sm"
              variant="flat"
            >
              {status}
            </Chip>
          );
        }

        return (
          <Dropdown>
            <DropdownTrigger>
              <Chip
                as="button"
                className="capitalize font-black text-xs tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
                color={STATUS_COLORS[status] || "default"}
                size="sm"
                variant="flat"
                endContent={
                  <ChevronDown size={12} className="ml-1 opacity-70" />
                }
              >
                {status}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status actions"
              onAction={(key) => handleStatusChange(student._id, key)}
            >
              {availableStatuses.map((s) => (
                <DropdownItem
                  key={s}
                  className="text-xs font-bold"
                  color={STATUS_COLORS[s]}
                >
                  Set to {s}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];
}
