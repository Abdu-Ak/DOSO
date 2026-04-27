"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDisclosure } from "@heroui/modal";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { useDebounce } from "@/lib/hooks";

import DataTable from "@/components/admin/ui/DataTable";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";
import ReportModal from "@/components/admin/ReportModal";

import DebtHeader from "./_components/DebtHeader";
import DebtFilters from "./_components/DebtFilters";
import { getDebtColumns } from "./_components/DebtTableColumns";
import MobileDebtList from "./_components/MobileDebtList";
import ApproveDebtModal from "./_components/ApproveDebtModal";
import RejectDebtModal from "./_components/RejectDebtModal";
import CreateDebtRecordModal from "./_components/CreateDebtRecordModal";

export default function AdminDebtPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRepaidOpen, setIsRepaidOpen] = useState(false);
  const [recordForRepaid, setRecordForRepaid] = useState(null);

  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onOpenChange: onApproveOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
  } = useDisclosure();

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-debt-requests",
      page,
      debouncedSearchTerm,
      statusFilter,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/debt-requests", {
        params: {
          page,
          limit: 10,
          status: statusFilter,
          fromDate,
          toDate,
          search: debouncedSearchTerm,
        },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const { data: alumniData } = useQuery({
    queryKey: ["admin-alumni-list"],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: { role: "alumni", limit: 1000 },
      });
      return response.data;
    },
  });

  const alumniList = alumniData?.users || [];

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, receipt_no, reason }) => {
      const response = await axios.patch(`/api/debt-requests/${id}/admin`, {
        status,
        receipt_no,
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-debt-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      addToast({
        title: "Success",
        description: "Status updated successfully",
        color: "success",
      });
      setReceiptNumber("");
      setRejectionReason("");
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update status",
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/debt-requests/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-debt-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      addToast({
        title: "Deleted",
        description: "Record deleted successfully",
        color: "success",
      });
      setIsDeleteOpen(false);
      setRecordToDelete(null);
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete record",
        color: "danger",
      });
    },
  });

  const createRecordMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/debt-requests", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-debt-requests"] });
      addToast({
        title: "Success",
        description: "Debt record created and approved",
        color: "success",
      });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create record",
        color: "danger",
      });
    },
  });

  const handleApprove = () => {
    statusMutation.mutate({
      id: selectedRecord._id,
      status: "approved",
      receipt_no: receiptNumber,
    });
    onApproveOpenChange(false);
  };

  const handleReject = () => {
    statusMutation.mutate({
      id: selectedRecord._id,
      status: "rejected",
      reason: rejectionReason,
    });
    onRejectOpenChange(false);
  };

  const handleRepaid = (record) => {
    setRecordForRepaid(record);
    setIsRepaidOpen(true);
  };

  const confirmRepaid = () => {
    statusMutation.mutate({
      id: recordForRepaid._id,
      status: "repaid",
      receipt_no: recordForRepaid.receipt_no,
    });
    setIsRepaidOpen(false);
    setRecordForRepaid(null);
  };

  const debtColumns = useMemo(
    () =>
      getDebtColumns({
        onApprove: (r) => {
          setSelectedRecord(r);
          onApproveOpen();
        },
        onReject: (r) => {
          setSelectedRecord(r);
          onRejectOpen();
        },
        onDelete: (r) => {
          setRecordToDelete(r);
          setIsDeleteOpen(true);
        },
        onRepaid: handleRepaid,
      }),
    [onApproveOpen, onRejectOpen, handleRepaid],
  );

  const records = data?.records || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <DebtHeader
        showReportButton={
          currentUser?.role === "admin" || currentUser?.role === "super_admin"
        }
        onReportClick={() => setIsReportModalOpen(true)}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <DebtFilters
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          status={statusFilter}
          setStatus={setStatusFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          setPage={setPage}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      <div className="hidden lg:block">
        <DataTable
          data={records}
          columns={debtColumns}
          isLoading={isLoading}
          pagination={{
            page,
            total: totalPages,
            onChange: setPage,
            totalItems,
            label: `Showing ${records.length} of ${totalItems} records`,
          }}
          topContent={
            <DebtFilters
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setPage(1);
              }}
              status={statusFilter}
              setStatus={setStatusFilter}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              setPage={setPage}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              onCreateClick={() => setIsCreateModalOpen(true)}
            />
          }
        />
      </div>

      <div className="lg:hidden space-y-4">
        <MobileDebtList
          records={records}
          isLoading={isLoading}
          onApprove={(r) => {
            setSelectedRecord(r);
            onApproveOpen();
          }}
          onReject={(r) => {
            setSelectedRecord(r);
            onRejectOpen();
          }}
          onDelete={(r) => {
            setRecordToDelete(r);
            setIsDeleteOpen(true);
          }}
        />
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <DataTable
              data={[]}
              columns={[]}
              pagination={{ page, total: totalPages, onChange: setPage }}
            />
          </div>
        )}
      </div>

      <ApproveDebtModal
        isOpen={isApproveOpen}
        onOpenChange={onApproveOpenChange}
        record={selectedRecord}
        receiptNumber={receiptNumber}
        setReceiptNumber={setReceiptNumber}
        onApprove={handleApprove}
        isLoading={statusMutation.isPending}
      />

      <RejectDebtModal
        isOpen={isRejectOpen}
        onOpenChange={onRejectOpenChange}
        record={selectedRecord}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onReject={handleReject}
        isLoading={statusMutation.isPending}
      />

      <ConfirmModal
        isOpen={isRepaidOpen}
        onClose={() => {
          setIsRepaidOpen(false);
          setRecordForRepaid(null);
        }}
        onConfirm={confirmRepaid}
        isLoading={statusMutation.isPending}
        title="Mark as Repaid"
        confirmText="Confirm"
        btnColor="success"
        message={
          <>
            <p>
              Are you sure you want to mark the debt record for{" "}
              <strong>{recordForRepaid?.requester?.name}</strong> as settled?
            </p>
            <p className="mt-1 font-medium text-primary">
              This action will mark the debt as fully repaid.
            </p>
          </>
        }
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRecordToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(recordToDelete?._id)}
        isLoading={deleteMutation.isPending}
        title="Delete Debt Record"
        confirmText="Delete"
        message={
          <>
            <p>
              Are you sure you want to delete the Debt record for{" "}
              <strong>{recordToDelete?.requester?.name}</strong>?
            </p>
            <p className="mt-1 font-medium text-danger">
              This action cannot be undone.
            </p>
          </>
        }
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        filters={{
          search: debouncedSearchTerm,
          status: statusFilter,
          fromDate,
          toDate,
        }}
        currentUser={currentUser}
        moduleType="debt"
      />

      <CreateDebtRecordModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        alumniList={alumniList}
        onSubmit={(data) => createRecordMutation.mutate(data)}
        isLoading={createRecordMutation.isPending}
      />
    </div>
  );
}
