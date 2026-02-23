"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/validations/userSchema";
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Calendar,
  ShieldCheck,
  Camera,
  X,
  Save,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

const UserForm = ({ initialData, onSubmit, loading, isEdit = false }) => {
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...initialData,
      dob: initialData?.dob
        ? new Date(initialData.dob).toISOString().split("T")[0]
        : "",
      password: "", // Always start with empty password
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("image", file); // Zod will handle actual file object
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setValue("image", null);
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (selectedFile) {
          formData.append("image", selectedFile);
        }
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
        <CardBody className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Photo Upload Section */}
            <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center relative">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Camera size={32} className="mx-auto mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Upload Photo
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                JPG, PNG or WebP. Max 2MB.
              </p>
            </div>

            {/* Basic Info */}
            <div className="space-y-1">
              <Input
                {...register("name")}
                label="Full Name"
                labelPlacement="outside"
                placeholder="Ahmed Khan"
                variant="bordered"
                radius="lg"
                startContent={<UserIcon size={18} className="text-slate-400" />}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                classNames={{
                  label: "font-bold text-slate-700 dark:text-slate-300",
                  inputWrapper:
                    "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                }}
              />
            </div>

            <div className="space-y-1">
              <Input
                {...register("username")}
                label="Username"
                labelPlacement="outside"
                placeholder="ahmed_khan"
                variant="bordered"
                radius="lg"
                startContent={
                  <ShieldCheck size={18} className="text-slate-400" />
                }
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
                classNames={{
                  label: "font-bold text-slate-700 dark:text-slate-300",
                  inputWrapper:
                    "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                }}
              />
            </div>

            <div className="space-y-1">
              <Input
                {...register("email")}
                type="email"
                label="Email Address"
                labelPlacement="outside"
                placeholder="ahmed@example.com"
                variant="bordered"
                radius="lg"
                startContent={<Mail size={18} className="text-slate-400" />}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                classNames={{
                  label: "font-bold text-slate-700 dark:text-slate-300",
                  inputWrapper:
                    "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                }}
              />
            </div>

            <div className="space-y-1">
              <Input
                {...register("password")}
                type="password"
                label={
                  <div className="flex items-center gap-2">
                    <span>Password</span>
                    {isEdit && (
                      <span className="text-xs font-normal text-slate-400">
                        (Leave blank to keep current)
                      </span>
                    )}
                  </div>
                }
                labelPlacement="outside"
                placeholder="••••••••"
                variant="bordered"
                radius="lg"
                startContent={<Lock size={18} className="text-slate-400" />}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                classNames={{
                  label: "font-bold text-slate-700 dark:text-slate-300",
                  inputWrapper:
                    "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                }}
              />
            </div>

            {/* Bio Data */}
            <div className="space-y-1">
              <Input
                {...register("phone")}
                label="Phone Number"
                labelPlacement="outside"
                placeholder="+1 234 567 890"
                variant="bordered"
                radius="lg"
                startContent={<Phone size={18} className="text-slate-400" />}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
                classNames={{
                  label: "font-bold text-slate-700 dark:text-slate-300",
                  inputWrapper:
                    "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                }}
              />
            </div>

            <div className="space-y-1">
              <Input
                {...register("dob")}
                type="date"
                label="Date of Birth"
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                startContent={<Calendar size={18} className="text-slate-400" />}
                isInvalid={!!errors.dob}
                errorMessage={errors.dob?.message}
                classNames={{
                  label: "font-bold text-slate-700 dark:text-slate-300",
                  inputWrapper:
                    "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                }}
              />
            </div>

            <div className="space-y-1">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Role"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    placeholder="Select a role"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    classNames={{
                      label: "font-bold text-slate-700 dark:text-slate-300",
                      trigger:
                        "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                    }}
                  >
                    <SelectItem key="student" value="student">
                      Student
                    </SelectItem>
                    <SelectItem key="alumni" value="alumni">
                      Alumni
                    </SelectItem>
                    <SelectItem key="admin" value="admin">
                      Admin
                    </SelectItem>
                  </Select>
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
                    label="Status"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    placeholder="Select status"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                    classNames={{
                      label: "font-bold text-slate-700 dark:text-slate-300",
                      trigger:
                        "h-12 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50",
                    }}
                  >
                    <SelectItem key="Active" value="Active">
                      Active
                    </SelectItem>
                    <SelectItem key="Pending" value="Pending">
                      Pending
                    </SelectItem>
                    <SelectItem key="Inactive" value="Inactive">
                      Inactive
                    </SelectItem>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <Button
              type="button"
              variant="light"
              onPress={() => window.history.back()}
              className="font-bold text-slate-600 dark:text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              className="px-8 font-bold shadow-lg shadow-primary/20"
              radius="lg"
            >
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default UserForm;
