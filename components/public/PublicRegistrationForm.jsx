"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  publicStudentSchema,
  publicAlumniSchema,
} from "@/lib/validations/publicRegistrationSchema";
import { Camera, X, Send, CheckCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import StudentSection from "@/app/admin/users/create/_components/StudentSection";
import AlumniSection from "@/app/admin/users/create/_components/AlumniSection";
import axios from "axios";
import { addToast } from "@heroui/toast";

const PublicRegistrationForm = ({ role }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const schema = role === "student" ? publicStudentSchema : publicAlumniSchema;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role,
      district: "Malappuram",
      guardian_relation: role === "student" ? "Father" : undefined,
      batch: role === "alumni" ? new Date().getFullYear().toString() : undefined,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setValue("image", file, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setValue("image", null, { shouldValidate: true });
  };

  const onFormSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "image") {
          if (selectedFile) formData.append("image", selectedFile);
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      await axios.post("/api/register", formData);
      setSubmitted(true);
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error.response?.data?.error || "Registration failed. Please try again.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Registration Submitted!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your registration is pending approval. You will receive an email
              with your login credentials once approved.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {role === "student" ? "Student" : "Alumni"} Registration
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Fill in the form below to register. Your application will be reviewed
          by an administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        <Card className="bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
          <CardBody className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center justify-center col-span-2 space-y-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group">
                  <div className={`w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-dashed ${errors.image ? "border-danger" : "border-slate-300 dark:border-slate-700"} flex items-center justify-center relative`}>
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                        <span className="text-xs font-bold uppercase tracking-wider">Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                </div>
              </div>

              {/* Role-specific fields (without password and status) */}
              {role === "student" && (
                <StudentSection
                  register={register}
                  errors={errors}
                  control={control}
                  watch={watch}
                  isPublic
                />
              )}
              {role === "alumni" && (
                <AlumniSection
                  register={register}
                  errors={errors}
                  control={control}
                  watch={watch}
                  isPublic
                />
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                startContent={!loading && <Send size={18} />}
                className="px-12 font-bold shadow-lg"
                radius="lg"
                size="lg"
              >
                Submit Registration
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default PublicRegistrationForm;
