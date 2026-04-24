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
  ArrowLeft,
  Clock,
  Loader2,
  MapPin,
  Home,
  School,
  Briefcase,
  Users as UsersIcon,
  MapPinned,
  MailboxIcon,
  ChevronDown,
  UserPen,
  BookOpen,
  Download,
  Lock,
  FileDown,
} from "lucide-react";
import { generateStudentPdf } from "@/lib/pdf/generateStudentPdf";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import DeactivateConfirmModal from "@/components/admin/DeactivateConfirmModal";
import { useSession, signOut } from "next-auth/react";
import { canManageUser } from "@/lib/permissions";
import { calculateAge } from "@/lib/utils";

const DetailItem = ({ icon: Icon, label, value, color = "primary" }) => (
  <div className="space-y-1.5 group">
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

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [pendingStatus, setPendingStatus] = React.useState(null);
  const [isPdfLoading, setIsPdfLoading] = React.useState(false);

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      await generateStudentPdf(user);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const { data: session } = useSession();
  const currentUser = session?.user;

  const { data: user, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await axios.get(`/api/students/${id}`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (confirm("Are you sure you want to delete this student?")) {
        await axios.delete(`/api/students/${id}`);
      }
    },
    onSuccess: () => {
      router.push("/admin/students");
    },
  });

  const handleStatusChange = (newStatus) => {
    if (
      newStatus === "Inactive" &&
      (currentUser?._id || currentUser?.id)?.toString() === user._id?.toString()
    ) {
      setPendingStatus(newStatus);
      onOpen();
    } else {
      statusMutation.mutate({ id: user._id, status: newStatus });
    }
  };

  const confirmDeactivation = () => {
    if (pendingStatus) {
      statusMutation.mutate({ id: user._id, status: pendingStatus });
      setPendingStatus(null);
    }
  };

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await axios.patch(`/api/students/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      addToast({
        title: "Success",
        description: "Status updated successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update status",
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
        <h2 className="text-2xl font-bold">Student Not Found</h2>
        <Button
          onPress={() => router.push("/admin/students")}
          color="primary"
          variant="flat"
          className="mt-4 font-bold"
        >
          Back to Students
        </Button>
      </div>
    );
  }

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
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="light"
          onPress={() => router.push("/admin/students")}
          startContent={<ArrowLeft size={18} />}
          className="flex font-bold text-slate-500 hover:text-primary pl-0"
        >
          Back to list
        </Button>
        <div className="flex items-center gap-3">
          <Button
            color="secondary"
            variant="flat"
            startContent={
              isPdfLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileDown size={16} />
              )
            }
            onPress={handleDownloadPdf}
            isDisabled={isPdfLoading}
            className="font-bold self-start md:self-auto shadow-sm"
          >
            PDF
          </Button>
          {canManageUser(currentUser, user, "edit") && (
            <Button
              as={Link}
              href={`/admin/students/${id}/edit`}
              color="primary"
              startContent={<UserPen size={18} />}
              className="font-bold shadow-lg shadow-primary/20"
              radius="xl"
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden mosque-arch-card">
            <CardBody className="relative z-10 flex flex-col items-center text-center p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12"></div>

              <Avatar
                src={user.image}
                name={user.name}
                className="w-40 h-40 text-4xl font-black mb-6 shadow-xl border-4 border-white dark:border-slate-800"
                radius="3xl"
                color="primary"
              />

              <h1 className="text-2xl font-black text-slate-900 dark:text-white capitalize tracking-tight">
                {user.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {user.studentId || "—"}
              </p>

              <div className="flex flex-col gap-3 mt-8 w-full">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Role
                  </span>
                  <Chip
                    startContent={<ShieldCheck size={14} />}
                    variant="flat"
                    color="primary"
                    className="capitalize font-black text-xs tracking-wider"
                    size="sm"
                  >
                    Student
                  </Chip>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Status
                  </span>
                  {canManageUser(currentUser, user, "status") ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <Chip
                          as="button"
                          variant="flat"
                          color={statusColors[user.status]}
                          className="capitalize font-black text-xs tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
                          size="sm"
                          endContent={
                            <ChevronDown
                              size={12}
                              className="ml-1 opacity-70"
                            />
                          }
                        >
                          {user.status}
                        </Chip>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Status actions"
                        onAction={(key) => handleStatusChange(key)}
                      >
                        {(() => {
                          let availableStatuses = [];
                          if (user.status === "Pending") {
                            availableStatuses = ["Active", "Inactive"];
                          } else if (user.status === "Active") {
                            availableStatuses = ["Inactive"];
                          } else if (user.status === "Inactive") {
                            availableStatuses = ["Active"];
                          }
                          return availableStatuses.map((s) => (
                            <DropdownItem
                              key={s}
                              className="text-xs font-bold"
                              color={statusColors[s]}
                            >
                              Set to {s}
                            </DropdownItem>
                          ));
                        })()}
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <Chip
                      variant="flat"
                      color={statusColors[user.status]}
                      className="capitalize font-black text-xs tracking-wider"
                      size="sm"
                    >
                      {user.status}
                    </Chip>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-primary/5 dark:bg-primary/10 border-primary/10 shadow-sm rounded-3xl border">
            <CardBody className="p-6 space-y-6">
              <DetailItem
                icon={Clock}
                label="Registered On"
                value={formatDate(user.createdAt)}
              />
              {user.date_of_admission && (
                <DetailItem
                  icon={Calendar}
                  label="Admission Date"
                  value={formatDate(user.date_of_admission)}
                />
              )}
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-visible">
            <CardBody className="p-8">
              <SectionHeader title="Student Details" icon={UsersIcon} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DetailItem
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                />
                <DetailItem
                  icon={Phone}
                  label="Phone Number"
                  value={user.phone}
                />
                <DetailItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(user.dob)}
                />
                {user.dob && (
                  <DetailItem
                    icon={Clock}
                    label="Age"
                    value={`${calculateAge(user.dob)} years`}
                  />
                )}
                <DetailItem
                  icon={UsersIcon}
                  label="Father's Name"
                  value={user.father_name}
                />
                <DetailItem
                  icon={Lock}
                  label="Aadhar Number"
                  value={user.aadhar_number}
                />
                <DetailItem
                  icon={Clock}
                  label="Identification Mark"
                  value={user.identification_mark}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8">
              <SectionHeader title="Academic Information" icon={School} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DetailItem
                  icon={School}
                  label="Madrasa Class"
                  value={user.current_madrasa_class}
                />
                <DetailItem
                  icon={BookOpen}
                  label="School Class"
                  value={user.current_school_class}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
            <CardBody className="p-8">
              <SectionHeader title="Guardian Details" icon={Briefcase} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DetailItem
                  icon={UsersIcon}
                  label="Guardian Name"
                  value={user.guardian_name}
                />
                <DetailItem
                  icon={Phone}
                  label="Guardian Phone"
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

          {(user.address || user.district) && (
            <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
              <CardBody className="p-8">
                <SectionHeader title="Address & Location" icon={MapPin} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <DetailItem
                      icon={Home}
                      label="House Name"
                      value={user.house_name}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <DetailItem
                      icon={MapPin}
                      label="Full Address"
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
          )}
        </div>
      </div>

      <DeactivateConfirmModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onConfirm={confirmDeactivation}
      />
    </div>
  );
}
