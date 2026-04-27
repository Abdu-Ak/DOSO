"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
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
  User,
  MessageSquare,
  MessageSquareX,
  Settings,
  Box,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { formatDateRelative } from "@/lib/utils";
import Link from "next/link";

const iconMap = {
  UserCheck,
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
  User,
  MessageSquare,
  MessageSquareX,
  Settings,
  Box,
};

const PlatformActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/activities/recent");
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-6 flex justify-between items-center gap-3 border-b border-slate-100 dark:border-slate-800 mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
          Platform Activity
        </h3>

        <Link
          href="/admin/activity-log"
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          View All <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="flex-1 px-6 overflow-y-auto space-y-6 mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => {
            const IconComponent = iconMap[activity.icon] || UserCheck;
            return (
              <div key={activity._id} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <IconComponent
                    className="text-slate-600 dark:text-slate-400"
                    size={18}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.description}
                  </p>
                  <span className="text-xs text-slate-400 font-medium mt-2 block tracking-wider uppercase">
                    {formatDateRelative(activity.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">
              No recent activities found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformActivity;
