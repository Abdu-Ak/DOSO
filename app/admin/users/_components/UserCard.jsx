"use client";

import React from "react";
import Link from "next/link";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Trash2,
  Eye,
  UserPen,
  UserCheck,
  UserX,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

const statusColors = {
  Active: "success",
  Pending: "warning",
  Inactive: "danger",
};

const UserCard = ({
  user,
  currentUser,
  canManageUser,
  onStatusChange,
  onDelete,
  onApprove,
  onReject,
  approvePending,
}) => {
  const showActions = canManageUser(currentUser, user);
  const showStatus = canManageUser(currentUser, user, "status");
  const isPendingPublic = user.status === "Pending" && user.source === "public";

  let availableStatuses = [];
  if (user.status === "Pending") availableStatuses = ["Active", "Inactive"];
  else if (user.status === "Active") availableStatuses = ["Inactive"];
  else if (user.status === "Inactive") availableStatuses = ["Active"];

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
      {/* Top: Avatar + Name + Chips */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-lg">
              {user.name?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.userId}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Chip
              className="capitalize font-black text-xs tracking-wider"
              color="primary"
              size="sm"
              variant="flat"
            >
              {user.role}
            </Chip>
            <Chip
              className="capitalize font-black text-xs tracking-wider"
              color={user.source === "public" ? "secondary" : "default"}
              size="sm"
              variant="flat"
            >
              {user.source || "admin"}
            </Chip>
            {showStatus && availableStatuses.length > 0 ? (
              <Dropdown>
                <DropdownTrigger>
                  <Chip
                    as="button"
                    className="capitalize font-black text-xs tracking-wider cursor-pointer"
                    color={statusColors[user.status] || "default"}
                    size="sm"
                    variant="flat"
                    endContent={<ChevronDown size={10} className="ml-0.5" />}
                  >
                    {user.status}
                  </Chip>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Status actions"
                  onAction={(key) => onStatusChange(user._id, key)}
                >
                  {availableStatuses.map((s) => (
                    <DropdownItem
                      key={s}
                      className="text-xs font-bold"
                      color={statusColors[s]}
                    >
                      Set to {s}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Chip
                className="capitalize font-black text-xs tracking-wider"
                color={statusColors[user.status] || "default"}
                size="sm"
                variant="flat"
              >
                {user.status}
              </Chip>
            )}
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Mail size={12} className="shrink-0 text-slate-400" />
          <span className="truncate">{user.email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} className="shrink-0 text-slate-400" />
          <span>{user.phone || "N/A"}</span>
        </div>
        {user.district && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span>{user.district}</span>
          </div>
        )}
        {user.batch && (
          <div className="flex items-center gap-2">
            <GraduationCap size={12} className="shrink-0 text-slate-400" />
            <span>Batch: {user.batch}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={12} className="shrink-0 text-slate-400" />
          <span>
            Created:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
            {user.date_of_admission && (
              <span className="text-primary font-medium ml-2">
                Adm: {new Date(user.date_of_admission).toLocaleDateString()}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {isPendingPublic && (
            <>
              <Button
                size="sm"
                color="success"
                variant="flat"
                className="font-bold flex-1 text-xs"
                startContent={<UserCheck size={14} />}
                isLoading={approvePending}
                onPress={() => onApprove(user._id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="font-bold flex-1 text-xs"
                startContent={<UserX size={14} />}
                onPress={() => onReject(user)}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            isIconOnly
            as={Link}
            href={`/admin/users/${user._id}`}
            size="sm"
            variant="light"
            className="text-slate-400 hover:text-primary"
          >
            <Eye size={16} />
          </Button>
          <Button
            isIconOnly
            as={Link}
            href={`/admin/users/${user._id}/edit`}
            size="sm"
            variant="light"
            className="text-slate-400 hover:text-primary"
          >
            <UserPen size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-slate-400 hover:text-danger"
            onPress={() => onDelete(user)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
