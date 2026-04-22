"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardStats from "./_components/DashboardStats";
import RecentUsers from "./_components/RecentUsers";
import PlatformActivity from "./_components/PlatformActivity";
import RecentStudents from "./_components/RecentStudents";
import ReportModal from "@/components/admin/ReportModal";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <DashboardHeader
        session={session}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
        onReportOpen={() => setIsReportModalOpen(true)}
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <DashboardStats startDate={startDate} endDate={endDate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <div className="lg:col-span-8 space-y-6">
          <RecentUsers />
          <RecentStudents />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PlatformActivity />
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentUser={session?.user}
        moduleType="dashboard"
        filters={{ startDate, endDate }}
      />
    </div>
  );
}
