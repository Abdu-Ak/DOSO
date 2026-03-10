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
import { Trash2, Eye, UserPen, ChevronDown, UserCheck, UserX } from "lucide-react";
import { canManageUser } from "@/lib/permissions";

const STATUS_COLORS = {
  Active: "success",
  Pending: "warning",
  Inactive: "danger",
};

export function getUserColumns({
  currentUser,
  handleStatusChange,
  approveMutation,
  onReject,
  onDelete,
}) {
  return [
    {
      header: "User",
      accessorKey: "name",
      cell: (info) => {
        const user = info.row.original;
        return (
          <UserComponent
            avatarProps={{
              radius: "lg",
              src: user.image,
              fallback: user.name.charAt(0),
            }}
            description={`@${user.userId}`}
            name={info.getValue()}
          >
            {user.email}
          </UserComponent>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => (
        <Chip
          className="capitalize font-black text-[10px] tracking-wider"
          color="primary"
          size="sm"
          variant="flat"
        >
          {info.getValue()}
        </Chip>
      ),
    },
    {
      header: "Source",
      accessorKey: "source",
      cell: (info) => {
        const value = info.getValue();
        return (
          <Chip
            className="capitalize font-black text-[10px] tracking-wider"
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
      header: "Contact",
      id: "contact",
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {user.email || "N/A"}
            </span>
            <span className="text-[10px] text-slate-500">
              {user.phone || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Admission/Joined",
      id: "dates",
      cell: (info) => {
        const user = info.row.original;
        const joined = user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A";
        const admission = user.date_of_admission
          ? new Date(user.date_of_admission).toLocaleDateString()
          : null;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Created: {joined}
            </span>
            {admission && (
              <span className="text-[10px] text-primary font-medium">
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
          {info.getValue() || "N/A"}
        </span>
      ),
    },
    {
      header: "Batch",
      accessorKey: "batch",
      cell: (info) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {info.getValue() || "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const user = info.row.original;
        const status = info.getValue();
        const showActions = canManageUser(currentUser, user, "status");

        if (!showActions) {
          return (
            <Chip
              className="capitalize font-black text-[10px] tracking-wider"
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
              className="capitalize font-black text-[10px] tracking-wider"
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
                className="capitalize font-black text-[10px] tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
                color={STATUS_COLORS[status] || "default"}
                size="sm"
                variant="flat"
                endContent={<ChevronDown size={12} className="ml-1 opacity-70" />}
              >
                {status}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status actions"
              onAction={(key) => handleStatusChange(user._id, key)}
            >
              {availableStatuses.map((s) => (
                <DropdownItem key={s} className="text-xs font-bold" color={STATUS_COLORS[s]}>
                  Set to {s}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      meta: { align: "end" },
      cell: (info) => {
        const user = info.row.original;
        const showActions = canManageUser(currentUser, user);
        const isPendingPublic = user.status === "Pending" && user.source === "public";

        return (
          <div className="relative flex items-center justify-end gap-2">
            {isPendingPublic && showActions && (
              <>
                <CustomTooltip content="Approve">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-slate-400 hover:text-green-600"
                    isLoading={approveMutation.isPending}
                    onPress={() => approveMutation.mutate(user._id)}
                  >
                    <UserCheck size={18} />
                  </Button>
                </CustomTooltip>
                <CustomTooltip content="Reject">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-slate-400 hover:text-red-600"
                    onPress={() => onReject(user)}
                  >
                    <UserX size={18} />
                  </Button>
                </CustomTooltip>
              </>
            )}
            {showActions && (
              <>
                <CustomTooltip content="View Details">
                  <Button
                    isIconOnly
                    as={Link}
                    href={`/admin/users/${user._id}`}
                    size="sm"
                    variant="light"
                    className="text-slate-400 hover:text-primary"
                  >
                    <Eye size={18} />
                  </Button>
                </CustomTooltip>
                <CustomTooltip content="Edit User">
                  <Button
                    isIconOnly
                    as={Link}
                    href={`/admin/users/${user._id}/edit`}
                    size="sm"
                    variant="light"
                    className="text-slate-400 hover:text-primary"
                  >
                    <UserPen size={18} />
                  </Button>
                </CustomTooltip>
                <CustomTooltip color="danger" content="Delete User">
                  <Button
                    isIconOnly
                    onPress={() => onDelete(user)}
                    size="sm"
                    variant="light"
                    className="text-slate-400 hover:text-danger"
                  >
                    <Trash2 size={18} />
                  </Button>
                </CustomTooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
