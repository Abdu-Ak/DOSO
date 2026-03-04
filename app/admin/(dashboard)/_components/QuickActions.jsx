import React from "react";
import Link from "next/link";
import { UserPlus, Calendar, Mail, FileText } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Add User",
      icon: UserPlus,
      href: "/admin/users/create",
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "hover:border-primary",
    },
    {
      title: "New Event",
      icon: Calendar,
      href: "#",
      color: "text-accent",
      bgColor: "bg-accent/5",
      borderColor: "hover:border-accent",
    },
    {
      title: "Send News",
      icon: Mail,
      href: "#",
      color: "text-purple-500",
      bgColor: "bg-purple-500/5",
      borderColor: "hover:border-purple-500",
    },
    {
      title: "Settings",
      icon: FileText,
      href: "#",
      color: "text-amber-500",
      bgColor: "bg-amber-500/5",
      borderColor: "hover:border-amber-500",
    },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all group ${action.borderColor} ${action.bgColor.replace("/5", "/10")}`}
          >
            <action.icon
              className={`${action.color} mb-3 group-hover:scale-110 transition-transform`}
              size={28}
            />
            <span className="text-sm font-bold text-slate-800 dark:text-white text-center">
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
