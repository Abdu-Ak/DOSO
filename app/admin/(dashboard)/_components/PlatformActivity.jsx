import React from "react";
import { UserCheck } from "lucide-react";

const PlatformActivity = () => {
  // Static placeholders for now as requested
  const activities = [
    {
      title: "New Student Registration",
      description: "Muhammed Ali joined as a new student.",
      time: "2 hours ago",
    },
    {
      title: "Application Approved",
      description: "Hiba's alumni application has been approved.",
      time: "5 hours ago",
    },
    {
      title: "New Admin Added",
      description: "A new system administrator was created.",
      time: "Yesterday",
    },
    {
      title: "Batch Update",
      description: "Alumni batch of 2023 was successfully verified.",
      time: "2 days ago",
    },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Platform Activity
        </h3>
      </div>
      <div className="space-y-6">
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <UserCheck
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
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformActivity;
