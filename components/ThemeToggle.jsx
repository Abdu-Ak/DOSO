"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
      aria-label="Toggle Theme"
    >
      <span className="material-symbols-outlined text-2xl">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
