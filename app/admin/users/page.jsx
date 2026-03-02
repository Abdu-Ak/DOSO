"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import axios from "axios";
import { addToast } from "@heroui/toast";
import {
  Search,
  Edit2,
  Trash2,
  UserPlus,
  Eye,
  Loader2,
  UserPen,
} from "lucide-react";
import { Chip } from "@heroui/chip";
import { User as UserComponent } from "@heroui/user";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import CustomTooltip from "@/components/admin/ui/CustomTooltip";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [role, setRole] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit, searchTerm, role],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: { page, limit, search: searchTerm, role },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: "Success",
        description: "User deleted successfully",
        color: "success",
      });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to delete user",
        color: "danger",
      });
    },
  });

  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <UserComponent
              avatarProps={{
                radius: "lg",
                src: user.image,
                fallback: user.name.charAt(0),
              }}
              description={`@${user.userId}`}
              name={cellValue}
            >
              {user.email}
            </UserComponent>
          );
        case "role":
          return (
            <Chip
              className="capitalize font-black text-[10px] tracking-wider"
              color="primary"
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "status":
          const statusColors = {
            Active: "success",
            Pending: "warning",
            Inactive: "danger",
          };
          return (
            <Chip
              className="capitalize font-black text-[10px] tracking-wider"
              color={statusColors[user.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "createdAt":
          return (
            <span className="text-sm font-medium text-slate-500">
              {new Date(cellValue).toLocaleDateString()}
            </span>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-2">
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
                  onClick={() => {
                    setUserToDelete(user);
                    setIsDeleteModalOpen(true);
                  }}
                  size="sm"
                  variant="light"
                  className="text-slate-400 hover:text-danger"
                >
                  <Trash2 size={18} />
                </Button>
              </CustomTooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [deleteMutation],
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 p-6 pb-2">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[400px]"
            placeholder="Search by name, email or user ID..."
            startContent={<Search size={18} className="text-slate-400" />}
            value={searchTerm}
            onClear={() => setSearchTerm("")}
            onValueChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            variant="bordered"
            radius="lg"
          />
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Select
              className="w-full sm:w-40"
              placeholder="All Roles"
              variant="bordered"
              radius="lg"
              selectedKeys={role ? [role] : []}
              onSelectionChange={(keys) => {
                setRole(Array.from(keys)[0] || "");
                setPage(1);
              }}
            >
              <SelectItem key="" value="">
                All Roles
              </SelectItem>
              <SelectItem key="admin" value="admin">
                Admin
              </SelectItem>
              <SelectItem key="alumni" value="alumni">
                Alumni
              </SelectItem>
              <SelectItem key="student" value="student">
                Student
              </SelectItem>
            </Select>
            <Button
              as={Link}
              href="/admin/users/create"
              color="primary"
              endContent={<UserPlus size={18} />}
              className="font-bold shadow-lg shadow-primary/20 w-full sm:w-auto"
              radius="lg"
            >
              Add New User
            </Button>
          </div>
        </div>
      </div>
    );
  }, [searchTerm, role]);

  const bottomContent = useMemo(() => {
    const totalPages = data?.pages || 1;
    return (
      <div className="py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-small text-slate-500 font-bold">
          Showing {data?.users?.length || 0} of {data?.total || 0} users
        </span>
        {totalPages > 1 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
            radius="lg"
          />
        )}
      </div>
    );
  }, [data, page]);

  const columns = [
    { name: "USER", uid: "name" },
    { name: "ROLE", uid: "role" },
    { name: "STATUS", uid: "status" },
    { name: "JOINED", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
          User Management
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-400">
          Manage and monitor all users across the platform.
        </p>
      </div>

      <Table
        aria-label="User Management Table"
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        classNames={{
          wrapper:
            "bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-0",
          th: "bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold text-xs uppercase tracking-wider h-14 px-6",
          td: "py-4 px-6",
        }}
        topContent={topContent}
        topContentPlacement="inside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? " " : "No users found"}
          items={data?.users || []}
          loadingContent={
            <Loader2 className="animate-spin text-primary" size={32} />
          }
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(userToDelete?._id)}
        isLoading={deleteMutation.isPending}
        message={
          <>
            <p>
              Do you want to delete the user &quot;{userToDelete?.name}&quot;?
            </p>
            <p className="mt-1">This process can&apos;t be undone.</p>
          </>
        }
      />
    </div>
  );
}
