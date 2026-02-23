"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { addToast } from "@heroui/toast";
import {
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit2,
  Trash2,
  ArrowLeft,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (confirm("Are you sure you want to delete this user?")) {
        await axios.delete(`/api/users/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: "Success",
        description: "User deleted successfully",
        color: "success",
      });
      router.push("/admin/users");
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to delete user",
        color: "danger",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <Button
          onPress={() => router.push("/admin/users")}
          color="primary"
          variant="flat"
          className="mt-4 font-bold"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  const statusColors = {
    Active: "success",
    Pending: "warning",
    Inactive: "danger",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="light"
          onPress={() => router.back()}
          startContent={<ArrowLeft size={18} />}
          className="font-bold text-slate-500 hover:text-primary"
        >
          Back to List
        </Button>
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            href={`/admin/users/${id}/edit`}
            color="primary"
            startContent={<Edit2 size={18} />}
            className="font-bold shadow-lg shadow-primary/20"
            radius="xl"
          >
            Edit Profile
          </Button>
          <Button
            onPress={() => deleteMutation.mutate()}
            variant="flat"
            color="danger"
            startContent={<Trash2 size={18} />}
            className="font-bold border border-red-200 dark:border-red-900/30"
            radius="xl"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="bg-surface-light dark:bg-surface-dark p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden mosque-arch-card">
          <CardBody className="relative z-10 flex flex-col items-center text-center p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <Avatar
              src={user.image}
              name={user.name}
              className="w-40 h-40 text-4xl font-black mb-6 shadow-xl"
              radius="3xl"
              isBordered
              color="primary"
            />

            <h1 className="text-2xl font-black text-slate-900 dark:text-white capitalize tracking-tight">
              {user.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">
              @{user.username}
            </p>

            <div className="flex flex-col gap-3 mt-6 w-full">
              <Chip
                startContent={<ShieldCheck size={14} />}
                variant="flat"
                color="primary"
                className="capitalize font-black text-[10px] tracking-wider w-full justify-center h-8"
              >
                {user.role}
              </Chip>

              <Chip
                variant="flat"
                color={statusColors[user.status]}
                className="capitalize font-black text-[10px] tracking-wider w-full justify-center h-8"
              >
                {user.status}
              </Chip>
            </div>
          </CardBody>
        </Card>

        {/* Details Grid */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    Email Address
                  </p>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    Phone Number
                  </p>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    Date of Birth
                  </p>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Not provided"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    Account Created
                  </p>
                  <p className="text-slate-900 dark:text-white font-bold">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-primary/5 dark:bg-primary/10 border-primary/10 shadow-sm rounded-3xl border">
            <CardBody className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Security & Access
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    This user has {user.role} privileges on the Darul Hidaya
                    Dars platform.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
