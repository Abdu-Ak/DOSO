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

const RecentUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["recent-users"],
    queryFn: async () => {
      const resp = await axios.get("/api/users?limit=5");
      return resp.data;
    },
  });

  const columns = React.useMemo(
    () => [
      {
        header: "User",
        accessorKey: "name",
        cell: (info) => (
          <UserUI
            avatarProps={{
              radius: "lg",
              src: info.row.original.image,
              fallback: info.getValue()?.charAt(0),
            }}
            description={info.row.original.email}
            name={info.getValue()}
          />
        ),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: (info) => (
          <Chip
            className="capitalize font-black text-[10px] tracking-wider"
            color="primary"
            size="sm"
            variant="flat"
          >
            {info.getValue()}
          </Chip>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            Active: "success",
            Pending: "warning",
            Inactive: "danger",
          };
          return (
            <Chip
              className="capitalize font-black text-[10px] tracking-wider"
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
              href={`/admin/users/${info.row.original._id}`}
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
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Recent Registered Users
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Overview of the latest users who joined the platform.
        </p>
      </div>

      <DataTable
        data={data?.users || []}
        columns={columns}
        isLoading={isLoading}
        topContent={
          <Link
            href="/admin/users"
            className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
          >
            View All Users <ArrowUpRight size={16} />
          </Link>
        }
      />
    </div>
  );
};

export default RecentUsers;
