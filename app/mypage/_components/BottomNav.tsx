"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SparklesIcon, BookmarkIcon, UserIcon } from "@/app/components/Icons";
import { COLORS } from "@/lib/constants";

const navItems = [
  { href: "/", icon: HomeIcon, label: "홈" },
  { href: "/recommend", icon: SparklesIcon, label: "AI매칭" },
  { href: "/favorites", icon: BookmarkIcon, label: "찜목록" },
  { href: "/mypage", icon: UserIcon, label: "마이페이지" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-2"
              style={{ color: isActive ? COLORS.text.primary : COLORS.text.disabled }}
            >
              <Icon className="w-6 h-6" />
              <span className={`text-xs ${isActive ? "font-medium" : ""}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
