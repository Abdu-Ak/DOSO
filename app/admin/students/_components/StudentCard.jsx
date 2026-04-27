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
  MapPin,
  Calendar,
  School,
  BookOpen,
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

const StudentCard = ({
  student,
  currentUser,
  canManageUser,
  onStatusChange,
  onDelete,
  onApprove,
  onReject,
  approvePending,
}) => {
  const showActions = canManageUser(currentUser, student);
  const showStatus = canManageUser(currentUser, student, "status");
  const isPendingPublic =
    student.status === "Pending" && student.source === "public";

  let availableStatuses = [];
  if (student.status === "Pending") availableStatuses = ["Active", "Inactive"];
  else if (student.status === "Active") availableStatuses = ["Inactive"];
  else if (student.status === "Inactive") availableStatuses = ["Active"];

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
      {/* Top: Avatar + Name + Chips */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
          {student.image ? (
            <img
              src={student.image}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-lg">
              {student.name?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
            {student.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {student.studentId || student.phone || ""}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Chip
              className="capitalize font-black text-xs tracking-wider"
              color={student.source === "public" ? "secondary" : "default"}
              size="sm"
              variant="flat"
            >
              {student.source || "admin"}
            </Chip>
            {showStatus && availableStatuses.length > 0 ? (
              <Dropdown>
                <DropdownTrigger>
                  <Chip
                    as="button"
                    className="capitalize font-black text-xs tracking-wider cursor-pointer"
                    color={statusColors[student.status] || "default"}
                    size="sm"
                    variant="flat"
                    endContent={<ChevronDown size={10} className="ml-0.5" />}
                  >
                    {student.status}
                  </Chip>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Status actions"
                  onAction={(key) => onStatusChange(student._id, key)}
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
                color={statusColors[student.status] || "default"}
                size="sm"
                variant="flat"
              >
                {student.status}
              </Chip>
            )}
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-2 py-1">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Phone size={12} className="shrink-0" />
            <span>Phone :</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {student.phone || "N/A"}
          </span>
        </div>

        {student.current_madrasa_class && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <School size={12} className="shrink-0" />
              <span>Madrasa :</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {student.current_madrasa_class}
            </span>
          </div>
        )}

        {student.current_school_class && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen size={12} className="shrink-0" />
              <span>School :</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {student.current_school_class}
            </span>
          </div>
        )}

        {(student.district || student.custom_district) && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={12} className="shrink-0" />
              <span>District :</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {student.district === "Other"
                ? student.custom_district
                : student.district}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={12} className="shrink-0" />
            <span>Created :</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {student.createdAt
              ? new Date(student.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        {student.date_of_admission && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={12} className="shrink-0" />
              <span>Admission :</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {new Date(student.date_of_admission).toLocaleDateString()}
            </span>
          </div>
        )}
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
                onPress={() => onApprove(student._id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="font-bold flex-1 text-xs"
                startContent={<UserX size={14} />}
                onPress={() => onReject(student)}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            isIconOnly
            as={Link}
            href={`/admin/students/${student._id}`}
            size="sm"
            variant="light"
            className="text-slate-400 hover:text-primary"
          >
            <Eye size={16} />
          </Button>
          <Button
            isIconOnly
            as={Link}
            href={`/admin/students/${student._id}/edit`}
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
            onPress={() => onDelete(student)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
