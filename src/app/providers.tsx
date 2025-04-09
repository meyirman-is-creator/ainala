"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </Provider>
  );
}