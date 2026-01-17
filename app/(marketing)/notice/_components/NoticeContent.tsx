"use client";

import Link from "next/link";

import { EmptyState, Spinner } from "@/components/ui";

import { MarketingLayout } from "@/components/common/Layout";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/useAuthStore";

import type { NoticeSummary } from "@/src/model";
import { useGetNotices, useGetReadNoticeIds } from "@/src/notices/notices";

interface NoticeItemProps {
  notice: NoticeSummary;
  isRead: boolean;
}

function NoticeItem({ notice, isRead }: NoticeItemProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  };

  return (
    <Link href={`/notice/${notice.id}`}>
      <div
        className={cn(
          "border-border hover:bg-luxury-black/50 -mx-4 flex cursor-pointer items-center gap-4 border-b px-4 py-5 transition-colors",
          isRead && "opacity-60"
        )}
      >
        <span className="shrink-0 rounded-full border border-orange-500 px-4 py-1.5 text-sm text-orange-500">
          {notice.type}
        </span>
        <h3 className={cn("flex-1 font-medium", isRead ? "text-muted-gray" : "text-white")}>{notice.title}</h3>
        {isRead && <span className="text-muted-gray shrink-0 text-xs">읽음</span>}
        <span className="text-muted-gray shrink-0 text-sm">{formatDate(notice.createdAt)}</span>
      </div>
    </Link>
  );
}

export function NoticeContent() {
  const { isAuthenticated } = useAuthStore();
  const { data: noticesData, isLoading } = useGetNotices();
  const { data: readNoticesData } = useGetReadNoticeIds({
    query: { enabled: isAuthenticated },
  });

  const notices = noticesData?.data?.notices || [];
  const readNoticeIds = new Set(readNoticesData?.data || []);

  return (
    <MarketingLayout>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">공지사항</h1>
          <Link href="/faq" className="text-muted-gray hover:text-gold flex items-center gap-2 transition-colors">
            자주 묻는 질문
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="bg-luxury-black/30 border-border rounded-2xl border p-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : notices.length === 0 ? (
            <EmptyState description="등록된 공지사항이 없습니다" />
          ) : (
            notices.map((notice) => (
              <NoticeItem key={notice.id} notice={notice} isRead={readNoticeIds.has(notice.id)} />
            ))
          )}
        </div>
      </main>
    </MarketingLayout>
  );
}
