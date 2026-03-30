"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { Chip } from "@heroui/chip";
import { User as UserUI } from "@heroui/user";
import { Button } from "@heroui/button";
import DataTable from "@/components/admin/ui/DataTable";

const RecentStudents = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["recent-students"],
    queryFn: async () => {
      const resp = await axios.get("/api/students?limit=5");
      return resp.data;
    },
  });

  const columns = React.useMemo(
    () => [
      {
        header: "Student",
        accessorKey: "name",
        cell: (info) => (
          <UserUI
            avatarProps={{
              radius: "lg",
              src: info.row.original.image,
              fallback: info.getValue()?.charAt(0),
            }}
            description={
              info.row.original.studentId ||
              info.row.original.phone ||
              "No details"
            }
            name={info.getValue()}
          />
        ),
      },
      {
        header: "District",
        accessorKey: "district",
        cell: (info) => (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {info.getValue() === "Other"
              ? info.row.original.custom_district
              : info.getValue()}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue() || "Pending";
          const colors = {
            Active: "success",
            Pending: "warning",
            Inactive: "danger",
          };
          return (
            <Chip
              className="capitalize font-black text-xs tracking-wider"
              color={colors[status]}
              size="sm"
              variant="flat"
            >
              {status}
            </Chip>
          );
        },
      },
      {
        header: "Actions",
        id: "actions",
        meta: { align: "end" },
        cell: (info) => (
          <div className="flex items-center justify-end">
            <Button
              isIconOnly
              as={Link}
              href={`/admin/students/${info.row.original._id}`}
              size="sm"
              variant="light"
              className="text-slate-400 hover:text-primary transition-colors"
            >
              <Eye size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 pb-2 flex flex-col md:flex-row justify-between gap-3 items-end md:items-center border-b border-slate-200 dark:border-slate-800 mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
            Recent Registered Students
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of the latest students who joined the platform.
          </p>
        </div>
        <Link
          href="/admin/students"
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          View All <ArrowUpRight size={16} />
        </Link>
      </div>

      <DataTable
        data={data?.students || []}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RecentStudents;
