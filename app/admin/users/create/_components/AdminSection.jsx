"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { Controller } from "react-hook-form";
import { User as UserIcon, Mail, Lock, Phone, ShieldCheck } from "lucide-react";
import InputField from "@/components/admin/ui/InputField";

const AdminSection = ({ register, errors, control, isEdit }) => {
  return (
    <>
      <InputField
        {...register("name")}
        label="Full Name"
        placeholder="Enter full name"
        startContent={<UserIcon size={18} className="text-slate-400" />}
        error={errors.name}
      />

      <InputField
        {...register("userId")}
        label="Username"
        placeholder="Enter username"
        startContent={<ShieldCheck size={18} className="text-slate-400" />}
        error={errors.userId}
      />

      <InputField
        {...register("email")}
        type="email"
        label="Email Address"
        placeholder="Enter email address"
        startContent={<Mail size={18} className="text-slate-400" />}
        error={errors.email}
      />

      <InputField
        {...register("password")}
        type="password"
        label="Password"
        placeholder="Enter password"
        startContent={<Lock size={18} className="text-slate-400" />}
        error={errors.password}
        isEdit={isEdit}
      />

      <InputField
        {...register("phone")}
        label="Phone Number"
        placeholder="Enter phone number"
        startContent={<Phone size={18} className="text-slate-400" />}
        error={errors.phone}
      />

      <div className="space-y-1">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status <span className="text-red-500">*</span>
                </span>
              }
              labelPlacement="outside"
              variant="bordered"
              placeholder="Select status"
              radius="sm"
              isInvalid={!!errors.status}
              errorMessage={errors.status?.message}
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            >
              <SelectItem key="Active" textValue="Active">
                Active
              </SelectItem>
              <SelectItem key="Pending" textValue="Pending">
                Pending
              </SelectItem>
              <SelectItem key="Inactive" textValue="Inactive">
                Inactive
              </SelectItem>
            </Select>
          )}
        />
      </div>
    </>
  );
};

export default AdminSection;
