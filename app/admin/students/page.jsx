"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import axios from "axios";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import { canManageUser } from "@/lib/permissions";
import { useDebounce } from "@/lib/hooks";

import DeactivateConfirmModal from "@/components/admin/DeactivateConfirmModal";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";
import DataTable from "@/components/admin/ui/DataTable";
import StudentHeader from "./_components/StudentHeader";
import StudentFilters from "./_components/StudentFilters";
import MobileStudentList from "./_components/MobileStudentList";
import RejectModal from "../users/_components/RejectModal";
import { getStudentColumns } from "./_components/StudentTableColumns";

export default function StudentManagement() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");
  const [district, setDistrict] = useState("");
  const [madrasaClass, setMadrasaClass] = useState("");
  const [schoolClass, setSchoolClass] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [rejectModalUser, setRejectModalUser] = useState(null);
  const [pendingDeactivation, setPendingDeactivation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axios.patch(`/api/students/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      addToast({
        title: "Success",
        description: "Status updated successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update status",
        color: "danger",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`/api/students/${id}/status`, { status: "Active" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      addToast({
        title: "Success",
        description: "Student approved successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to approve student",
        color: "danger",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      await axios.patch(`/api/students/${id}/status`, {
        status: "Inactive",
        rejectionReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      addToast({
        title: "Success",
        description: "Student rejected",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to reject student",
        color: "danger",
      });
    },
  });

  const { mutate: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      addToast({
        title: "Success",
        description: "Student deleted successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete student",
        color: "danger",
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "students",
      page,
      limit,
      debouncedSearchTerm,
      status,
      district,
      madrasaClass,
      schoolClass,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/students", {
        params: {
          page,
          limit,
          search: debouncedSearchTerm,
          status,
          district,
          current_madrasa_class: madrasaClass,
          current_school_class: schoolClass,
        },
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

  const studentColumns = useMemo(
    () =>
      getStudentColumns({
        currentUser,
        handleStatusChange,
        approveMutation,
        onReject: setRejectModalUser,
        onDelete: handleDelete,
      }),
    [currentUser, handleStatusChange, approveMutation],
  );

  const students = data?.students || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  const filterProps = {
    status,
    setStatus,
    district,
    setDistrict,
    madrasaClass,
    setMadrasaClass,
    schoolClass,
    setSchoolClass,
    setPage,
    showFilters,
    setShowFilters,
    searchTerm,
    onSearchChange: handleSearch,
  };

  const paginationProps = {
    page,
    total: totalPages,
    onChange: setPage,
    totalItems,
    label: `Showing ${students.length} of ${totalItems} students`,
  };

  return (
    <div className="space-y-6">
      <StudentHeader />

      {/* Desktop */}
      <div className="hidden lg:block">
        <DataTable
          data={students}
          columns={studentColumns}
          isLoading={isLoading}
          pagination={paginationProps}
          topContent={<StudentFilters {...filterProps} />}
        />
      </div>

      {/* Mobile */}
      <MobileStudentList
        students={students}
        isLoading={isLoading}
        currentUser={currentUser}
        canManageUser={canManageUser}
        filterProps={filterProps}
        paginationProps={paginationProps}
        onStatusChange={(id, newStatus) => handleStatusChange(id, newStatus)}
        onDelete={handleDelete}
        onApprove={(id) => approveMutation.mutate(id)}
        onReject={setRejectModalUser}
        approvePending={approveMutation.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={() => {
          deleteMutate(userToDelete?._id);
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        isLoading={deleteLoading}
        title="Delete Student"
        message={
          <>
            <p>
              Do you want to delete the student &quot;{userToDelete?.name}
              &quot;?
            </p>
            <p className="mt-1">This process can&apos;t be undone.</p>
          </>
        }
      />

      <DeactivateConfirmModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={confirmDeactivation}
      />

      <RejectModal
        user={rejectModalUser}
        onClose={() => setRejectModalUser(null)}
        onReject={handleReject}
        isLoading={rejectMutation.isPending}
        type="Student"
      />
    </div>
  );
}
