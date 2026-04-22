import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  bgColor,
  iconColor,
  isLoading,
  extra,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group min-h-[140px] flex flex-col justify-center gap-4">
      <div className="flex items-center gap-4">
        <div
          className={`p-3.5 rounded-2xl ${bgColor} transition-all duration-300 group-hover:scale-110 shrink-0`}
        >
          <Icon className={iconColor} size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold truncate mb-0.5">
            {title}
          </h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
            {value}
          </p>
        </div>
      </div>
      {extra && <div className="mt-1">{extra}</div>}
    </div>
  );
};

export default StatCard;
