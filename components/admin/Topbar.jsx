"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, Menu, Globe, ArrowLeft, LogOut } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import CustomTooltip from "./ui/CustomTooltip";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Topbar = ({ onMenuClick }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;

  const getPageTitle = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 1 && parts[0] === "admin") return "Dashboard";

    // Handle admin/users/... paths
    if (parts[0] === "admin" && parts[1] === "users") {
      const lastPart = parts[parts.length - 1];
      if (lastPart === "create") return "User / Create";
      if (lastPart === "edit") return "User / Edit";
      if ((parts.length > 3 && !isNaN(parts[2])) || parts[2]?.length > 20) {
        // Simple check for ID
        return "User / Details";
      }
    }

    const lastPart = parts[parts.length - 1];
    return (
      lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, " ")
    );
  };

  const isNestedPage = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 2;
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

        <div className="flex items-center gap-2">
          {isNestedPage() && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-body! font-bold text-slate-800 dark:text-white truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 ml-2 pl-4">
          <CustomTooltip content="Visit Site">
            <button
              onClick={() => router.push("/")}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              <Globe size={22} />
            </button>
          </CustomTooltip>

          <CustomTooltip content="Theme Switch">
            <div>
              <ThemeToggle />
            </div>
          </CustomTooltip>

          <CustomTooltip content="Notifications">
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
            </button>
          </CustomTooltip>

          <Link
            href={
              user?._id || user?.id
                ? `/admin/users/${user?._id || user?.id}`
                : "/admin/profile"
            }
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <User size={20} className="text-primary" />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[100px]">
                {user?.name || "Admin User"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
