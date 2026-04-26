"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/lib/hooks";
import axios from "axios";
import { Wallet, Plus, History, Box, Loader2 } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/modal";

import DebtRequestForm from "./_components/DebtRequestForm";
import AlumniDebtTable from "./_components/AlumniDebtTable";
import AlumniDebtMobileList from "./_components/AlumniDebtMobileList";
import AlumniDebtFilters from "./_components/AlumniDebtFilters";
import WitnessActionModal from "./_components/WitnessActionModal";

export default function AlumniDebtPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const currentUserId = session?.user?.id;

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  // Witness Modal State
  const {
    isOpen: isWitnessModalOpen,
    onOpen: openWitnessModal,
    onOpenChange: onWitnessModalChange,
  } = useDisclosure();

  const [witnessActionData, setWitnessActionData] = useState({
    recordId: null,
    status: null,
    reason: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["debt-requests", debouncedSearchTerm, fromDate, toDate],
    queryFn: async () => {
      const response = await axios.get("/api/debt-requests", {
        params: {
          search: debouncedSearchTerm,
          fromDate,
          toDate,
        },
      });
      return response.data;
    },
  });

  const records = data?.records || [];

  const witnessMutation = useMutation({
    mutationFn: async ({ id, status, reason }) => {
      const res = await axios.patch(`/api/debt-requests/${id}/witness`, {
        status,
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt-requests"] });
      addToast({
        title: "Success",
        description: "Response submitted successfully",
        color: "success",
      });
      onWitnessModalChange(false);
      setWitnessActionData({ recordId: null, status: null, reason: "" });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit response",
        color: "danger",
      });
    },
  });

  const handleOpenWitnessModal = (id, status) => {
    setWitnessActionData({ recordId: id, status, reason: "" });
    openWitnessModal();
  };

  const handleWitnessConfirm = () => {
    witnessMutation.mutate({
      id: witnessActionData.recordId,
      status: witnessActionData.status,
      reason: witnessActionData.reason,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Wallet className="text-primary" />
            Debt Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Request loans, track your repayments, and verify as a witness for
            others.
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onClick={() => setIsCreateModalOpen(true)}
          className="font-black shadow-lg shadow-primary/20 shrink-0"
        >
          Request Debt
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden mt-8">
        <CardHeader className="px-6 md:px-8 pt-8 pb-4 flex flex-col items-start gap-4 border-b border-slate-100 dark:border-slate-800/50">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 w-full">
            <History size={20} className="text-primary" />
            My Debt/Witness History
          </h2>

          <div className="w-full">
            <AlumniDebtFilters
              search={search}
              setSearch={setSearch}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
            />
          </div>
        </CardHeader>

        <CardBody className="px-5 md:px-8 py-8">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Loading History...
              </p>
            </div>
          ) : records.length > 0 ? (
            <>
              <div className="hidden md:block">
                <AlumniDebtTable
                  records={records}
                  isLoading={isLoading}
                  currentUserId={currentUserId}
                  onWitnessAction={handleOpenWitnessModal}
                  witnessMutation={witnessMutation}
                />
              </div>

              <div className="md:hidden">
                <AlumniDebtMobileList
                  records={records}
                  isLoading={isLoading}
                  currentUserId={currentUserId}
                  onWitnessAction={handleOpenWitnessModal}
                  witnessMutation={witnessMutation}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Box size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-400">
                No debt records found
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                You haven't requested any loans or served as a witness yet.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <DebtRequestForm
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <WitnessActionModal
        isOpen={isWitnessModalOpen}
        onOpenChange={onWitnessModalChange}
        actionData={witnessActionData}
        setActionData={setWitnessActionData}
        onConfirm={handleWitnessConfirm}
        isLoading={witnessMutation.isPending}
      />
    </div>
  );
}
