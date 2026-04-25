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
  ScrollText,
  CheckCircle2,
  Recycle,
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
  onRenew,
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
      <div className="space-y-2 py-1">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Mail size={12} className="shrink-0" />
            <span>Email :</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
            {user.email || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Phone size={12} className="shrink-0" />
            <span>Phone :</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {user.phone || "N/A"}
          </span>
        </div>

        {user.district && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={12} className="shrink-0" />
              <span>District :</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {user.district}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <GraduationCap size={12} className="shrink-0" />
            <span>Batch :</span>
          </div>
          <span className="font-bold text-primary tracking-wider">
            {user.batch || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={12} className="shrink-0" />
            <span>Created :</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ScrollText size={12} className="shrink-0" />
            <span>Membership :</span>
          </div>
          <div>
            {user.role === "alumni" ? (
              user.membership_renewals?.some(
                (r) => r.year === new Date().getFullYear(),
              ) ? (
                <Chip
                  color="success"
                  size="sm"
                  variant="flat"
                  className="font-bold text-[10px] h-6 px-2 gap-1 rounded-md"
                  startContent={<CheckCircle2 size={10} />}
                >
                  Valid ({new Date().getFullYear()})
                </Chip>
              ) : (
                <Chip
                  as="button"
                  onClick={() => onRenew && onRenew(user)}
                  color="warning"
                  size="sm"
                  variant="flat"
                  className="font-bold text-[10px] h-6 px-2 gap-1 cursor-pointer hover:opacity-80 transition-opacity rounded-md"
                  startContent={<Recycle size={10} />}
                >
                  Renew ({new Date().getFullYear()})
                </Chip>
              )
            ) : (
              <span className="text-slate-500 font-medium">-</span>
            )}
          </div>
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
