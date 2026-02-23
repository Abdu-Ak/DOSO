"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { School, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  // { label: "About Us", href: "/about" },
  { label: "Alumni", href: "/alumni" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-surface-light dark:bg-surface-dark shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <School className="text-primary" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Darul Hidaya<span className="text-primary">Dars</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {NAV_ITEMS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative font-medium transition-colors pb-1
                    ${
                      active
                        ? "text-primary font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
                    }
                    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary
                    after:transition-transform after:duration-200
                    ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
                  `}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Login */}
            <Link
              href="/login"
              className="hidden md:block bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm text-center"
            >
              Login
            </Link>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 dark:border-slate-800 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-surface-light dark:bg-surface-dark">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="pt-4 px-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
