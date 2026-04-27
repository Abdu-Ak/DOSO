"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users, GraduationCap, Coins, Heart, Wallet } from "lucide-react";
import StatCard from "./StatCard";
import { Chip } from "@heroui/chip";
import { formatCurrency } from "@/lib/utils";

const DashboardStats = ({ startDate, endDate }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats", startDate, endDate],
    queryFn: async () => {
      const resp = await axios.get("/api/dashboard/stats", {
        params: { startDate, endDate },
      });
      return resp.data;
    },
  });

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      bgColor: "bg-blue-50 dark:bg-blue-500/10 shadow-sm shadow-blue-500/5",
      iconColor: "text-blue-600 dark:text-blue-400",
      extra: (
        <div className="flex items-center gap-2">
          <Chip variant="flat" color="primary" className="font-bold h-7">
            Alumni: {data?.alumni || 0}
          </Chip>
          <Chip variant="flat" color="warning" className="font-bold h-7">
            Admins: {data?.admins || 0}
          </Chip>
        </div>
      ),
    },
    {
      title: "Total Students",
      value: data?.students?.toLocaleString() || "0",
      icon: GraduationCap,
      bgColor:
        "bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/5",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Sundook Total",
      value: formatCurrency(data?.sundookTotal || 0),
      icon: Coins,
      bgColor:
        "bg-purple-50 dark:bg-purple-500/10 shadow-sm shadow-purple-500/5",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Welfare Total",
      value: formatCurrency(data?.welfareTotal || 0),
      icon: Heart,
      bgColor: "bg-rose-50 dark:bg-rose-500/10 shadow-sm shadow-rose-500/5",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Debt Total",
      value: formatCurrency(data?.debtTotal || 0),
      icon: Wallet,
      bgColor: "bg-amber-50 dark:bg-amber-500/10 shadow-sm shadow-amber-500/5",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
};

export default DashboardStats;
