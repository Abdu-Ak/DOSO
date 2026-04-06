"use client";

import React from "react";
import { Loader2, Inbox } from "lucide-react";
import EnquiryCard from "./EnquiryCard";

const MobileEnquiryList = ({
  enquiries,
  isLoading,
  onStatusChange,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-medium text-slate-400">
          Loading inquiries...
        </p>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
        <p className="text-slate-400 font-medium">
          No enquiries matches the criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
      {enquiries.map((enquiry) => (
        <EnquiryCard
          key={enquiry._id}
          enquiry={enquiry}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MobileEnquiryList;
