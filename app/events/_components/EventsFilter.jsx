"use client";

import { AlignHorizontalDistributeCenter, Calendar, RotateCcw, Search } from "lucide-react";
import React, { useState } from "react";


export default function EventsFilter() {
  const [year, setYear] = useState("All Years");
  const [category, setCategory] = useState("All Categories");

  const handleReset = () => {
    setYear("All Years");
    setCategory("All Categories");
  };

  return (
    <div className="bg-white dark:bg-neutral-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-12 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-24 z-30 transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {/* Year Filter */}
        <div className="relative group w-full sm:w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors">
            <Calendar size={16} />
          </span>
          <select
            className="form-select pl-10 pr-10 py-2.5 w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-primary text-sm font-medium shadow-sm transition-all cursor-pointer"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option>All Years</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Category Filter */}
        <div className="relative group w-full sm:w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors">
            <AlignHorizontalDistributeCenter size={16} />
          </span>
          <select
            className="form-select pl-10 pr-10 py-2.5 w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-primary text-sm font-medium shadow-sm transition-all cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Academic</option>
            <option>Cultural</option>
            <option>Religious</option>
            <option>Sports</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex gap-3 w-full md:w-auto justify-end">
        <button
          onClick={handleReset}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2">
          <Search size={16} />
          Find Events
        </button>
      </div>
    </div>
  );
}
