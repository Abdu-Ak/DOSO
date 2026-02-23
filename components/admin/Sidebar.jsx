"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Calendar,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react";
import { signOut } from "next-auth/react";

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-primary text-white shadow-lg shadow-primary/25"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary"
    }`}
  >
    <Icon
      size={22}
      className={
        active ? "text-white" : "group-hover:scale-110 transition-transform"
      }
    />
    {!collapsed && <span className="font-semibold text-sm">{label}</span>}
  </Link>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out relative flex flex-col h-screen ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <School className="text-primary" size={24} />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Admin<span className="text-primary">Panel</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <SidebarItem
          icon={Home}
          label="Visit Site"
          href="/"
          active={false}
          collapsed={collapsed}
        />
        <div className="my-4 border-t border-slate-100 dark:border-slate-800 mx-2" />
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-semibold text-sm"
        >
          <LogOut size={22} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-20"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
