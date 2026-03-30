"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EventForm from "../../_components/EventForm";
import { useEventMutations } from "../../_hooks/useEventMutations";
import { CalendarCog, Edit2, Loader2 } from "lucide-react";
import { Button } from "@heroui/button";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams();
  const { updateMutation } = useEventMutations();

  const { data: event, isLoading: isFetching } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${id}`);
      return response.data.event;
    },
    enabled: !!id,
  });

  const handleSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync({ id, formData });
      router.push("/admin/events");
    } catch (error) {
      console.error("Failed to update event:", error);
    }
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start md:items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <CalendarCog size={25} />
        </div>
        <div>
          <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
            Edit Event
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">
            Update the details for "{event.title}".
          </p>
        </div>
      </div>

      <EventForm
        initialData={event}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={() => router.back()}
      />
    </div>
  );
}
