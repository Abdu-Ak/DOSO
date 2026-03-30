"use client";

import React, { useState } from "react";
import EventCard from "./EventCard";
import { RefreshCw, SearchX, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EventsFilter from "./EventsFilter";
import ViewGalleryModal from "./ViewGalleryModal";
import { useDisclosure } from "@heroui/modal";
import { useDebounce } from "@/lib/hooks";

export default function EventsGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "public_events",
      page,
      debouncedSearchTerm,
      category,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const response = await axios.get("/api/events", {
        params: {
          page,
          limit,
          search: debouncedSearchTerm,
          type: category,
          startDate,
          endDate,
          isVisible: "true", // Only show visible events on public side
          sort: "desc", // Newest first
        },
      });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  const events = data?.events || [];
  const totalPages = data?.pages || 1;

  const handleViewGallery = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleReset = () => {
    setSearchTerm("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <>
      <EventsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-slate-400 font-medium animate-pulse">
            Loading upcoming events...
          </p>
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onViewGallery={handleViewGallery}
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-16 text-center">
              <button
                onClick={() => setPage(page + 1)}
                disabled={isFetching}
                className="inline-flex items-center px-10 py-4 border border-primary/20 bg-white dark:bg-neutral-dark text-primary dark:text-white text-sm font-bold rounded-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-xl shadow-primary/5 hover:shadow-primary/20 disabled:opacity-50"
              >
                {isFetching ? "Loading..." : "View More Events"}
                <RefreshCw
                  size={18}
                  className={`ml-2 ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white/50 dark:bg-neutral-dark/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
            <SearchX size={48} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No Events Found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Try adjusting your filters or search terms to find what
              you&apos;re looking for.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      <ViewGalleryModal
        isOpen={isOpen}
        onClose={onOpenChange}
        event={selectedEvent}
      />
    </>
  );
}
