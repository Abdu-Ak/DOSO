"use client";

import React from "react";
import { Pagination } from "@heroui/pagination";
import { Loader2, Inbox } from "lucide-react";
import EventFilters from "./EventFilters";
import EventCard from "./EventCard";

const MobileEventList = ({
  events,
  isLoading,
  filterProps,
  paginationProps,
  onToggleVisibility,
  onDelete,
}) => {
  return (
    <div className="lg:hidden space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <EventFilters {...filterProps} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm font-medium text-slate-400">
            Loading events...
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
          <p className="text-slate-400 font-medium">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {paginationProps?.total > 1 && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <span className="text-xs text-slate-500 font-bold">
            {paginationProps.label ||
              `Showing ${events.length} of ${paginationProps.totalItems} events`}
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={paginationProps.page}
            total={paginationProps.total}
            onChange={paginationProps.onChange}
            radius="lg"
          />
        </div>
      )}
    </div>
  );
};

export default MobileEventList;
