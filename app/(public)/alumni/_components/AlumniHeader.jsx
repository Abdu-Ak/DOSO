import React from "react";

export default function AlumniHeader() {
  return (
    <header className="bg-surface-light dark:bg-surface-dark pt-12 pb-12 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Our Alumni Network
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Connect with former students of Darul Hidaya Dars. Our community is
          spread across the globe, contributing to various fields with
          excellence and integrity.
        </p>
      </div>
    </header>
  );
}
