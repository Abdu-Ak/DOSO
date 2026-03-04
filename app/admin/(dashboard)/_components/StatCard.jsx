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
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl ${bgColor} transition-all duration-300 group-hover:scale-110`}
        >
          <Icon className={iconColor} size={24} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
            <TrendingUp size={14} />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
