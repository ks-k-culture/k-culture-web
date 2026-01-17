import { memo } from "react";

import Link from "next/link";

import { DoDreamLogo } from "@/components/common";
import {
  BookmarkIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  LogoutIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from "@/components/common/Misc/Icons";

const ACTOR_NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: HomeIcon },
  { href: "/profile", label: "내 프로필", icon: UserIcon },
  { href: "/favorites", label: "찜 목록", icon: HeartIcon },
  { href: "/settings", label: "설정", icon: SettingsIcon },
] as const;

const AGENCY_NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: HomeIcon },
  { href: "/actor-search", label: "배우 검색", icon: SearchIcon },
  { href: "/projects", label: "프로젝트", icon: FolderIcon },
  { href: "/favorites", label: "찜 목록", icon: HeartIcon },
  { href: "/settings", label: "설정", icon: SettingsIcon },
] as const;

const ADMIN_NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: HomeIcon },
  { href: "/admin/notices", label: "공지사항 관리", icon: BookmarkIcon },
  { href: "/settings", label: "설정", icon: SettingsIcon },
] as const;

interface DashboardSidebarProps {
  userType: "actor" | "agency" | "admin";
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const DashboardSidebar = memo(function DashboardSidebar({
  userType,
  pathname,
  isOpen,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const navItems = userType === "admin" ? ADMIN_NAV_ITEMS : userType === "agency" ? AGENCY_NAV_ITEMS : ACTOR_NAV_ITEMS;

  return (
    <aside
      className={`bg-luxury-secondary border-border fixed z-50 h-full w-64 flex-col border-r transition-transform duration-300 ease-in-out lg:static ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } lg:flex`}
    >
      <div className="border-border flex items-center justify-between border-b p-6">
        <Link href="/">
          <DoDreamLogo size="md" />
        </Link>
        <button
          onClick={onClose}
          className="text-muted-gray hover:text-ivory focus-visible:ring-gold/50 rounded-lg p-2 transition-colors focus:outline-none focus-visible:ring-2 lg:hidden"
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`focus-visible:ring-gold/50 flex items-center gap-3 rounded-xl px-4 py-3 transition-all focus:outline-none focus-visible:ring-2 ${
                    isActive ? "bg-gold/10 text-gold" : "text-muted-gray hover:bg-luxury-tertiary hover:text-ivory"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-border border-t p-4">
        <button
          onClick={onLogout}
          className="text-muted-gray hover:bg-luxury-tertiary flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
        >
          <LogoutIcon className="h-5 w-5" />
          <span className="font-medium">로그아웃</span>
        </button>
      </div>
    </aside>
  );
});
