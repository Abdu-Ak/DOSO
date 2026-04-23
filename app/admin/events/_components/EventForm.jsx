"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EVENT_TYPES } from "./EventFilters";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  UploadCloud,
  Plus,
  Save,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { addToast } from "@heroui/toast";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Calendar } from "@heroui/calendar";
import { TimeInput } from "@heroui/date-input";
import { parseDate, parseTime } from "@internationalized/date";
import { createEventSchema } from "@/lib/validations/eventSchema";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export default function EventForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Other",
      date: "",
      time: "",
      heldingPlace: "",
      isVisible: true,
      mainImage: "",
      galleryImages: [],
      galleryVideos: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : "";
      reset({
        ...initialData,
        date: formattedDate,
        time: initialData.time || "",
      });
      setMainImagePreview(initialData.mainImage);
      setGalleryImages(initialData.galleryImages || []);
      setGalleryVideos(initialData.galleryVideos || []);
    }
  }, [initialData, reset]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        return addToast({
          title: "Error",
          description: "Image size exceeds 10MB limit",
          color: "danger",
        });
      }
      setValue("mainImage", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        addToast({
          title: "Error",
          description: `${file.name} exceeds 10MB limit`,
          color: "danger",
        });
        return false;
      }
      return true;
    });

    if (galleryImages.length + validFiles.length > 10) {
      return addToast({
        title: "Error",
        description: "Maximum 10 gallery images allowed",
        color: "danger",
      });
    }

    setGalleryImages([...galleryImages, ...validFiles]);
  };

  const handleGalleryVideosChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > MAX_VIDEO_SIZE) {
        addToast({
          title: "Error",
          description: `${file.name} exceeds 50MB limit`,
          color: "danger",
        });
        return false;
      }
      return true;
    });

    if (galleryVideos.length + validFiles.length > 10) {
      return addToast({
        title: "Error",
        description: "Maximum 10 gallery videos allowed",
        color: "danger",
      });
    }

    setGalleryVideos([...galleryVideos, ...validFiles]);
  };

  const removeGalleryItem = (index, type) => {
    if (type === "image") {
      setGalleryImages(galleryImages.filter((_, i) => i !== index));
    } else {
      setGalleryVideos(galleryVideos.filter((_, i) => i !== index));
    }
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "galleryImages" && key !== "galleryVideos") {
        formData.append(key, data[key]);
      }
    });

    galleryImages.forEach((img) => formData.append("galleryImages", img));
    galleryVideos.forEach((vid) => formData.append("galleryVideos", vid));

    onSubmit(formData);
  };

  const isVisibleValue = watch("isVisible");

  const requiredLabel = (text) => (
    <span>
      {text} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Basic Details Card */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Plus size={20} className="text-primary" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={requiredLabel("Event Title")}
                placeholder="Enter event title"
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                {...register("title")}
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                className="md:col-span-2"
              />

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={requiredLabel("Category")}
                    placeholder="Select category"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) => field.onChange([...keys][0])}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type?.message}
                  >
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Input
                label={requiredLabel("Location")}
                placeholder="Enter venue / place"
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                {...register("heldingPlace")}
                isInvalid={!!errors.heldingPlace}
                errorMessage={errors.heldingPlace?.message}
                startContent={<MapPin size={18} className="text-slate-400" />}
              />

              <div className="space-y-1">
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {requiredLabel("Date")}
                      </span>
                      <Popover
                        isOpen={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                        placement="bottom"
                      >
                        <PopoverTrigger>
                          <Button
                            variant="bordered"
                            radius="lg"
                            className="h-10 justify-start border-slate-200 dark:border-slate-700 w-full"
                            startContent={
                              <CalendarDays
                                size={18}
                                className="text-slate-400"
                              />
                            }
                          >
                            {field.value
                              ? new Date(field.value).toLocaleDateString()
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Calendar
                            aria-label="Event Date"
                            value={
                              field.value
                                ? parseDate(field.value.split("T")[0])
                                : null
                            }
                            onChange={(date) => {
                              field.onChange(date.toString());
                              setIsCalendarOpen(false);
                            }}
                            showMonthAndYearPickers
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.date && (
                        <span className="text-xs text-danger font-medium">
                          {errors.date.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>

              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimeInput
                    {...field}
                    label={requiredLabel("Time")}
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    placeholderValue={parseTime("00:00")}
                    value={field.value ? parseTime(field.value) : null}
                    onChange={(val) =>
                      field.onChange(val ? val.toString() : "")
                    }
                    isInvalid={!!errors.time}
                    errorMessage={errors.time?.message}
                    startContent={
                      <Clock size={18} className="text-slate-400" />
                    }
                  />
                )}
              />

              <Textarea
                label="Description"
                placeholder="Enter short description (max 200 chars)"
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                maxLength={200}
                {...register("description")}
                description={`${watch("description")?.length || 0}/200`}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                className="md:col-span-2"
              />

              <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Public Visibility
                  </span>
                  <p className="text-xs text-slate-500">
                    Enable this to show the event on the public website.
                  </p>
                </div>
                <Switch
                  isSelected={isVisibleValue}
                  onValueChange={(val) => setValue("isVisible", val)}
                  color="success"
                />
              </div>
            </div>
          </div>

          {/* Gallery Media */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ImageIcon size={20} className="text-primary" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Gallery Media
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Images (Max 10)
                  </span>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      document.getElementById("galleryImagesInput").click()
                    }
                    startContent={<Plus size={14} />}
                    radius="lg"
                  >
                    Add
                  </Button>
                </div>
                <input
                  id="galleryImagesInput"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryImagesChange}
                />
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img, index) => {
                    const preview =
                      typeof img === "string" ? img : URL.createObjectURL(img);
                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 group"
                      >
                        <img
                          src={preview}
                          className="w-full h-full object-cover"
                          alt={`gallery-${index}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(index, "image")}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Videos (Max 10)
                  </span>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      document.getElementById("galleryVideosInput").click()
                    }
                    startContent={<Plus size={14} />}
                    radius="lg"
                  >
                    Add
                  </Button>
                </div>
                <input
                  id="galleryVideosInput"
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={handleGalleryVideosChange}
                />
                <div className="space-y-2">
                  {galleryVideos.map((vid, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2 overflow-hidden text-xs">
                        <VideoIcon size={14} className="text-primary" />
                        <span className="truncate">
                          {typeof vid === "string" ? "Video" : vid.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(index, "video")}
                        className="text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ImageIcon size={20} className="text-primary" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {requiredLabel("Main Banner")}
              </h3>
            </div>

            <div
              className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl aspect-square flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 group hover:border-primary cursor-pointer"
              onClick={() => document.getElementById("mainImageInput").click()}
            >
              {mainImagePreview ? (
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 p-6 text-center text-slate-400">
                  <UploadCloud size={32} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-200">
                      Upload Banner
                    </p>
                    <p className="text-xs">JPG, PNG or WEBP</p>
                  </div>
                </div>
              )}
              <input
                id="mainImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageChange}
              />
            </div>
            {errors.mainImage && (
              <p className="text-xs text-danger font-medium">
                {errors.mainImage.message}
              </p>
            )}
          </div>

          {/* Form Actions Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full font-bold h-12 shadow-lg shadow-primary/20"
              radius="lg"
              startContent={!isLoading && <Save size={18} />}
            >
              {initialData ? "Update Event" : "Create Event"}
            </Button>
            <Button
              variant="flat"
              onPress={onCancel}
              className="w-full font-bold h-12"
              radius="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
