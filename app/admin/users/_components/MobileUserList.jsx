"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Search, Loader2 } from "lucide-react";
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
      <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
        <Input
          isClearable
          className="w-full"
          placeholder="Search by name, email or user ID..."
          startContent={<Search size={18} className="text-slate-400" />}
          value={searchTerm}
          onClear={() => onSearchChange("")}
          onValueChange={onSearchChange}
          variant="bordered"
          radius="lg"
        />
        <UserFilters {...filters} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400">
          No users found
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
