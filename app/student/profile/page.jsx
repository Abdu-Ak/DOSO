"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { addToast } from "@heroui/toast";
import {
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit2,
  Loader2,
  MapPin,
  Home,
  School,
  Briefcase,
  Users as UsersIcon,
  MapPinned,
  Clock,
  LayoutDashboard,
  UserPen,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { useSession } from "next-auth/react";
import UserForm from "@/components/admin/UserForm";

const DetailItem = ({ icon: Icon, label, value, color = "primary" }) => (
  <div className="space-y-1.5 group text-left">
    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2 mb-1">
      {Icon && <Icon size={12} className={`text-${color}`} />}
      {label}
    </p>
    <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight wrap-break-word min-w-0">
      {value || "—"}
    </p>
  </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
  <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
      {Icon && <Icon size={18} />}
    </div>
    {title}
  </h3>
);

export default function StudentProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id || session?.user?._id;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!user) return null;

  const statusColors = {
    Active: "success",
    Pending: "warning",
    Inactive: "danger",
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <LayoutDashboard className="text-primary" />
          My Profile
        </h1>
        <Button
          color="primary"
          startContent={<UserPen size={18} />}
          onPress={() => router.push("/student/profile/edit")}
          className="font-bold shadow-lg shadow-primary/20"
          radius="xl"
        >
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm mosque-arch-card">
            <CardBody className="flex flex-col items-center text-center p-8">
              <Avatar
                src={user.image}
                name={user.name}
                className="w-40 h-40 text-4xl font-black mb-6 shadow-xl border-4 border-white dark:border-slate-800"
                radius="3xl"
                color="primary"
              />
              <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                {user.name}
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                @{user.userId}
              </p>

              <div className="w-full mt-8 space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Status
                  </span>
                  <Chip
                    variant="flat"
                    color={statusColors[user.status]}
                    size="sm"
                    className="font-black text-xs tracking-wider uppercase"
                  >
                    {user.status}
                  </Chip>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Joined
                  </span>
                  <span className="text-xs font-bold">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8 text-left">
              <SectionHeader title="Personal Information" icon={UsersIcon} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem icon={Mail} label="Email" value={user.email} />
                <DetailItem icon={Phone} label="Phone" value={user.phone} />
                <DetailItem
                  icon={Calendar}
                  label="DOB"
                  value={formatDate(user.dob)}
                />
                <DetailItem
                  icon={UsersIcon}
                  label="Father's Name"
                  value={user.father_name}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8 text-left">
              <SectionHeader title="Academic Information" icon={School} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem
                  icon={School}
                  label="Madrasa"
                  value={user.madrasa_name}
                />
                <DetailItem
                  icon={Calendar}
                  label="Admission Date"
                  value={formatDate(user.date_of_admission)}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8 text-left">
              <SectionHeader title="Guardian Details" icon={Briefcase} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem
                  icon={UsersIcon}
                  label="Name"
                  value={user.guardian_name}
                />
                <DetailItem
                  icon={Phone}
                  label="Phone"
                  value={user.guardian_phone}
                />
                <DetailItem
                  icon={UsersIcon}
                  label="Relation"
                  value={user.guardian_relation}
                />
                <DetailItem
                  icon={Briefcase}
                  label="Occupation"
                  value={user.guardian_occupation}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8 text-left">
              <SectionHeader title="Address & Location" icon={MapPin} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <DetailItem
                    icon={Home}
                    label="House"
                    value={user.house_name}
                  />
                </div>
                <div className="md:col-span-2">
                  <DetailItem
                    icon={MapPin}
                    label="Address"
                    value={user.address}
                  />
                </div>
                <DetailItem
                  icon={MapPinned}
                  label="District"
                  value={
                    user.district === "Other"
                      ? user.custom_district
                      : user.district
                  }
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
