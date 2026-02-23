"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@heroui/toast";
import { HeroUIProvider } from "@heroui/system";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastProvider />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
