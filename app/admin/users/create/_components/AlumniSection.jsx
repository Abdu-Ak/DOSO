"use client";

import React from "react";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Controller } from "react-hook-form";
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Home,
  MapPin,
  MailboxIcon,
  MapPinned,
  School,
} from "lucide-react";
import InputField from "@/components/admin/ui/InputField";

const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
  "Other",
];

const AlumniSection = ({ register, errors, control, watch, isEdit, isPublic }) => {
  const selectedDistrict = watch("district");
  const batchYears = Array.from({ length: 25 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

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
        {...register("email")}
        type="email"
        label="Email Address"
        placeholder="Enter email address"
        startContent={<Mail size={18} className="text-slate-400" />}
        error={errors.email}
      />

      <InputField
        {...register("phone")}
        label="Phone Number"
        placeholder="Enter phone number"
        startContent={<Phone size={18} className="text-slate-400" />}
        error={errors.phone}
      />

      {!isPublic && (
        <InputField
          {...register("password")}
          type="password"
          label="Password"
          placeholder="Enter password"
          startContent={<Lock size={18} className="text-slate-400" />}
          error={errors.password}
          isEdit={isEdit}
        />
      )}

      <InputField
        {...register("father_name")}
        label="Father Name"
        placeholder="Enter father name"
        startContent={<UserIcon size={18} className="text-slate-400" />}
        error={errors.father_name}
      />

      <InputField
        {...register("house_name")}
        label="House Name"
        placeholder="Enter house name"
        startContent={<Home size={18} className="text-slate-400" />}
        error={errors.house_name}
      />

      <div className="md:col-span-2 space-y-1">
        <Textarea
          {...register("address")}
          label={
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Address <span className="text-red-500">*</span>
            </span>
          }
          labelPlacement="outside"
          variant="bordered"
          placeholder="Enter address"
          startContent={<Home size={18} className="text-slate-400" />}
          radius="sm"
          isInvalid={!!errors.address}
          errorMessage={errors.address?.message}
        />
      </div>

      <InputField
        {...register("post_office")}
        label="Post Office"
        placeholder="Enter post office"
        startContent={<MailboxIcon size={18} className="text-slate-400" />}
        error={errors.post_office}
      />

      <div className="space-y-1">
        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  District <span className="text-red-500">*</span>
                </span>
              }
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              placeholder="Select district"
              isInvalid={!!errors.district}
              errorMessage={errors.district?.message}
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            >
              {KERALA_DISTRICTS.map((d) => (
                <SelectItem key={d} textValue={d}>
                  {d}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      {selectedDistrict === "Other" && (
        <InputField
          {...register("custom_district")}
          label="District Name"
          placeholder="Enter district name"
          startContent={<MapPin size={18} className="text-slate-400" />}
          error={errors.custom_district}
        />
      )}

      <InputField
        {...register("pincode")}
        label="Pincode"
        placeholder="Enter pincode"
        startContent={<MapPinned size={18} className="text-slate-400" />}
        error={errors.pincode}
      />

      <InputField
        {...register("education")}
        label="Education"
        placeholder="Enter education"
        startContent={<School size={18} className="text-slate-400" />}
        error={errors.education}
      />

      <div className="space-y-1">
        <Controller
          name="batch"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Batch <span className="text-red-500">*</span>
                </span>
              }
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              placeholder="Select batch"
              isInvalid={!!errors.batch}
              errorMessage={errors.batch?.message}
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            >
              {batchYears.map((y) => (
                <SelectItem key={y} textValue={y}>
                  {y}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      {!isPublic && (
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
      )}
    </>
  );
};

export default AlumniSection;
