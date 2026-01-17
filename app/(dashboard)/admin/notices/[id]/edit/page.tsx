"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Button, Card, Input, Spinner, Textarea } from "@/components/ui";

import { DashboardLayout, PageHeader } from "@/components/common";

import { useUpdateNotice } from "@/src/admin/admin";
import type { NoticeType } from "@/src/model";
import { useGetNoticeDetail } from "@/src/notices/notices";

const NOTICE_TYPES: { value: NoticeType; label: string }[] = [
  { value: "일반공지", label: "일반공지" },
  { value: "이벤트", label: "이벤트" },
  { value: "업데이트", label: "업데이트" },
  { value: "점검", label: "점검" },
];

export default function AdminNoticeEditPage() {
  const params = useParams();
  const router = useRouter();
  const noticeId = params.id as string;

  const { data: noticeData, isLoading } = useGetNoticeDetail(noticeId);
  const { mutate: updateNotice, isPending } = useUpdateNotice();

  const [form, setForm] = useState({
    type: "일반공지" as NoticeType,
    title: "",
    content: "",
  });

  useEffect(() => {
    if (noticeData?.data) {
      setForm({
        type: noticeData.data.type,
        title: noticeData.data.title,
        content: noticeData.data.content,
      });
    }
  }, [noticeData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateNotice(
      { noticeId, data: form },
      {
        onSuccess: () => {
          router.push("/admin/notices");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader title="공지사항 수정" description="공지사항을 수정합니다" />

      <Card className="bg-luxury-secondary border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">유형</label>
            <div className="flex gap-2">
              {NOTICE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: type.value }))}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    form.type === type.value
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border text-muted-gray hover:border-gold/50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">제목</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="공지사항 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">내용</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="공지사항 내용을 입력하세요"
              rows={10}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" variant="gold" disabled={isPending || !form.title || !form.content}>
              {isPending ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
