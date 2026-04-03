"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { User, Mail, Phone } from "lucide-react";

/**
 * ─── View: single leader card info ───────────────────────────────────────────
 */
const LeaderViewCard = ({ role, title, data }) => {
  return (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
      <CardBody className="p-4 flex flex-row items-center gap-4">
        <div className="relative shrink-0">
          {data?.image ? (
            <img
              src={data.image}
              alt={data?.name}
              className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <User size={24} className="text-slate-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">
            {title}
          </p>
          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
            {data?.name || (
              <span className="text-slate-400 font-normal italic text-sm">
                Not set
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {data?.email && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Mail size={12} className="shrink-0" />
                <span className="truncate">{data.email}</span>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Phone size={12} className="shrink-0" />
                <span>{data.phone}</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default LeaderViewCard;
