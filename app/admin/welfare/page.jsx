"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDebounce } from "@/lib/hooks";

import DataTable from "@/components/admin/ui/DataTable";
import WelfareHeader from "./_components/WelfareHeader";
import WelfareFilters from "./_components/WelfareFilters";
import { getWelfareColumns } from "./_components/WelfareTableColumns";
import MobileWelfareList from "./_components/MobileWelfareList";

// Standalone Modals
import ApproveModal from "./_components/ApproveModal";
import RejectModal from "./_components/RejectModal";
import CreateRecordModal from "./_components/CreateRecordModal";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";

export default function AdminWelfarePage() {
  const queryClient = useQueryClient();
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
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  // For Admin Creation Form
  const [newRecordData, setNewRecordData] = useState({
    alumni: "",
    amount: "",
    description: "",
    receipt_number: "",
  });

  const { data: alumniData } = useQuery({
    queryKey: ["users", "alumni-list"],
    queryFn: async () => {
      const response = await axios.get("/api/users", {
        params: { role: "alumni", limit: 100 },
      });
      return response.data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "welfare",
      "all",
      page,
      debouncedSearchTerm,
      statusFilter,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/welfare", {
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

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, receipt_number, rejection_reason }) => {
      const response = await axios.patch(`/api/welfare/${id}/status`, {
        status,
        receipt_number,
        rejection_reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["welfare"] });
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

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/welfare", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["welfare"] });
      addToast({
        title: "Success",
        description: "Welfare record created successfully",
        color: "success",
      });
      onCreateOpenChange(false);
      setNewRecordData({
        alumni: "",
        amount: "",
        description: "",
        receipt_number: "",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create record",
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/welfare/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["welfare"] });
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

  const handleApprove = () => {
    statusMutation.mutate({
      id: selectedRecord._id,
      status: "approved",
      receipt_number: receiptNumber,
    });
    onApproveOpenChange(false);
  };

  const handleReject = () => {
    statusMutation.mutate({
      id: selectedRecord._id,
      status: "rejected",
      rejection_reason: rejectionReason,
    });
    onRejectOpenChange(false);
  };

  const onSubmitCreate = () => {
    createMutation.mutate({
      alumni: newRecordData.alumni,
      amount: parseFloat(newRecordData.amount),
      description: newRecordData.description,
      receipt_number: newRecordData.receipt_number,
    });
  };

  const handleCreateOpenChange = (isOpen) => {
    onCreateOpenChange(isOpen);
    if (!isOpen) {
      setNewRecordData({
        alumni: "",
        amount: "",
        description: "",
        receipt_number: "",
      });
    }
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  const welfareColumns = useMemo(
    () =>
      getWelfareColumns({
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
      }),
    [onApproveOpen, onRejectOpen],
  );

  const records = data?.records || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <WelfareHeader />

      <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4">
        <WelfareFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          setPage={setPage}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onCreateOpen={onCreateOpen}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <DataTable
          data={records}
          columns={welfareColumns}
          isLoading={isLoading}
          pagination={{
            page,
            total: totalPages,
            onChange: setPage,
            totalItems,
            label: `Showing ${records.length} of ${totalItems} records`,
          }}
          topContent={
            <WelfareFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              status={statusFilter}
              setStatus={setStatusFilter}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              setPage={setPage}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              onCreateOpen={onCreateOpen}
            />
          }
        />
      </div>

      {/* Mobile List */}
      <div className="lg:hidden space-y-4">
        <MobileWelfareList
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

      {/* Standalone Modals */}
      <ApproveModal
        isOpen={isApproveOpen}
        onOpenChange={onApproveOpenChange}
        record={selectedRecord}
        receiptNumber={receiptNumber}
        setReceiptNumber={setReceiptNumber}
        onApprove={handleApprove}
        isLoading={statusMutation.isPending}
      />

      <RejectModal
        isOpen={isRejectOpen}
        onOpenChange={onRejectOpenChange}
        record={selectedRecord}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onReject={handleReject}
        isLoading={statusMutation.isPending}
      />

      <CreateRecordModal
        isOpen={isCreateOpen}
        onOpenChange={handleCreateOpenChange}
        alumniList={alumniData?.users}
        formData={newRecordData}
        setFormData={setNewRecordData}
        onSubmit={onSubmitCreate}
        isLoading={createMutation.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setRecordToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(recordToDelete?._id)}
        isLoading={deleteMutation.isPending}
        title="Delete Record"
        confirmText="Delete"
        message={
          <>
            <p>
              Are you sure you want to delete the Welfare record for{" "}
              <strong>{recordToDelete?.alumni?.name}</strong>?
            </p>
            <p className="mt-1">This action cannot be undone.</p>
          </>
        }
      />
    </div>
  );
}
