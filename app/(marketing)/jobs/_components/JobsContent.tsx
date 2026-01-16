"use client";

import Link from "next/link";

import { EmptyState, Input, Select, Spinner } from "@/components/ui";

import { MarketingLayout } from "@/components/common/Layout";

import { useFilters } from "@/lib/hooks";

import { useAuthStore } from "@/stores/useAuthStore";

import { useGetJobs } from "@/src/jobs/jobs";
import type { GetJobsGender, JobCategory } from "@/src/model";

import { JobCard } from "./JobCard";

interface JobFilters {
  [key: string]: string | boolean | undefined;
  category: string;
  gender: string;
  pumasi: string;
}

const CATEGORY_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "단편영화", label: "단편영화" },
  { value: "장편영화", label: "장편영화" },
  { value: "웹드라마", label: "웹드라마" },
  { value: "광고", label: "광고" },
  { value: "기타", label: "기타" },
];

const GENDER_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "남자", label: "남자" },
  { value: "여자", label: "여자" },
  { value: "성별무관", label: "성별무관" },
];

const PUMASI_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "가능", label: "가능" },
  { value: "불가능", label: "불가능" },
];

export function JobsContent() {
  const { isAuthenticated } = useAuthStore();

  const { filters, setFilter } = useFilters<JobFilters>({
    category: "전체",
    gender: "전체",
    pumasi: "전체",
  });

  const { data: jobsData, isLoading } = useGetJobs({
    category: filters.category !== "전체" ? (filters.category as JobCategory) : undefined,
    gender: filters.gender !== "전체" ? (filters.gender as GetJobsGender) : undefined,
    isPumasi: filters.pumasi === "가능" ? true : filters.pumasi === "불가능" ? false : undefined,
  });

  const jobs = jobsData?.data?.jobs || [];
  const pagination = jobsData?.data?.pagination;

  const postJobLink = isAuthenticated ? "/job-posts/new" : "/login?redirect=/job-posts/new";

  return (
    <MarketingLayout>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white md:text-3xl">작품과 배우·모델의 만남</h1>
          <Link
            href={postJobLink}
            className="text-gold border-gold/50 hover:bg-gold/10 rounded-lg border px-4 py-2 text-sm transition-all"
          >
            구인하기
          </Link>
        </div>

        <div className="bg-luxury-black/50 border-border mb-8 rounded-2xl border p-6">
          <div className="mb-6">
            <Input type="text" placeholder="작품 검색" className="bg-luxury-secondary border-border" />
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-gray text-sm">작품구분</span>
              <Select
                options={CATEGORY_OPTIONS}
                value={filters.category}
                onChange={(value) => setFilter("category", value)}
                className="bg-luxury-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-gray text-sm">성별</span>
              <Select
                options={GENDER_OPTIONS}
                value={filters.gender}
                onChange={(value) => setFilter("gender", value)}
                className="bg-luxury-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-gray text-sm">품앗이</span>
              <Select
                options={PUMASI_OPTIONS}
                value={filters.pumasi}
                onChange={(value) => setFilter("pumasi", value)}
                className="bg-luxury-secondary border-border"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mb-8 space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {jobs.length === 0 && <EmptyState description="등록된 작품구인이 없습니다" />}
          </div>
        )}

        {pagination && pagination.totalPages > 0 && (
          <div className="flex justify-center">
            <div className="text-muted-gray text-sm">
              총 {pagination.total}개 ({pagination.page} / {pagination.totalPages} 페이지)
            </div>
          </div>
        )}
      </main>
    </MarketingLayout>
  );
}
