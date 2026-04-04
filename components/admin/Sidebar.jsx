"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Box,
  HeartHandshake,
} from "lucide-react";
import Logo from "../Logo";
import CustomTooltip from "./ui/CustomTooltip";
const SidebarItem = ({ icon: Icon, label, href, active, collapsed }) => {
  const content = (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
        active
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary"
      } ${collapsed ? "justify-center px-0 mx-auto w-12" : ""}`}
    >
      <Icon
        size={22}
        className={`${
          active ? "text-white" : "group-hover:scale-110 transition-transform"
        } shrink-0`}
      />
      {!collapsed && (
        <span className="font-semibold text-sm truncate">{label}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <CustomTooltip content={label} placement="right">
        {content}
      </CustomTooltip>
    );
  }

  return content;
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      label: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Students List",
      href: "/admin/students",
      icon: Users,
    },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Sundook", href: "/admin/sundook", icon: Box },
    { label: "Welfare", href: "/admin/welfare", icon: HeartHandshake },
    { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquareText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isMenuItemActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out relative flex flex-col h-screen ${
        collapsed ? "w-24" : "w-56"
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`h-20 flex items-center transition-all duration-300 ${collapsed ? "justify-center px-0" : "px-6"} border-b border-slate-200 dark:border-slate-800`}
      >
        <div
          className={`flex items-center gap-3 overflow-hidden whitespace-nowrap ${collapsed ? "justify-center" : ""}`}
        >
          <Logo imgClassName="w-10 h-10" />
          {!collapsed && (
            <span className="text-xl font-body! font-bold text-slate-900 dark:text-white tracking-tight">
              Admin<span className="text-primary">Panel</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
        {NAV_ITEMS.filter(
          (item) => !item.roles || item.roles.includes(userRole),
        ).map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={isMenuItemActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-40"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
