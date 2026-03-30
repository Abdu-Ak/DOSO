"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@heroui/button";

export default function EventCard({ event, onViewGallery }) {
  const photoCount = event.galleryImages?.length || 0;
  const videoCount = event.galleryVideos?.length || 0;

  return (
    <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white dark:bg-neutral-dark">
      <CardHeader className="p-0 relative aspect-16/10 overflow-hidden">
        <Image
          removeWrapper
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={event.mainImage}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute top-4 left-4 z-20">
          <Chip
            className="capitalize font-bold px-3 shadow-lg"
            color="primary"
            variant="flat"
            size="sm"
          >
            {event.type}
          </Chip>
        </div>

        {(photoCount > 0 || videoCount > 0) && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            {photoCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-bold border border-white/10">
                <ImageIcon size={12} /> {photoCount} Photos
              </div>
            )}
            {videoCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-bold border border-white/10">
                <Video size={12} /> {videoCount} Videos
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardBody className="px-5 py-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <Calendar size={14} className="text-primary" />
          {format(new Date(event.date), "dd MMM yyyy")}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 italic">
            &quot;{event.description}&quot;
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm font-medium">
          <MapPin size={14} className="text-primary/70" />
          <span className="truncate">{event.heldingPlace}</span>
        </div>
      </CardBody>

      <CardFooter className="px-5 pb-6 pt-0 flex items-center justify-between">
        <Button
          variant="light"
          color="primary"
          onPress={() => onViewGallery(event)}
          className="font-bold p-2 h-auto min-w-0 bg-transparent hover:translate-x-1 transition-transform"
          endContent={<ChevronRight size={18} />}
        >
          View Gallery
        </Button>
      </CardFooter>
    </Card>
  );
}
