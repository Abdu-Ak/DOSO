"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import { canManageUser } from "@/lib/permissions";
import { useDebounce } from "@/lib/hooks";

import DeactivateConfirmModal from "@/components/admin/DeactivateConfirmModal";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";
import DataTable from "@/components/admin/ui/DataTable";
import UserHeader from "./_components/UserHeader";
import UserFilters from "./_components/UserFilters";
import MobileUserList from "./_components/MobileUserList";
import RejectModal from "./_components/RejectModal";
import { getUserColumns } from "./_components/UserTableColumns";
import { useUserMutations } from "./_hooks/useUserMutations";

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [rejectModalUser, setRejectModalUser] = useState(null);
  const [pendingDeactivation, setPendingDeactivation] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { deleteMutation, statusMutation, approveMutation, rejectMutation } =
    useUserMutations(currentUser);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, debouncedSearchTerm, role, status, district, batch],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: { page, limit, search: debouncedSearchTerm, role, status, district, batch },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const handleStatusChange = useCallback(
    (userId, newStatus) => {
      const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
      if (currentUserId === userId?.toString() && newStatus === "Inactive") {
        setPendingDeactivation({ id: userId, status: newStatus });
        onOpen();
      } else {
        statusMutation.mutate({ id: userId, status: newStatus });
      }
    },
    [currentUser, onOpen, statusMutation],
  );

  const confirmDeactivation = useCallback(() => {
    if (pendingDeactivation) {
      statusMutation.mutate(pendingDeactivation);
      setPendingDeactivation(null);
    }
  }, [pendingDeactivation, statusMutation]);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleReject = ({ id, reason }) => {
    rejectMutation.mutate({ id, reason });
    setRejectModalUser(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const userColumns = useMemo(
    () =>
      getUserColumns({
        currentUser,
        handleStatusChange,
        approveMutation,
        onReject: setRejectModalUser,
        onDelete: handleDelete,
      }),
    [currentUser, handleStatusChange, approveMutation],
  );

  const users = data?.users || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  const filterProps = {
    role, setRole,
    status, setStatus,
    district, setDistrict,
    batch, setBatch,
    setPage,
  };

  const paginationProps = {
    page,
    total: totalPages,
    onChange: setPage,
    totalItems,
    label: `Showing ${users.length} of ${totalItems} users`,
  };

  return (
    <div className="space-y-6">
      <UserHeader />

      {/* Desktop */}
      <div className="hidden lg:block">
        <DataTable
          data={users}
          columns={userColumns}
          isLoading={isLoading}
          search={{ placeholder: "Search by name, email or user ID...", value: searchTerm, onChange: handleSearch }}
          pagination={paginationProps}
          topContent={<UserFilters {...filterProps} />}
        />
      </div>

      {/* Mobile */}
      <MobileUserList
        users={users}
        isLoading={isLoading}
        currentUser={currentUser}
        canManageUser={canManageUser}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        filters={filterProps}
        pagination={paginationProps}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onApprove={(id) => approveMutation.mutate(id)}
        onReject={setRejectModalUser}
        approvePending={approveMutation.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}
        onConfirm={() => {
          deleteMutation.mutate(userToDelete?._id);
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        isLoading={deleteMutation.isPending}
        title="Delete User"
        message={
          <>
            <p>Do you want to delete the user &quot;{userToDelete?.name}&quot;?</p>
            <p className="mt-1">This process can&apos;t be undone.</p>
          </>
        }
      />

      <DeactivateConfirmModal isOpen={isOpen} onOpenChange={onOpenChange} onConfirm={confirmDeactivation} />

      <RejectModal
        user={rejectModalUser}
        onClose={() => setRejectModalUser(null)}
        onReject={handleReject}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
