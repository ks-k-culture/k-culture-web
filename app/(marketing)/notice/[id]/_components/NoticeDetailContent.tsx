"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Badge, Button, Card, Spinner } from "@/components/ui";

import { ArrowLeftIcon, EyeIcon, MarketingLayout } from "@/components/common";

import { useAuthStore } from "@/stores/useAuthStore";

import { useGetNoticeDetail, useMarkNoticeAsRead } from "@/src/notices/notices";

const getNoticeTypeStyle = (type: string) => {
  const styles: Record<string, string> = {
    공지: "border-orange-400/20 bg-orange-400/10 text-orange-400",
    이벤트: "border-green-400/20 bg-green-400/10 text-green-400",
    업데이트: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    점검: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
  };
  return styles[type] || styles["공지"];
};

export function NoticeDetailContent() {
  const params = useParams();
  const router = useRouter();
  const noticeId = params.id as string;
  const { isAuthenticated } = useAuthStore();

  const { data: noticeData, isLoading } = useGetNoticeDetail(noticeId);
  const { mutate: markAsRead } = useMarkNoticeAsRead();
  const notice = noticeData?.data;

  useEffect(() => {
    if (isAuthenticated && noticeId) {
      markAsRead({ noticeId });
    }
  }, [isAuthenticated, noticeId, markAsRead]);

  if (isLoading) {
    return (
      <MarketingLayout showFooterGradient={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MarketingLayout>
    );
  }

  if (!notice) {
    return (
      <MarketingLayout>
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-ivory mb-4 text-2xl font-bold">공지사항을 찾을 수 없습니다</h2>
          <p className="text-muted-gray mb-8">삭제되었거나 존재하지 않는 공지사항입니다</p>
          <Link href="/notice">
            <Button variant="gold">목록으로 돌아가기</Button>
          </Link>
        </main>
      </MarketingLayout>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <MarketingLayout>
      <main className="mx-auto max-w-3xl px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-muted-gray hover:text-ivory mb-6 flex items-center gap-2 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>목록으로</span>
        </button>

        <Card className="bg-luxury-secondary border-border overflow-hidden">
          <div className="p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={getNoticeTypeStyle(notice.type)}>
                {notice.type}
              </Badge>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-white md:text-3xl">{notice.title}</h1>

            <div className="text-muted-gray mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span>{formatDate(notice.createdAt)}</span>
              {notice.views !== undefined && (
                <span className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  조회 {notice.views.toLocaleString()}
                </span>
              )}
            </div>

            <div className="border-border border-t pt-8">
              <div className="prose prose-invert max-w-none">
                <div className="text-warm-gray leading-relaxed whitespace-pre-wrap">{notice.content}</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 flex justify-center">
          <Link href="/notice">
            <Button variant="outline">목록으로 돌아가기</Button>
          </Link>
        </div>
      </main>
    </MarketingLayout>
  );
}
