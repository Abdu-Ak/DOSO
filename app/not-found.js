"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark bg-islamic-pattern py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Ornaments (consistent with Login page) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-1000 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -ml-48 -mb-48 transition-all duration-1000 animate-pulse delay-700"></div>

      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-slate-900 dark:text-white tracking-tighter mosque-title-gradient">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            Page Not Found
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto text-lg leading-relaxed">
            The path you followed seems to have led you astray. Let's get you
            back to safety.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="group flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold px-6 py-3 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Brand/Footer */}
        <div className="pt-12 text-slate-400 dark:text-slate-600">
          <p className="text-sm font-medium tracking-[0.2em] uppercase">
            Darul Hidaya<span className="text-primary">Dars</span>
          </p>
        </div>
      </div>
    </div>
  );
}
