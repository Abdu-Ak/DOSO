"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  User,
  Menu,
  Globe,
  ArrowLeft,
  LogOut,
  ChevronDown,
  QrCode,
  UserPen,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import CustomTooltip from "./ui/CustomTooltip";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NotificationsPanel from "./NotificationsPanel";
import RegistrationQRModal from "./RegistrationQRModal";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

const Topbar = ({ onMenuClick }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const notifRef = useRef(null);

  const user = session?.user;
  const userId = user?._id || user?.id;

  const { data: notifData } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");
      return res.data;
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: false, // Stop polling when tab is hidden
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    staleTime: 30000, // Consider data fresh for 30s to avoid redundant fetches
  });

  const notifCount = notifData?.count || 0;

  // Close notifications panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 1 && parts[0] === "admin") return "Dashboard";

    if (parts[0] === "admin" && parts[1] === "users") {
      const lastPart = parts[parts.length - 1];
      if (lastPart === "create") return "User / Create";
      if (lastPart === "edit") return "User / Edit";
      if ((parts.length > 3 && !isNaN(parts[2])) || parts[2]?.length > 20) {
        return "User / Details";
      }
    }

    if (parts[0] === "admin" && parts[1] === "students") {
      const lastPart = parts[parts.length - 1];
      if (lastPart === "create") return "Students / Create";
      if (lastPart === "edit") return "Students / Edit";
      if (parts.length > 3 || (parts[2] && parts[2].length > 15)) {
        return "Students / Details";
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
    <header className="h-20 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 md:px-6 sticky top-0 z-30 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2 md:gap-4">
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
              className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-body! font-bold text-slate-800 dark:text-white truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 ml-2 pl-2 md:pl-4">
          <div className="hidden md:flex items-center">
            <CustomTooltip content="Registration QR">
              <button
                onClick={() => setShowQRModal(true)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <QrCode size={22} />
              </button>
            </CustomTooltip>

            <CustomTooltip content="Visit Site">
              <button
                onClick={() => router.push("/")}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
              >
                <Globe size={22} />
              </button>
            </CustomTooltip>
          </div>

          <CustomTooltip content="Theme Switch">
            <div>
              <ThemeToggle />
            </div>
          </CustomTooltip>

          <div className="relative" ref={notifRef}>
            <CustomTooltip content="Notifications">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative cursor-pointer"
              >
                <Bell size={22} />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white leading-none">
                      {notifCount > 9 ? "9+" : notifCount}
                    </span>
                  </span>
                )}
              </button>
            </CustomTooltip>
            {showNotifications && (
              <NotificationsPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group shrink-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
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
                <ChevronDown
                  size={14}
                  className="hidden md:block text-slate-400 group-hover:text-primary transition-colors duration-300"
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile actions"
              className="p-2 min-w-[200px]"
              itemClasses={{
                base: "rounded-lg gap-3 px-3",
              }}
            >
              <DropdownItem
                key="profile"
                startContent={<User size={18} />}
                onPress={() => router.push(`/admin/users/${userId}`)}
                className="font-bold"
              >
                View Profile
              </DropdownItem>
              <DropdownItem
                key="edit"
                startContent={<UserPen size={18} />}
                onPress={() => router.push(`/admin/users/${userId}/edit`)}
                className="font-bold"
              >
                Edit Profile
              </DropdownItem>
              <DropdownItem
                key="qr"
                startContent={<QrCode size={18} />}
                onPress={() => setShowQRModal(true)}
                className="font-bold md:hidden"
              >
                Registration QR
              </DropdownItem>
              <DropdownItem
                key="site"
                startContent={<Globe size={18} />}
                onPress={() => router.push("/")}
                className="font-bold md:hidden"
              >
                Visit Site
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger font-bold"
                startContent={<LogOut size={18} />}
                onPress={() => signOut()}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <RegistrationQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </header>
  );
};

export default Topbar;
