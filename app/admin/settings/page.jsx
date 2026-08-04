"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingSchema } from "@/lib/validations/settingShema";
import { useCloudinaryUpload } from "@/lib/hooks/useCloudinaryUpload";
import { useSettings } from "./_hooks/useSettings";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/permissions";
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
  const { uploadImage, isUploading } = useCloudinaryUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [previews, setPreviews] = useState({
    president: "",
    secretary: "",
    treasurer: "",
  });
  const [imageFiles, setImageFiles] = useState({
    president: null,
    secretary: null,
    treasurer: null,
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
        treasurer: { name: "", title: "", email: "", phone: "", image: "" },
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
        treasurer: settings.leadership?.treasurer?.image || "",
      });
    }
  }, [settings, reset]);

  const handleImageChange = (role, e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [role]: file }));
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [role]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    reset(settings);
    setImageFiles({ president: null, secretary: null, treasurer: null });
    setPreviews({
      president: settings?.leadership?.president?.image || "",
      secretary: settings?.leadership?.secretary?.image || "",
      treasurer: settings?.leadership?.treasurer?.image || "",
    });
    setIsEditing(false);
  };

  const onSubmit = async (data) => {
    // Upload any new image files, fall back to existing URL
    const uploadedImages = {};
    for (const role of ["president", "secretary", "treasurer"]) {
      if (imageFiles[role]) {
        const result = await uploadImage(imageFiles[role]);
        if (!result) return; // Abort if upload failed
        uploadedImages[role] = result.url;
      } else {
        uploadedImages[role] = settings?.leadership?.[role]?.image || "";
      }
    }

    updateMutation.mutate(
      {
        leadership: {
          president: { ...data.leadership.president, image: uploadedImages.president },
          secretary: { ...data.leadership.secretary, image: uploadedImages.secretary },
          treasurer: { ...data.leadership.treasurer, image: uploadedImages.treasurer },
        },
        contact: data.contact,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const { data: session } = useSession();
  const canManage = hasPermission(session?.user, "settings", "manage");

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

        {!isEditing && canManage && (
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
              title={settings?.leadership?.president?.title || "President"}
              data={settings?.leadership?.president}
            />
            <LeaderViewCard
              role="secretary"
              title={
                settings?.leadership?.secretary?.title || "General Secretary"
              }
              data={settings?.leadership?.secretary}
            />
            <LeaderViewCard
              role="treasurer"
              title={settings?.leadership?.treasurer?.title || "Treasurer"}
              data={settings?.leadership?.treasurer}
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
