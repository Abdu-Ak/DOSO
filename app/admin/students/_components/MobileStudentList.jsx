"use client";

import React from "react";
import { Pagination } from "@heroui/pagination";
import { Loader2 } from "lucide-react";
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
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">
          No students found
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
