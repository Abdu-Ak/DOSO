"use client";

import React from "react";
import { User, LogOut, ChevronDown, Box, HeartHandshake } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import Link from "next/link";
import Logo from "./Logo";

const ICON_MAP = {
  Box: Box,
  HeartHandshake: HeartHandshake,
};

const UserTopbar = ({ menus = [] }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const userId = user?._id || user?.id;
  const role = user?.role;

  const portalTitle = role === "student" ? "Student Portal" : "Alumni Portal";

  return (
    <header className="h-20 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-8">
        <Link href={`/${role}/profile`} className="flex items-center gap-2">
          <Logo imgClassName="w-10 h-10" />
          <span className="text-xl font-bold text-slate-800 dark:text-white">
            DOSO
          </span>
        </Link>

        {/* Custom Menus */}
        <nav className="hidden md:flex items-center gap-6">
          {menus.map((menu, index) => (
            <Link
              key={index}
              href={menu.href}
              className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors uppercase tracking-wider"
            >
              {menu.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

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
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                  {role}
                </p>
              </div>
              <ChevronDown
                size={14}
                className="text-slate-400 group-hover:text-primary transition-colors duration-300"
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
            {/* Mobile Menus */}
            {menus.map((menu, index) => {
              const Icon = ICON_MAP[menu.icon];
              return (
                <DropdownItem
                  key={`mobile-menu-${index}`}
                  startContent={Icon && <Icon size={18} />}
                  onPress={() => router.push(menu.href)}
                  className="font-bold md:hidden"
                >
                  {menu.label}
                </DropdownItem>
              );
            })}

            {menus.length > 0 && (
              <DropdownItem
                key="divider"
                isReadOnly
                className="md:hidden p-0 h-px bg-slate-100 dark:bg-slate-800"
              />
            )}

            <DropdownItem
              key="profile"
              startContent={<User size={18} />}
              onPress={() => router.push(`/${role}/profile`)}
              className="font-bold"
            >
              My Profile
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
    </header>
  );
};

export default UserTopbar;
