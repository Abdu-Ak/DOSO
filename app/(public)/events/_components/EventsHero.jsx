import React from "react";

export default function EventsHero() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary dark:text-blue-300 text-xs font-semibold mb-4 uppercase tracking-wider">
        Our Community
      </span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
        Events & Activities Gallery
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Exploring the vibrant life at Darul Hidaya Dars through our academic
        gatherings, cultural festivals, and spiritual assemblies.
      </p>
    </div>
  );
}
