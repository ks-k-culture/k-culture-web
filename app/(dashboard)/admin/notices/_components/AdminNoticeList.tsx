"use client";

import Link from "next/link";

import { Badge, Button, Card, Spinner } from "@/components/ui";

import { useConfirmDialog } from "@/components/common";

import { cn } from "@/lib/utils";

import { useDeleteNotice } from "@/src/admin/admin";
import type { NoticeSummary } from "@/src/model";
import { useGetNotices } from "@/src/notices/notices";

const getNoticeTypeStyle = (type: string) => {
  const styles: Record<string, string> = {
    일반공지: "border-orange-400/20 bg-orange-400/10 text-orange-400",
    이벤트: "border-green-400/20 bg-green-400/10 text-green-400",
    업데이트: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    점검: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
  };
  return styles[type] || styles["일반공지"];
};

function NoticeRow({ notice, onDelete }: { notice: NoticeSummary; onDelete: (id: string) => void }) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="border-border flex items-center gap-4 border-b py-4">
      <Badge variant="outline" className={cn("shrink-0", getNoticeTypeStyle(notice.type))}>
        {notice.type}
      </Badge>
      <div className="flex-1">
        <h3 className="font-medium text-white">{notice.title}</h3>
        <p className="text-muted-gray text-sm">{formatDate(notice.createdAt)}</p>
      </div>
      <div className="flex gap-2">
        <Link href={`/admin/notices/${notice.id}/edit`}>
          <Button variant="outline" size="sm">
            수정
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-red-400 hover:text-red-300"
          onClick={() => onDelete(notice.id)}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}

export function AdminNoticeList() {
  const { data: noticesData, isLoading, refetch } = useGetNotices();
  const { mutate: deleteNotice } = useDeleteNotice();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const notices = noticesData?.data?.notices || [];

  const handleDelete = async (noticeId: string) => {
    const confirmed = await confirm({
      title: "공지사항 삭제",
      description: "이 공지사항을 삭제하시겠습니까? 삭제된 공지사항은 복구할 수 없습니다.",
      confirmText: "삭제",
      variant: "danger",
    });

    if (confirmed) {
      deleteNotice(
        { noticeId },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Card className="bg-luxury-secondary border-border p-6">
        {notices.length === 0 ? (
          <div className="text-muted-gray py-12 text-center">등록된 공지사항이 없습니다</div>
        ) : (
          <div className="divide-y-0">
            {notices.map((notice) => (
              <NoticeRow key={notice.id} notice={notice} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </Card>
      {ConfirmDialog}
    </>
  );
}
