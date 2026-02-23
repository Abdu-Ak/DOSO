"use client";

import React from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  UserCheck,
  UserPlus,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-xl ${color} bg-opacity-10 transition-colors`}
      >
        <Icon className={color.replace("bg-", "text-")} size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
          <TrendingUp size={14} />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
      {title}
    </h3>
    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
      {value}
    </p>
  </div>
);

export default function AdminDashboard() {
  const { data: session } = useSession();

  const stats = [
    {
      title: "Total Users",
      value: "1,284",
      icon: Users,
      trend: "+12%",
      color: "bg-blue-600",
    },
    {
      title: "Active Alumni",
      value: "856",
      icon: GraduationCap,
      trend: "+5%",
      color: "bg-emerald-600",
    },
    {
      title: "New Students",
      value: "142",
      icon: UserPlus,
      trend: "+18%",
      color: "bg-purple-600",
    },
    {
      title: "Upcoming Events",
      value: "8",
      icon: Calendar,
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {session?.user?.name || "Admin"}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Here's what's happening with Darul Hidaya Dars today.
          </p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2 w-fit">
          <TrendingUp size={18} />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <UserCheck
                    className="text-slate-600 dark:text-slate-400"
                    size={18}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    New Alumni Registration
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Ahmed Khan has registered as an Alumni.
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium mt-2 block">
                    2 hours ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary hover:bg-primary/5 transition-all group">
              <UserPlus
                className="text-primary mb-3 group-hover:scale-110 transition-transform"
                size={28}
              />
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                Add User
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-accent hover:bg-accent/5 transition-all group">
              <Calendar
                className="text-accent mb-3 group-hover:scale-110 transition-transform"
                size={28}
              />
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                New Event
              </span>
            </button>
            {/* Add more buttons as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
