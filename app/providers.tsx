"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { createQueryClient } from "@/lib/query-client";
import { MSWProvider } from "./components/MSWProvider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * 클라이언트 프로바이더 래퍼
 * - MSW Provider (개발 환경에서 API 모킹)
 * - React Query Provider
 * - 개발 도구 (개발 환경에서만 표시)
 */
export function Providers({ children }: ProvidersProps) {
  // useState로 QueryClient 인스턴스 유지 (SSR 호환)
  const [queryClient] = useState(() => createQueryClient());

  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MSWProvider>
  );
}
