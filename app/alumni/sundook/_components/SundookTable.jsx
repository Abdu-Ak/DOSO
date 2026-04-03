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
import { Chip } from "@heroui/chip";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SundookTable({ records, statusColors }) {
  return (
    <Table aria-label="Sundook History" removeWrapper className="min-w-full">
      <TableHeader>
        <TableColumn className="font-black text-xs tracking-widest uppercase">
          Year
        </TableColumn>
        <TableColumn className="font-black text-xs tracking-widest uppercase">
          Box No
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
            <TableCell className="font-bold">{record.year}</TableCell>
            <TableCell className="font-bold text-slate-500 dark:text-slate-400">
              #{record.box_number}
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
                    <AlertCircle size={12} />
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
  );
}
