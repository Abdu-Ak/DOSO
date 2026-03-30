"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Check, X, Clock, UserCheck, UserX } from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";

const NotificationsPanel = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

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

  return (
    <div className="absolute right-[-60px] xs:right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
          Pending Registrations
        </h3>
        <Chip
          size="sm"
          color="warning"
          variant="flat"
          className="font-bold text-xs"
        >
          {notifications.length}
        </Chip>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No pending registrations
          </div>
        ) : (
          notifications.map((user) => (
            <div
              key={user._id}
              className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-bold text-sm">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="capitalize text-xs font-bold"
                    >
                      {user.role}
                    </Chip>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {timeAgo(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {rejectingId === user._id ? (
                <div className="mt-3 space-y-2">
                  <Input
                    size="sm"
                    variant="bordered"
                    placeholder="Rejection reason (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    radius="sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
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
                    className="font-bold flex-1"
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
                    className="font-bold flex-1"
                    startContent={<UserX size={14} />}
                    onPress={() => setRejectingId(user._id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
