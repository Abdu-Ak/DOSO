import React from "react";
import { Calendar, Images, ArrowRight } from "lucide-react";

export default function EventCard({
  title,
  date,
  category,
  description,
  image,
  photoCount,
  categoryColor = "primary",
}) {
  const categoryColors = {
    primary: "bg-primary",
    purple: "bg-purple-600",
    amber: "bg-amber-600",
    emerald: "bg-emerald-600",
  };

  return (
    <div className="group bg-white dark:bg-neutral-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        <div className="absolute top-4 left-4">
          <span
            className={`${categoryColors[categoryColor]} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90`}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">
          <Calendar size={14} className="text-primary" />
          {date}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Images size={14} />
            {photoCount} Photos
          </span>
          <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            View Gallery <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
