"use client";

import { useCallback, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { DoDreamLogo } from "@/components/common";
import { MenuIcon } from "@/components/common/Misc/Icons";

import { useAuthStore } from "@/stores/useAuthStore";

import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const storeUserType = useAuthStore((state) => state.userType);

  const userType = storeUserType ?? "actor";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    queryClient.clear();
    logout();
    router.push("/login");
  }, [queryClient, logout, router]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="bg-luxury-black flex min-h-screen">
      {isMobileMenuOpen && (
        <div className="bg-luxury-black/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden" onClick={closeMobileMenu} />
      )}

      <DashboardSidebar
        userType={userType}
        pathname={pathname}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onLogout={handleLogout}
      />

      <main className="min-h-screen flex-1 lg:ml-64">
        <div className="bg-luxury-secondary border-border sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-muted-gray hover:text-ivory focus-visible:ring-gold/50 rounded-lg p-2 transition-colors focus:outline-none focus-visible:ring-2"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <DoDreamLogo size="sm" />
        </div>
        <div className="mx-auto w-full max-w-5xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
