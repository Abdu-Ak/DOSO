"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserTopbar from "@/components/UserTopbar";
import { useSession } from "next-auth/react";

export default function AlumniLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const alumniMenus = [
    { label: "Sundook", href: "/alumni/sundook", icon: "Box" },
    { label: "Welfare", href: "/alumni/welfare", icon: "HeartHandshake" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "alumni") {
      // Redirect to appropriate portal if role doesn't match
      if (
        session.user.role === "admin" ||
        session.user.role === "super_admin"
      ) {
        router.push("/admin");
      } else if (session.user.role === "student") {
        router.push("/student/profile");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "alumni") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <UserTopbar menus={alumniMenus} />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
