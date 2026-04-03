import React from "react";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import Link from "next/link";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const typeMeta = {
  Academic: { icon: "school", label: "EDUCATION" },
  Culture: { icon: "theater_comedy", label: "CULTURE" },
  Sports: { icon: "sports_soccer", label: "SPORTS" },
  Religious: { icon: "event", label: "RELIGIOUS" },
  Seminar: { icon: "group", label: "SEMINAR" },
  Other: { icon: "event", label: "EVENT" },
};

export default async function Events() {
  await dbConnect();
  const events = await Event.find({ isVisible: true })
    .sort({ date: -1 })
    .limit(3);

  return (
    <section
      className="py-20 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800"
      id="events"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-sm font-body mb-2 block">
              Updates
            </span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Recent Happenings
            </h2>
          </div>
          <Link
            className="hidden md:flex items-center gap-1 text-primary hover:text-primary-dark font-bold text-sm transition-colors"
            href="/events"
          >
            View All Events{" "}
            <span className="material-symbols-outlined text-lg">
              arrow_right_alt
            </span>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500">No recent events to show.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const d = new Date(event.date);
              const month = monthNames[d.getMonth()];
              const day = d.getDate();
              const meta = typeMeta[event.type] || typeMeta.Other;

              return (
                <article
                  key={event._id}
                  className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group h-full flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg z-10 text-center min-w-[60px] shadow-sm">
                      <span className="block text-xs font-bold text-slate-500 uppercase">
                        {month}
                      </span>
                      <span className="block text-2xl font-bold text-primary leading-none">
                        {day}
                      </span>
                    </div>
                    <img
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={
                        event.mainImage ||
                        "https://images.unsplash.com/photo-1544161515-4af6b1d8c114?q=80&w=2670&auto=format&fit=crop"
                      }
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-accent font-bold mb-3 uppercase">
                      <span className="material-symbols-outlined text-sm">
                        {meta.icon}
                      </span>
                      <span>{meta.label}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 font-body">
                      {event.description}
                    </p>
                    <div className="mt-auto">
                      <Link
                        className="inline-flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                        href="/events"
                      >
                        Read More{" "}
                        <span className="material-symbols-outlined text-sm ml-1">
                          chevron_right
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 md:hidden text-center">
          <Link
            className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-bold text-sm transition-colors"
            href="/events"
          >
            View All Events{" "}
            <span className="material-symbols-outlined text-lg">
              arrow_right_alt
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
