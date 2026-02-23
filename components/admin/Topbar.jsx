"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, User, Menu } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

const Topbar = ({ onMenuClick }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart === "admin") return "Dashboard";
    return (
      lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, " ")
    );
  };

  return (
    <header className="h-20 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 ml-2 pl-4">
          <ThemeToggle />

          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
          </button>

          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <User size={20} className="text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Admin User
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
