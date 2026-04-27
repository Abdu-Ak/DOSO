"use client";

import React from "react";
import {
  UserPlus,
  UserMinus,
  UserCog,
  CheckCircle,
  XCircle,
  Trash2,
  CalendarPlus,
  Calendar,
  CalendarX,
  HeartHandshake,
  User as UserIcon,
  MessageSquare,
  MessageSquareX,
  Settings as SettingsIcon,
  Box,
  Loader2,
  Search,
} from "lucide-react";
import { formatDateRelative } from "@/lib/utils";

const iconMap = {
  UserPlus,
  UserMinus,
  UserCog,
  CheckCircle,
  XCircle,
  Trash2,
  CalendarPlus,
  Calendar,
  CalendarX,
  HeartHandshake,
  User: UserIcon,
  MessageSquare,
  MessageSquareX,
  Settings: SettingsIcon,
  Box,
};

const ActivityList = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
        <Search size={48} className="mb-4 opacity-20" />
        <p>No activity logs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {activities.map((activity) => {
        const IconComponent = iconMap[activity.icon] || UserIcon;
        return (
          <div
            key={activity._id}
            className="p-4 md:p-6 flex gap-3 md:gap-4 items-start hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <IconComponent
                className="text-slate-600 dark:text-slate-400"
                size={18}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <p className="text-sm md:text-base font-bold text-slate-800 dark:text-white truncate">
                  {activity.title}
                </p>
                <span className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wider uppercase">
                  {formatDateRelative(activity.createdAt)}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 md:line-clamp-none">
                {activity.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    {activity.adminId?.image ? (
                      <img
                        src={activity.adminId.image}
                        alt={activity.adminId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center text-[10px] text-primary-600 font-bold">
                        {activity.adminId?.name?.charAt(0) || "A"}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[100px] md:max-w-none">
                    {activity.adminId?.name || "Unknown Admin"}
                  </span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">
                  •
                </span>
                <span className="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                  {activity.module}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;
