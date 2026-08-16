"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

import { AuthProvider } from "./auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5_000, refetchOnWindowFocus: false, retry: 1 },
        },
      })
  );

  return (
    <AuthProvider>
      <QueryClientProvider client={client}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </QueryClientProvider>
    </AuthProvider>
  );
}
