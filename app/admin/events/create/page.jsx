"use client";

import React from "react";
import { useRouter } from "next/navigation";
import EventForm from "../_components/EventForm";
import { useEventMutations } from "../_hooks/useEventMutations";
import { CalendarPlus } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const { createMutation } = useEventMutations();

  const handleSubmit = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      router.push("/admin/events");
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start md:items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <CalendarPlus size={25} />
        </div>
        <div>
          <h2 className="text-lg font-body! font-bold text-slate-900 dark:text-white">
            Create New Event
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">
            Fill in the details to create a new event for your institution.
          </p>
        </div>
      </div>

      <EventForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => router.back()}
      />
    </div>
  );
}
