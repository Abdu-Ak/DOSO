"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { User as UserComponent } from "@heroui/user";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  DollarSign,
  Package,
  FileText,
  Loader2,
} from "lucide-react";

/**
 * Mobile view for Sundook list in Admin panel
 */
const MobileSundookList = ({ records, isLoading, onApprove, onReject }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest">
          Loading records...
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <Package className="mx-auto text-slate-300 mb-2" size={48} />
        <p className="text-slate-500 font-bold">No records found</p>
      </div>
    );
  }

  const colors = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  return (
    <div className="flex flex-col gap-4 lg:hidden">
      {records.map((record) => (
        <Card
          key={record._id}
          className="shadow-sm border border-slate-100 dark:border-slate-800 rounded-xl"
          radius="2xl"
        >
          <CardBody className="p-4">
            <div className="flex justify-between items-start mb-4">
              <UserComponent
                avatarProps={{
                  radius: "lg",
                  src: record.alumni?.image,
                  fallback: record.alumni?.name?.charAt(0),
                }}
                description={`@${record.alumni?.userId}`}
                name={record.alumni?.name}
              />
              <Chip
                className="font-black text-[10px] tracking-wider uppercase"
                color={colors[record.status] || "default"}
                size="sm"
                variant="flat"
              >
                {record.status}
              </Chip>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                  <Calendar size={10} /> Year
                </p>
                <p className="font-bold text-sm">{record.year}</p>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                  <DollarSign size={10} /> Amount
                </p>
                <p className="font-bold text-sm text-primary">
                  ₹{record.amount}
                </p>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                  <Package size={10} /> Box No
                </p>
                <p className="font-bold text-sm">#{record.box_number}</p>
              </div>
              {record.status === "approved" && record.receipt_number && (
                <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                    <FileText size={10} /> Receipt
                  </p>
                  <p className="font-bold text-sm truncate">
                    {record.receipt_number}
                  </p>
                </div>
              )}
              {record.status === "rejected" && record.rejection_reason && (
                <div className="p-2 bg-danger/10 rounded-xl">
                  <p className="text-[10px] text-danger font-black uppercase mb-1 flex items-center gap-1">
                    <XCircle size={10} /> Reason
                  </p>
                  <p className="font-bold text-sm text-danger truncate">
                    {record.rejection_reason}
                  </p>
                </div>
              )}
            </div>

            {record.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  className="font-bold flex-1 h-10"
                  onPress={() => onApprove(record)}
                  startContent={<CheckCircle2 size={16} />}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="font-bold flex-1 h-10"
                  onPress={() => onReject(record)}
                  startContent={<XCircle size={16} />}
                >
                  Reject
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default MobileSundookList;
