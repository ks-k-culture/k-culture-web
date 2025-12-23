"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@/app/components/Icons";
import { PageLayout } from "@/app/components/PageLayout";
import { COLORS } from "@/lib/constants";

type NotificationType = "all" | "casting" | "feed" | "system";

interface Notification {
  id: string;
  type: "casting" | "feed" | "system";
  icon: "bell" | "heart" | "megaphone";
  title: string;
  description: string;
  date: string;
  isRead: boolean;
}

// 목업 데이터
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "casting",
    icon: "bell",
    title: "[캐스팅 제안] 'xx감독의 신작'",
    description: "새로운 캐스팅 제안이 도착했어요.",
    date: "2025.12.18",
    isRead: false,
  },
  {
    id: "2",
    type: "feed",
    icon: "heart",
    title: "[캐스팅 제안] 'xx감독의 신작'",
    description: "회원님의 포트폴리오를 확인했습니다.",
    date: "2025.12.18",
    isRead: false,
  },
  {
    id: "3",
    type: "system",
    icon: "megaphone",
    title: "[공지] 서비스 점검이 예상됩니다.",
    description: "더 나은 서비스를 위해 점검을 진행하겠...",
    date: "2025.12.18",
    isRead: false,
  },
  {
    id: "4",
    type: "system",
    icon: "megaphone",
    title: "[공지] 서비스 점검이 예상됩니다.",
    description: "더 나은 서비스를 위해 점검을 진행하겠...",
    date: "2025.12.18",
    isRead: true,
  },
  {
    id: "5",
    type: "system",
    icon: "megaphone",
    title: "[공지] 서비스 점검이 예상됩니다.",
    description: "더 나은 서비스를 위해 점검을 진행하겠...",
    date: "2025.12.18",
    isRead: true,
  },
  {
    id: "6",
    type: "system",
    icon: "megaphone",
    title: "[공지] 서비스 점검이 예상됩니다.",
    description: "더 나은 서비스를 위해 점검을 진행하겠...",
    date: "2025.12.18",
    isRead: true,
  },
];

const tabs: { key: NotificationType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "casting", label: "캐스팅" },
  { key: "feed", label: "피드" },
  { key: "system", label: "시스템" },
];

function NotificationIcon({ type }: { type: "bell" | "heart" | "megaphone" }) {
  if (type === "bell") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F4FD" }}>
        <svg
          className="w-5 h-5"
          style={{ color: COLORS.accent.blue }}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </div>
    );
  }
  if (type === "heart") {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FEE8E8" }}>
        <svg className="w-5 h-5" style={{ color: COLORS.accent.red }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
      <svg
        className="w-5 h-5"
        style={{ color: COLORS.text.secondary }}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
        />
      </svg>
    </div>
  );
}

// 오늘 날짜를 포맷팅하는 함수
function formatDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weekday = weekdays[today.getDay()];
  return `${year}.${month}.${day} ${weekday}`;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationType>("all");
  const [notifications] = useState<Notification[]>(mockNotifications);

  const filteredNotifications = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  return (
    <PageLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
            </Link>
            <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
              알림
            </h1>
          </div>
          <span className="text-sm" style={{ color: COLORS.text.secondary }}>
            {formatDate()}
          </span>
        </div>

        {/* 탭 */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: COLORS.background.secondary }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.key ? "bg-white shadow-md" : ""
                }`}
                style={{
                  color: activeTab === tab.key ? COLORS.text.primary : COLORS.text.secondary,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1">
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-32">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#D1D6DB" }}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-medium" style={{ color: COLORS.text.secondary }}>
              등록된 알림이 없어요
            </p>
          </div>
        ) : (
          /* 알림 리스트 */
          <div className="divide-y" style={{ borderColor: COLORS.border.default }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 px-5 py-4"
                style={{ opacity: notification.isRead ? 0.5 : 1 }}
              >
                <NotificationIcon type={notification.icon} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1" style={{ color: COLORS.text.primary }}>
                    {notification.title}
                  </p>
                  <p className="text-sm truncate" style={{ color: COLORS.text.secondary }}>
                    {notification.description}
                  </p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: COLORS.text.muted }}>
                  {notification.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageLayout>
  );
}
