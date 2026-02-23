"use client";

import React, { useState } from "react";
import { Search, RefreshCw } from "lucide-react";

export default function SearchFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchYear, setBatchYear] = useState("All Batches");
  const [industry, setIndustry] = useState("All Industries");

  const handleReset = () => {
    setSearchTerm("");
    setBatchYear("All Batches");
    setIndustry("All Industries");
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Search Alumni
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={20} />
            </span>
            <input
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-background-dark text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
              placeholder="Search by name, company, or location..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Batch Filter */}
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Batch Year
          </label>
          <select
            className="block w-full py-3 pl-3 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm cursor-pointer"
            value={batchYear}
            onChange={(e) => setBatchYear(e.target.value)}
          >
            <option>All Batches</option>
            <option>Class of 2023</option>
            <option>Class of 2022</option>
            <option>Class of 2021</option>
            <option>Class of 2020</option>
            <option>Class of 2019</option>
          </select>
        </div>

        {/* Occupation Filter */}
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Field / Industry
          </label>
          <select
            className="block w-full py-3 pl-3 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm cursor-pointer"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option>All Industries</option>
            <option>Islamic Studies</option>
            <option>Education</option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Business</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-1 flex justify-center md:justify-start pb-1">
          <button
            onClick={handleReset}
            className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
