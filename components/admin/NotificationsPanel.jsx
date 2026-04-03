"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Check, X, Clock, UserCheck, UserX, Box } from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";

const NotificationsPanel = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Sundook States
  const [approvingSundookId, setApprovingSundookId] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [rejectingSundookId, setRejectingSundookId] = useState(null);
  const [sundookRejectReason, setSundookRejectReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");
      return res.data;
    },
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.post(`/api/users/${id}/approve`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: "User Approved",
        description: data.tempPassword
          ? `Temporary password: ${data.tempPassword}`
          : "User approved successfully",
        color: "success",
        timeout: 10000,
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to approve",
        color: "danger",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      await axios.post(`/api/users/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setRejectingId(null);
      setRejectReason("");
      addToast({
        title: "User Rejected",
        description: "Rejection email sent",
        color: "warning",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.response?.data?.error || "Failed to reject",
        color: "danger",
      });
    },
  });

  const sundookStatusMutation = useMutation({
    mutationFn: async ({ id, status, receipt_number, rejection_reason }) => {
      await axios.patch(`/api/sundook/${id}/status`, {
        status,
        receipt_number,
        rejection_reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["sundook"] });
      setApprovingSundookId(null);
      setRejectingSundookId(null);
      setReceiptNumber("");
      setSundookRejectReason("");
      addToast({
        title: "Success",
        description: "Sundook status updated",
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

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const notifications = data?.notifications || [];
  const sundookNotifications = data?.sundookNotifications || [];

  return (
    <div className="absolute right-[-60px] xs:right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
          Notifications
        </h3>
        <Chip
          size="sm"
          color="warning"
          variant="flat"
          className="font-black text-[10px] tracking-widest uppercase"
        >
          {notifications.length + sundookNotifications.length}
        </Chip>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400 font-bold animate-pulse">
            Loading notifications...
          </div>
        ) : notifications.length === 0 && sundookNotifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
              <Clock size={24} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              No pending actions
            </p>
          </div>
        ) : (
          <>
            {/* Sundook Notifications */}
            {sundookNotifications.map((sundook) => (
              <div
                key={sundook._id}
                className="p-4 border-b border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.04] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-primary/20">
                    {sundook.alumni?.image ? (
                      <img
                        src={sundook.alumni.image}
                        alt={sundook.alumni.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Box size={20} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {sundook.alumni?.name || "Unknown Alumni"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Chip
                        size="sm"
                        color="warning"
                        variant="flat"
                        className="text-[10px] font-black uppercase tracking-widest h-5"
                      >
                        Sundook ₹{sundook.amount}
                      </Chip>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        #{sundook.box_number} • {sundook.year}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                    {timeAgo(sundook.createdAt)}
                  </span>
                </div>

                {approvingSundookId === sundook._id ? (
                  <div className="mt-3 space-y-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-success/20 shadow-inner">
                    <Input
                      size="sm"
                      variant="bordered"
                      placeholder="Enter Receipt Number"
                      label="Receipt Number"
                      labelPlacement="outside"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      radius="md"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="success"
                        className="font-bold flex-1 text-white"
                        isLoading={sundookStatusMutation.isPending}
                        isDisabled={!receiptNumber}
                        onPress={() =>
                          sundookStatusMutation.mutate({
                            id: sundook._id,
                            status: "approved",
                            receipt_number: receiptNumber,
                          })
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        className="font-bold"
                        onPress={() => setApprovingSundookId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : rejectingSundookId === sundook._id ? (
                  <div className="mt-3 space-y-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-danger/20 shadow-inner">
                    <Input
                      size="sm"
                      variant="bordered"
                      placeholder="Reason for rejection"
                      label="Rejection Reason"
                      labelPlacement="outside"
                      value={sundookRejectReason}
                      onChange={(e) => setSundookRejectReason(e.target.value)}
                      radius="md"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="danger"
                        className="font-bold flex-1"
                        isLoading={sundookStatusMutation.isPending}
                        isDisabled={!sundookRejectReason}
                        onPress={() =>
                          sundookStatusMutation.mutate({
                            id: sundook._id,
                            status: "rejected",
                            rejection_reason: sundookRejectReason,
                          })
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        className="font-bold"
                        onPress={() => setRejectingSundookId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      className="font-black text-[10px] uppercase tracking-widest flex-1 h-9"
                      onPress={() => setApprovingSundookId(sundook._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="font-black text-[10px] uppercase tracking-widest flex-1 h-9"
                      onPress={() => setRejectingSundookId(sundook._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* User Notifications */}
            {notifications.map((user) => (
              <div
                key={user._id}
                className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary font-bold text-sm uppercase">
                        {user.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Chip
                        size="sm"
                        color="secondary"
                        variant="flat"
                        className="capitalize text-[10px] font-black tracking-widest"
                      >
                        {user.role}
                      </Chip>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={10} /> {timeAgo(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {rejectingId === user._id ? (
                  <div className="mt-3 space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                    <Input
                      size="sm"
                      variant="bordered"
                      placeholder="Rejection reason..."
                      label="Reason"
                      labelPlacement="outside"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      radius="md"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="danger"
                        variant="solid"
                        className="font-bold flex-1"
                        isLoading={rejectMutation.isPending}
                        onPress={() =>
                          rejectMutation.mutate({
                            id: user._id,
                            reason: rejectReason,
                          })
                        }
                      >
                        Confirm Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        className="font-bold"
                        onPress={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      className="font-black text-[10px] uppercase tracking-widest flex-1 h-9"
                      startContent={<UserCheck size={14} />}
                      isLoading={approveMutation.isPending}
                      onPress={() => approveMutation.mutate(user._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="font-black text-[10px] uppercase tracking-widest flex-1 h-9"
                      startContent={<UserX size={14} />}
                      onPress={() => setRejectingId(user._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
