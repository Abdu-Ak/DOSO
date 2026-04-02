"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";

/**
 * ─── View: contact info ───────────────────────────────────────────────────────
 */
const ContactViewCard = ({ data }) => {
  const rows = [
    { icon: Mail, label: "Email", value: data?.email },
    { icon: Phone, label: "Phone", value: data?.phone },
    { icon: MapPin, label: "Address", value: data?.address },
    { icon: LinkIcon, label: "Map Link", value: data?.mapLink },
  ];

  return (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="flex gap-2.5 px-5 pt-5 pb-0">
        <p className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
          Contact Info:
        </p>
      </CardHeader>
      <CardBody className="p-5 space-y-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 text-slate-400 shrink-0">
              <Icon size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-0.5">
                {label}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 break-all leading-tight font-medium">
                {value || (
                  <span className="italic text-slate-400 font-normal">
                    Not configured
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default ContactViewCard;
