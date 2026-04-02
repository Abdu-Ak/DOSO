"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingSchema } from "@/lib/validations/settingShema";
import { useSettings } from "./_hooks/useSettings";
import { Button } from "@heroui/button";
import { Settings } from "lucide-react";

// Components
import SettingsHeader from "./_components/SettingsHeader";
import LeaderViewCard from "./_components/LeaderViewCard";
import ContactViewCard from "./_components/ContactViewCard";
import EditForm from "./_components/EditForm";

/**
 * ─── Main Page ────────────────────────────────────────────────────────────────
 */
export default function SettingsPage() {
  const { settings, isLoading, updateMutation } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [previews, setPreviews] = useState({
    president: "",
    secretary: "",
    headmaster: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      leadership: {
        president: { name: "", title: "", email: "", phone: "", image: "" },
        secretary: { name: "", title: "", email: "", phone: "", image: "" },
        headmaster: {
          name: "",
          title: "",
          email: "",
          phone: "",
          image: "",
        },
      },
      contact: { email: "", phone: "", address: "", mapLink: "" },
    },
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
      setPreviews({
        president: settings.leadership?.president?.image || "",
        secretary: settings.leadership?.secretary?.image || "",
        headmaster: settings.leadership?.headmaster?.image || "",
      });
    }
  }, [settings, reset]);

  const handleImageChange = (role, e) => {
    const file = e.target.files[0];
    if (file) {
      setValue(`leadership.${role}.image`, file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [role]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    reset(settings);
    setPreviews({
      president: settings?.leadership?.president?.image || "",
      secretary: settings?.leadership?.secretary?.image || "",
      headmaster: settings?.leadership?.headmaster?.image || "",
    });
    setIsEditing(false);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("contact.email", data.contact.email);
    formData.append("contact.phone", data.contact.phone);
    formData.append("contact.address", data.contact.address);
    formData.append("contact.mapLink", data.contact.mapLink);

    ["president", "secretary", "headmaster"].forEach((role) => {
      formData.append(`leadership.${role}.name`, data.leadership[role].name);
      formData.append(`leadership.${role}.title`, data.leadership[role].title);
      formData.append(
        `leadership.${role}.email`,
        data.leadership[role].email || "",
      );
      formData.append(
        `leadership.${role}.phone`,
        data.leadership[role].phone || "",
      );
      const imageFile = data.leadership[role].image;
      if (imageFile && typeof imageFile !== "string") {
        formData.append(`leadership.${role}.image`, imageFile);
      } else {
        formData.append(
          `leadership.${role}.currentImage`,
          settings?.leadership?.[role]?.image || "",
        );
      }
    });

    updateMutation.mutate(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SettingsHeader />

        {!isEditing && (
          <Button
            onPress={() => setIsEditing(true)}
            color="primary"
            startContent={<Settings size={18} />}
            className="font-bold shadow-lg shadow-primary/20"
            radius="xl"
          >
            Edit Configuration
          </Button>
        )}
      </div>

      {/* View Mode */}
      {!isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <LeaderViewCard
              role="president"
              title="President"
              data={settings?.leadership?.president}
            />
            <LeaderViewCard
              role="secretary"
              title="General Secretary"
              data={settings?.leadership?.secretary}
            />
            <LeaderViewCard
              role="headmaster"
              title="Head Master"
              data={settings?.leadership?.headmaster}
            />
          </div>
          <div className="lg:col-span-4">
            <ContactViewCard data={settings?.contact} />
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <EditForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          previews={previews}
          handleImageChange={handleImageChange}
          updateMutation={updateMutation}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
}
