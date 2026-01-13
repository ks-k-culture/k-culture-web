"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui";

import { useAuthStore } from "@/stores/useAuthStore";

interface DashboardGroupLayoutProps {
  children: React.ReactNode;
}

export default function DashboardGroupLayout({ children }: DashboardGroupLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="bg-luxury-black flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
