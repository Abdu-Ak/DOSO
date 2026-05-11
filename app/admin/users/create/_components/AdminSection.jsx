"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { Controller } from "react-hook-form";
import { User as UserIcon, Mail, Lock, Phone, ShieldCheck } from "lucide-react";
import InputField from "@/components/admin/ui/InputField";
import { Checkbox } from "@heroui/checkbox";
import { PERMISSION_MODULES } from "@/lib/permissions";

const AdminSection = ({
  register,
  errors,
  control,
  watch,
  setValue,
  isEdit,
  isSelfEdit,
  currentUserRole,
  canSeePermissionsTable,
  canManagePermissionModule,
}) => {
  const filteredModules = PERMISSION_MODULES.filter(
    (m) =>
      m.key !== "permission_management" ||
      currentUserRole === "super_admin" ||
      canManagePermissionModule,
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

      {!isSelfEdit && (
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
                onSelectionChange={(keys) =>
                  field.onChange(Array.from(keys)[0])
                }
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

      {!isSelfEdit && watch("role") === "admin" && canSeePermissionsTable && (
        <div className="col-span-1 md:col-span-2 mt-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Module Permissions
          </h3>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                    Module
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300 text-center">
                    Access / View
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300 text-center">
                    Manage / Edit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredModules.map((module) => {
                  const isManageOnly = module.key === "permission_management";
                  const accessVal =
                    watch(`permissions.${module.key}.access`) || false;
                  const manageVal =
                    watch(`permissions.${module.key}.manage`) || false;

                  return (
                    <tr key={module.key} className="bg-white dark:bg-slate-900">
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                        {module.label}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isManageOnly ? (
                          <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                        ) : (
                          <Checkbox
                            isSelected={accessVal || manageVal}
                            onValueChange={(checked) => {
                              setValue(
                                `permissions.${module.key}.access`,
                                checked,
                              );
                              if (!checked) {
                                setValue(
                                  `permissions.${module.key}.manage`,
                                  false,
                                );
                              }
                            }}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Checkbox
                          isSelected={manageVal}
                          onValueChange={(checked) => {
                            setValue(
                              `permissions.${module.key}.manage`,
                              checked,
                            );
                            if (checked && !isManageOnly) {
                              setValue(
                                `permissions.${module.key}.access`,
                                true,
                              );
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSection;
