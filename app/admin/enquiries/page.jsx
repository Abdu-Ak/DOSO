"use client";

import React, { useState, useMemo } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useEnquiries } from "./_hooks/useEnquiries";
import DataTable from "@/components/admin/ui/DataTable";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";
import MobileEnquiryList from "./_components/MobileEnquiryList";
import EnquiryFilters from "./_components/EnquiryFilters";
import { getEnquiryColumns } from "./_components/EnquiryTableColumns";

export default function EnquiriesPage() {
  const { enquiries, isLoading, updateStatusMutation, deleteMutation } =
    useEnquiries();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Search filter (name or phone)
      const matchesSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.includes(searchTerm);

      // Status filter
      const matchesStatus = !statusFilter || item.status === statusFilter;

      // Date range filter
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      const matchesDate =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [enquiries, searchTerm, statusFilter, startDate, endDate]);

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const enquiryColumns = useMemo(
    () =>
      getEnquiryColumns({
        onStatusChange: handleStatusChange,
        onDelete: (enquiry) => {
          setEnquiryToDelete(enquiry);
          setIsDeleteModalOpen(true);
        },
      }),
    [updateStatusMutation],
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-body! font-bold text-slate-900 dark:text-white tracking-tight">
            Enquiries List
          </h2>
          <p className="text-slate-500 text-sm dark:text-slate-400 mt-1">
            Manage student and admissions inquiries efficiently
          </p>
        </div>
      </div>

      <div className="lg:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4">
        <EnquiryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          status={statusFilter}
          setStatus={setStatusFilter}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>

      {/* Main Content Table - Desktop */}
      <div className="hidden lg:block">
        <DataTable
          data={filteredEnquiries}
          columns={enquiryColumns}
          isLoading={isLoading}
          emptyContent="No inquiries matches the criteria."
          topContent={
            <EnquiryFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              status={statusFilter}
              setStatus={setStatusFilter}
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClearFilters={handleClearFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          }
        />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileEnquiryList
          enquiries={filteredEnquiries}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onDelete={(enquiry) => {
            setEnquiryToDelete(enquiry);
            setIsDeleteModalOpen(true);
          }}
        />
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEnquiryToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(enquiryToDelete?._id)}
        isLoading={deleteMutation.isPending}
        title="Delete Enquiry"
        message={
          <>
            <p>
              Are you sure you want to delete the enquiry from &quot;
              {enquiryToDelete?.name}&quot;?
            </p>
            <p className="mt-1">This action cannot be undone.</p>
          </>
        }
      />
    </div>
  );
}
