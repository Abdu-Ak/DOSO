"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Trash2, Eye, UserPen } from "lucide-react";
import { Chip } from "@heroui/chip";
import { User as UserComponent } from "@heroui/user";
import { Button } from "@heroui/button";
import CustomTooltip from "@/components/admin/ui/CustomTooltip";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";
import DataTable from "@/components/admin/ui/DataTable";
import UserHeader from "./_components/UserHeader";
import UserFilters from "./_components/UserFilters";
import { useDebounce } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import { canManageUser } from "@/lib/permissions";

export default function UserManagement() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [district, setDistrict] = useState("");
  const [batch, setBatch] = useState("");
  const [phone, setPhone] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "users",
      page,
      limit,
      debouncedSearchTerm,
      role,
      status,
      district,
      batch,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: {
          page,
          limit,
          search: debouncedSearchTerm,
          role,
          status,
          district,
          batch,
        },
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

  const userColumns = useMemo(
    () => [
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
          const status = info.getValue();
          const statusColors = {
            Active: "success",
            Pending: "warning",
            Inactive: "danger",
          };
          return (
            <Chip
              className="capitalize font-black text-[10px] tracking-wider"
              color={statusColors[status] || "default"}
              size="sm"
              variant="flat"
            >
              {status}
            </Chip>
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
              {showActions && (
                <>
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
                </>
              )}
            </div>
          );
        },
      },
    ],
    [currentUser],
  );

  return (
    <div className="space-y-6">
      <UserHeader />

      <DataTable
        data={data?.users || []}
        columns={userColumns}
        isLoading={isLoading}
        search={{
          placeholder: "Search by name, email or user ID...",
          value: searchTerm,
          onChange: (value) => {
            setSearchTerm(value);
            setPage(1);
          },
        }}
        pagination={{
          page: page,
          total: data?.pages || 1,
          onChange: setPage,
          totalItems: data?.total || 0,
          label: `Showing ${data?.users?.length || 0} of ${data?.total || 0} users`,
        }}
        topContent={
          <UserFilters
            role={role}
            setRole={setRole}
            status={status}
            setStatus={setStatus}
            district={district}
            setDistrict={setDistrict}
            batch={batch}
            setBatch={setBatch}
            setPage={setPage}
          />
        }
      />

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
