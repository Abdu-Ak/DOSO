"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { User, UploadCloud, AtSign, Phone, Mail } from "lucide-react";

/**
 * ─── Edit: leader form card ───────────────────────────────────────────────────
 */
const LeaderEditCard = ({
  role,
  title,
  errors,
  register,
  previews,
  handleImageChange,
}) => {
  return (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-col items-start px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <p className="text-base font-bold">{title}</p>
        <p className="text-xs text-slate-500 font-medium">
          Personnel configuration for {role}
        </p>
      </CardHeader>
      <CardBody className="p-5">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm">
              {previews[role] ? (
                <img
                  src={previews[role]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={24} className="text-slate-300" />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <UploadCloud size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(role, e)}
                />
              </label>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Photo (1:1)
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register(`leadership.${role}.name`)}
              label="Full Name"
              placeholder="Full name"
              labelPlacement="outside"
              variant="bordered"
              isInvalid={!!errors.leadership?.[role]?.name}
              errorMessage={errors.leadership?.[role]?.name?.message}
            />
            <Input
              {...register(`leadership.${role}.title`)}
              label="Position Title"
              placeholder="e.g. President"
              labelPlacement="outside"
              variant="bordered"
              isInvalid={!!errors.leadership?.[role]?.title}
              errorMessage={errors.leadership?.[role]?.title?.message}
            />
            <Input
              {...register(`leadership.${role}.email`)}
              label="Email"
              placeholder="email@example.com"
              labelPlacement="outside"
              variant="bordered"
              isInvalid={!!errors.leadership?.[role]?.email}
              errorMessage={errors.leadership?.[role]?.email?.message}
              startContent={<Mail size={14} className="text-slate-400" />}
            />
            <Input
              {...register(`leadership.${role}.phone`)}
              label="Phone Number"
              labelPlacement="outside"
              placeholder="+XXXXXXX"
              variant="bordered"
              startContent={<Phone size={14} className="text-slate-400" />}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default LeaderEditCard;
