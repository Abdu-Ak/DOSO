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
  CheckCircle2,
  Recycle,
} from "lucide-react";
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
  onRenew,
  basePath = "/admin/users",
  role,
  entityLabel = "User",
}) {
  const columns = [
    {
      header: entityLabel,
      accessorKey: "name",
      cell: (info) => {
        const user = info.row.original;
        const showActions = canManageUser(currentUser, user);
        const isPendingPublic =
          user.status === "Pending" && user.source === "public";

        return (
          <div className="flex items-center justify-between gap-2 group">
            <UserComponent
              avatarProps={{
                radius: "lg",
                src: user.image,
                fallback: user.name.charAt(0),
              }}
              description={user.userId || user.phone || ""}
              name={info.getValue()}
            >
              {user.email}
            </UserComponent>
            {showActions && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreVertical size={18} className="text-slate-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions" variant="flat">
                  <DropdownItem
                    key="view"
                    as={Link}
                    href={`${basePath}/${user._id}`}
                    startContent={<Eye size={16} />}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    View Details
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    as={Link}
                    href={`${basePath}/${user._id}/edit`}
                    startContent={<UserPen size={16} />}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Edit {entityLabel}
                  </DropdownItem>
                  {isPendingPublic && (
                    <DropdownItem
                      key="approve"
                      color="success"
                      startContent={<UserCheck size={16} />}
                      onPress={() => approveMutation.mutate(user._id)}
                      className="text-success"
                    >
                      Approve {entityLabel}
                    </DropdownItem>
                  )}
                  {isPendingPublic && (
                    <DropdownItem
                      key="reject"
                      color="danger"
                      startContent={<UserX size={16} />}
                      onPress={() => onReject(user)}
                      className="text-danger"
                    >
                      Reject {entityLabel}
                    </DropdownItem>
                  )}
                  <DropdownItem
                    key="delete"
                    color="danger"
                    startContent={<Trash2 size={16} />}
                    onPress={() => onDelete(user)}
                    className="text-danger"
                  >
                    Delete {entityLabel}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        );
      },
    },

    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => (
        <Chip
          className="capitalize font-black text-xs tracking-wider"
          color="primary"
          size="sm"
          variant="flat"
        >
          {info.getValue()}
        </Chip>
      ),
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

            <span className="text-xs text-slate-500">
              {user.phone || "N/A"}
            </span>
          </div>
        );
      },
    },

    {
      header: "Membership",
      id: "membership",
      cell: (info) => {
        const user = info.row.original;

        if (user.role !== "alumni") {
          return <span className="text-slate-500 font-medium">-</span>;
        }

        const currentYear = new Date().getFullYear();
        const renewals = user.membership_renewals || [];
        const isRenewed = renewals.some((r) => r.year === currentYear);

        if (isRenewed) {
          return (
            <Chip
              color="success"
              size="sm"
              variant="flat"
              className="font-bold text-xs rounded-md gap-1"
              startContent={<CheckCircle2 size={12} />}
            >
              Valid ({currentYear})
            </Chip>
          );
        }
        return (
          <Chip
            as="button"
            onClick={() => onRenew && onRenew(user)}
            color="warning"
            size="sm"
            variant="flat"
            className="text-xs rounded-md cursor-pointer hover:opacity-80 transition-opacity font-bold gap-1"
            startContent={<Recycle size={12} />}
          >
            Renew ({currentYear})
          </Chip>
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
              onAction={(key) => handleStatusChange(user._id, key)}
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

  return columns;
}
