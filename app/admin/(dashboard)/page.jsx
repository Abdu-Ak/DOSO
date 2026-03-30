"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { TrendingUp } from "lucide-react";
import DashboardStats from "./_components/DashboardStats";
import RecentUsers from "./_components/RecentUsers";
import PlatformActivity from "./_components/PlatformActivity";
import RecentStudents from "./_components/RecentStudents";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {session?.user?.name || "Admin"}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Here&apos;s a pulse check of Darul Hidaya Dars today.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <DashboardStats />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-6">
          <RecentUsers />
          <RecentStudents />
        </div>

        {/* Right Column (Side Content) */}
        <div className="lg:col-span-4 space-y-6">
          <PlatformActivity />
        </div>
      </div>
    </div>
  );
}
