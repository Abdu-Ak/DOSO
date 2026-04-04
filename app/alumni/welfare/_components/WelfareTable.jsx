"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { History, Box } from "lucide-react";
import { Chip } from "@heroui/chip";
import { CheckCircle2, AlertCircle } from "lucide-react";
import WelfareMobileList from "./WelfareMobileList";
import WelfareFilters from "./WelfareFilters";

export default function WelfareTable({
  records,
  isLoading,
  search,
  setSearch,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) {
  const statusColors = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  return (
    <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden mt-8">
      <CardHeader className="px-6 md:px-8 pt-8 pb-4 flex flex-col items-start gap-4 border-b border-slate-100 dark:border-slate-800/50">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 w-full">
          <History size={20} className="text-primary" />
          My Contribution History
        </h2>

        <div className="w-full">
          <WelfareFilters
            search={search}
            setSearch={setSearch}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </div>
      </CardHeader>
      <CardBody className="px-5 md:px-8 py-8">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : records.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              <Table
                aria-label="Welfare History"
                removeWrapper
                className="min-w-full"
              >
                <TableHeader>
                  <TableColumn className="font-black text-xs tracking-widest uppercase">
                    Date
                  </TableColumn>
                  <TableColumn className="font-black text-xs tracking-widest uppercase">
                    Description
                  </TableColumn>
                  <TableColumn className="font-black text-xs tracking-widest uppercase">
                    Amount
                  </TableColumn>
                  <TableColumn className="font-black text-xs tracking-widest uppercase">
                    Status
                  </TableColumn>
                  <TableColumn className="font-black text-xs tracking-widest uppercase">
                    Details
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow
                      key={record._id}
                      className="border-b border-slate-50 dark:border-slate-900/50"
                    >
                      <TableCell className="font-bold">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-bold text-slate-500 dark:text-slate-400">
                        {record.description}
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ₹{record.amount}
                      </TableCell>
                      <TableCell>
                        <Chip
                          variant="flat"
                          color={statusColors[record.status]}
                          size="sm"
                          className="font-black text-[10px] tracking-wider uppercase"
                        >
                          {record.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center min-h-[24px]">
                          {record.status === "approved" && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
                              <CheckCircle2 size={12} />
                              Receipt: {record.receipt_number}
                            </div>
                          )}
                          {record.status === "rejected" && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-danger bg-danger/10 px-3 py-1 rounded-full">
                              <AlertCircle size={12} className="shrink-0" />
                              {record.rejection_reason}
                            </div>
                          )}
                          {record.status === "pending" && (
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                              Awaiting review
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile View */}
            <div className="md:hidden">
              <WelfareMobileList
                records={records}
                statusColors={statusColors}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Box size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-400">
              No records found
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              You haven't submitted any Welfare records yet.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
