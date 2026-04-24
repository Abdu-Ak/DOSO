"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Search, Loader2, Inbox } from "lucide-react";
import UserFilters from "./UserFilters";
import UserCard from "./UserCard";

const MobileUserList = ({
  users,
  isLoading,
  currentUser,
  canManageUser,
  searchTerm,
  onSearchChange,
  filters,
  pagination,
  onStatusChange,
  onDelete,
  onApprove,
  onReject,
  approvePending,
}) => {
  return (
    <div className="lg:hidden space-y-4">
      <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <UserFilters
          {...filters}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm font-medium text-slate-400">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
          <p className="text-slate-400 font-medium">No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
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

      {pagination.total > 1 && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <span className="text-xs text-slate-500 font-bold">
            Showing {users.length} of {pagination.totalItems} users
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={pagination.page}
            total={pagination.total}
            onChange={pagination.onChange}
            radius="lg"
          />
        </div>
      )}
    </div>
  );
};

export default MobileUserList;
