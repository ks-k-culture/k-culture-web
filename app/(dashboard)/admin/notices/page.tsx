"use client";

import Link from "next/link";

import { Button } from "@/components/ui";

import { DashboardLayout, PageHeader } from "@/components/common";

import { AdminNoticeList } from "./_components";

export default function AdminNoticesPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="공지사항 관리"
        description="공지사항을 등록하고 관리합니다"
        action={
          <Link href="/admin/notices/new">
            <Button variant="gold">공지사항 등록</Button>
          </Link>
        }
      />
      <AdminNoticeList />
    </DashboardLayout>
  );
}
