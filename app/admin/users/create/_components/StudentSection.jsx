"use client";

import React, { useState } from "react";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Controller } from "react-hook-form";
import { RadioGroup, Radio } from "@heroui/radio";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Button } from "@heroui/button";
import { Calendar } from "@heroui/calendar";
import { parseDate } from "@internationalized/date";
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  School,
  Home,
  MapPin,
  CalendarDays,
  BriefcaseIcon,
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

const StudentSection = ({ register, errors, control, watch, isEdit }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAdmissionCalendarOpen, setIsAdmissionCalendarOpen] = useState(false);
  const selectedDistrict = watch("district");

  return (
    <>
      <InputField
        {...register("madrasa_name")}
        label="Madrasa Name"
        placeholder="Enter madrasa name"
        startContent={<School size={18} className="text-slate-400" />}
        error={errors.madrasa_name}
      />

      <InputField
        {...register("name")}
        label="Student Name"
        placeholder="Enter student name"
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

      <InputField
        {...register("password")}
        type="password"
        label="Password"
        placeholder="Enter password"
        startContent={<Lock size={18} className="text-slate-400" />}
        error={errors.password}
        isEdit={isEdit}
      />

      <div className="space-y-1">
        <Controller
          name="dob"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Date of Birth <span className="text-red-500">*</span>
              </span>
              <Popover
                isOpen={isCalendarOpen}
                onOpenChange={setIsCalendarOpen}
                placement="bottom"
              >
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    radius="sm"
                    className="h-10 justify-start border-slate-200 dark:border-slate-700"
                    startContent={
                      <CalendarDays size={18} className="text-slate-400" />
                    }
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    aria-label="DOB"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date.toString());
                      setIsCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.dob && (
                <span className="text-xs text-danger">
                  {errors.dob.message}
                </span>
              )}
            </div>
          )}
        />
      </div>

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
          placeholder="Enter address"
          startContent={<MapPin size={18} className="text-slate-400" />}
          variant="bordered"
          radius="sm"
          isInvalid={!!errors.address}
          errorMessage={errors.address?.message}
        />
      </div>

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
        {...register("guardian_name")}
        label="Guardian Name"
        placeholder="Enter guardian name"
        startContent={<UserIcon size={18} className="text-slate-400" />}
        error={errors.guardian_name}
      />

      <InputField
        {...register("guardian_phone")}
        label="Guardian Phone"
        placeholder="Enter guardian phone"
        startContent={<Phone size={18} className="text-slate-400" />}
        error={errors.guardian_phone}
      />

      <div className="space-y-1">
        <Controller
          name="guardian_relation"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label={
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Relation <span className="text-red-500">*</span>
                </span>
              }
              value={field.value}
              onValueChange={field.onChange}
              isInvalid={!!errors.guardian_relation}
              errorMessage={errors.guardian_relation?.message}
            >
              <div className="flex gap-4">
                <Radio value="Father">Father</Radio>
                <Radio value="Mother">Mother</Radio>
                <Radio value="Other">Other</Radio>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <InputField
        {...register("guardian_occupation")}
        label="Occupation"
        placeholder="Enter occupation"
        startContent={<BriefcaseIcon size={18} className="text-slate-400" />}
        error={errors.guardian_occupation}
      />

      <div className="space-y-1">
        <Controller
          name="date_of_admission"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Date of Admission <span className="text-red-500">*</span>
              </span>
              <Popover
                isOpen={isAdmissionCalendarOpen}
                onOpenChange={setIsAdmissionCalendarOpen}
                placement="bottom"
              >
                <PopoverTrigger>
                  <Button
                    variant="bordered"
                    radius="sm"
                    className="h-10 justify-start border-slate-200 dark:border-slate-700"
                    startContent={
                      <CalendarDays size={18} className="text-slate-400" />
                    }
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    aria-label="Admission"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date.toString());
                      setIsAdmissionCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.date_of_admission && (
                <span className="text-xs text-danger">
                  {errors.date_of_admission.message}
                </span>
              )}
            </div>
          )}
        />
      </div>

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

export default StudentSection;
