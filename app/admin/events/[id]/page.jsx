"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Video,
  Download,
  Loader2,
  Edit,
  CalendarCog,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { useEventMutations } from "../_hooks/useEventMutations";

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toggleVisibilityMutation } = useEventMutations();

  const { data: event, isLoading: isFetching } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${id}`);
      return response.data.event;
    },
    enabled: !!id,
  });

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isFetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-medium">Event not found</p>
        <Button onPress={() => router.push("/admin/events")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="light"
          onPress={() => router.push("/admin/events")}
          startContent={<ArrowLeft size={18} />}
          className="flex font-bold text-slate-500 hover:text-primary pl-0"
        >
          Back to events
        </Button>
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            href={`/admin/events/${id}/edit`}
            color="primary"
            startContent={<CalendarCog size={18} />}
            className="font-bold shadow-lg shadow-primary/20"
            radius="xl"
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Event Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="aspect-4/3 relative">
              <img
                src={event.mainImage}
                className="w-full h-full object-cover"
                alt={event.title}
              />
              <div className="absolute top-4 right-4 translate-z-0">
                <Chip
                  color={event.isVisible ? "success" : "danger"}
                  variant="flat"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md font-bold shadow-sm"
                >
                  {event.isVisible ? "Visible" : "Hidden"}
                </Chip>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <Chip
                  size="sm"
                  variant="flat"
                  color="secondary"
                  className="mb-2 uppercase text-xs font-black tracking-widest"
                >
                  {event.type}
                </Chip>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white capitalize leading-tight">
                  {event.title}
                </h1>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <Calendar size={16} />
                  </div>
                  <p className="text-sm font-bold">
                    {format(new Date(event.date), "EEEE, dd MMMM yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <Clock size={16} />
                  </div>
                  <p className="text-sm font-bold">{event.time}</p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <MapPin size={16} />
                  </div>
                  <p className="text-sm font-bold capitalize">
                    {event.heldingPlace}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                  &ldquo;{event.description}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visibility & Gallery Card */}
        <div className="lg:col-span-2 space-y-8">
          {/* Visibility Section */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl overflow-visible">
            <CardBody className="p-6 flex flex-row gap-3 items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Public Visibility
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Enable this to show the event on the public website.
                </p>
              </div>
              <Switch
                size="lg"
                isSelected={event.isVisible}
                onValueChange={(val) =>
                  toggleVisibilityMutation.mutate({ id, isVisible: val })
                }
                color="success"
              />
            </CardBody>
          </Card>

          {/* Images Gallery */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Photo Gallery
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {event.galleryImages?.length || 0} Files
              </span>
            </div>

            {event.galleryImages?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {event.galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={`Gallery ${i}`}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-white/20 text-white"
                        onPress={() => handleDownload(img, `event-photo-${i}`)}
                      >
                        <Download size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                <ImageIcon size={40} className="opacity-20" />
                <p className="text-sm italic">
                  No photos available in this event's gallery.
                </p>
              </div>
            )}
          </div>

          {/* Videos Gallery */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                  <Video size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Video Gallery
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {event.galleryVideos?.length || 0} Files
              </span>
            </div>

            {event.galleryVideos?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.galleryVideos.map((vid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                        <Video size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          Video File {i + 1}
                        </p>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-0.5">
                          MP4 Format
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      className="text-slate-400 hover:text-secondary group-hover:bg-secondary/10"
                      isIconOnly
                      onPress={() => handleDownload(vid, `event-video-${i}`)}
                    >
                      <Download size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                <Video size={40} className="opacity-20" />
                <p className="text-sm italic">
                  No videos available in this event's gallery.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
