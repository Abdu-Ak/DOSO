"use client";

import React from "react";
import { Pagination } from "@heroui/pagination";
import { Loader2, Inbox } from "lucide-react";
import StudentFilters from "./StudentFilters";
import StudentCard from "./StudentCard";

const MobileStudentList = ({
  students,
  isLoading,
  currentUser,
  canManageUser,
  searchTerm,
  onSearchChange,
  filterProps,
  paginationProps,
  onStatusChange,
  onDelete,
  onApprove,
  onReject,
  approvePending,
}) => {
  return (
    <div className="lg:hidden space-y-4">
      <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <StudentFilters {...filterProps} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm font-medium text-slate-400">
            Loading students...
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
          <p className="text-slate-400 font-medium">No students found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              currentUser={currentUser}
              canManageUser={canManageUser}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onApprove={onApprove}
              onReject={onReject}
              approvePending={approvePending}
            />
          ))}
        </div>
      )}

      {paginationProps?.total > 1 && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <span className="text-xs text-slate-500 font-bold">
            {paginationProps.label ||
              `Showing ${students.length} of ${paginationProps.totalItems} students`}
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={paginationProps.page}
            total={paginationProps.total}
            onChange={paginationProps.onChange}
            radius="lg"
          />
        </div>
      )}
    </div>
  );
};

export default MobileStudentList;
