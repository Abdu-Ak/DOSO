"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users, GraduationCap, UserPlus, ShieldCheck } from "lucide-react";
import StatCard from "./StatCard";

const DashboardStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const resp = await axios.get("/api/dashboard/stats");
      return resp.data;
    },
  });

  const stats = [
    {
      title: "Total Users & Students",
      value: data?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      trend: data?.trends?.total || "+0%",
      bgColor: "bg-blue-50 dark:bg-blue-500/10 shadow-sm shadow-blue-500/5",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active alumni",
      value: data?.alumni?.toLocaleString() || "0",
      icon: GraduationCap,
      trend: data?.trends?.alumni,
      bgColor:
        "bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/5",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "New Students",
      value: data?.students?.toLocaleString() || "0",
      icon: UserPlus,
      trend: data?.trends?.student,
      bgColor:
        "bg-purple-50 dark:bg-purple-500/10 shadow-sm shadow-purple-500/5",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "System Admins",
      value: data?.admins?.toLocaleString() || "0",
      icon: ShieldCheck,
      bgColor: "bg-amber-50 dark:bg-amber-500/10 shadow-sm shadow-amber-500/5",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
};

export default DashboardStats;
