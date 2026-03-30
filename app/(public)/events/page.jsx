import React from "react";
import EventsHero from "./_components/EventsHero";
import EventsGrid from "./_components/EventsGrid";

export default function EventsPage() {
  return (
    <>
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-islamic-pattern z-0 opacity-100 dark:opacity-50"></div>

      <main className="flex-grow z-10 py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <EventsHero />
          <EventsGrid />
        </div>
      </main>
    </>
  );
}
