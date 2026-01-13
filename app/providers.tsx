"use client";

import { type ReactNode, useEffect, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/ui";

import { MSWProvider } from "@/components/common";

import { createQueryClient } from "@/lib/query-client";

import { useAuthStore } from "@/stores/useAuthStore";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MSWProvider>
  );
}
