"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDebounce } from "@/lib/hooks";

import DataTable from "@/components/admin/ui/DataTable";
import SundookHeader from "./_components/SundookHeader";
import SundookFilters from "./_components/SundookFilters";
import { getSundookColumns } from "./_components/SundookTableColumns";
import MobileSundookList from "./_components/MobileSundookList";

// Standalone Modals
import ApproveModal from "./_components/ApproveModal";
import RejectModal from "./_components/RejectModal";
import CreateRecordModal from "./_components/CreateRecordModal";

export default function AdminSundookPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

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
    box_number: "",
    year: new Date().getFullYear().toString(),
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
      "sundook",
      "all",
      page,
      debouncedSearchTerm,
      statusFilter,
      yearFilter,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/sundook", {
        params: {
          page,
          limit: 10,
          status: statusFilter,
          year: yearFilter,
          search: debouncedSearchTerm,
        },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, receipt_number, rejection_reason }) => {
      const response = await axios.patch(`/api/sundook/${id}/status`, {
        status,
        receipt_number,
        rejection_reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sundook"] });
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

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/api/sundook", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sundook"] });
      addToast({
        title: "Success",
        description: "Sundook record created successfully",
        color: "success",
      });
      onCreateOpenChange(false);
      setNewRecordData({
        alumni: "",
        amount: "",
        box_number: "",
        year: new Date().getFullYear().toString(),
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
      box_number: parseInt(newRecordData.box_number),
      year: parseInt(newRecordData.year),
      receipt_number: newRecordData.receipt_number,
    });
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  const sundookColumns = useMemo(
    () =>
      getSundookColumns({
        onApprove: (r) => {
          setSelectedRecord(r);
          onApproveOpen();
        },
        onReject: (r) => {
          setSelectedRecord(r);
          onRejectOpen();
        },
      }),
    [onApproveOpen, onRejectOpen],
  );

  const records = data?.records || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <SundookHeader />

      <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4">
        <SundookFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
          year={yearFilter}
          setYear={setYearFilter}
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
          columns={sundookColumns}
          isLoading={isLoading}
          pagination={{
            page,
            total: totalPages,
            onChange: setPage,
            totalItems,
            label: `Showing ${records.length} of ${totalItems} records`,
          }}
          topContent={
            <SundookFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              status={statusFilter}
              setStatus={setStatusFilter}
              year={yearFilter}
              setYear={setYearFilter}
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
        <MobileSundookList
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
        onOpenChange={onCreateOpenChange}
        alumniList={alumniData?.users}
        formData={newRecordData}
        setFormData={setNewRecordData}
        onSubmit={onSubmitCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
