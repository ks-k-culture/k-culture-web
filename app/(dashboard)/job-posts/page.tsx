"use client";

import Link from "next/link";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout, EmptyState } from "@/components/common";
import { BriefcaseIcon, EyeIcon, PlusIcon } from "@/components/common/Misc/Icons";

import { useGetJobs } from "@/src/jobs/jobs";
import { JobStatus, type JobSummary } from "@/src/model";

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    단편영화: "bg-green-500/10 text-green-400",
    장편영화: "bg-gold/10 text-gold",
    웹드라마: "bg-blue-500/10 text-blue-400",
    광고: "bg-yellow-500/10 text-yellow-400",
    뮤직비디오: "bg-purple-500/10 text-purple-400",
    기타: "bg-gray-500/10 text-muted-gray",
  };
  return colors[category] || colors["기타"];
};

const getStatusStyle = (status: string) => {
  if (status === JobStatus.모집중) {
    return "bg-green-500/10 text-green-400";
  }
  return "bg-gray-500/10 text-muted-gray";
};

function JobListCard({ job }: { job: JobSummary }) {
  return (
    <Link href={`/job-posts/${job.id}`}>
      <DarkCard variant="hover" className="group">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(job.category)}`}>
                {job.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(job.status)}`}>
                {job.status}
              </span>
              {job.isPumasi && (
                <span className="bg-gold/10 text-gold rounded-full px-3 py-1 text-xs font-medium">품앗이</span>
              )}
            </div>

            <h3 className="text-ivory group-hover:text-gold mb-2 text-lg font-semibold transition-colors">
              {job.title}
            </h3>

            <div className="text-muted-gray mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>제작: {job.production}</span>
              <span>작품: {job.workTitle}</span>
              <span>{job.gender}</span>
            </div>

            <div className="text-muted-gray flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                {job.views?.toLocaleString()}
              </span>
              {!job.isPumasi && job.price && (
                <span className="text-gold font-medium">{job.price.toLocaleString()}원</span>
              )}
              <span>{job.createdAt?.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </DarkCard>
    </Link>
  );
}

export default function DashboardJobsPage() {
  const { data: jobsData, isLoading } = useGetJobs();
  const jobs = jobsData?.data?.jobs || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="md" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-xl text-ivory">작품구인</h1>
            <p className="text-muted-gray mt-1">구인 공고를 관리하세요</p>
          </div>
          <Link href="/job-posts/new">
            <Button variant="gold">
              <PlusIcon className="mr-1 h-4 w-4" /> 구인글 작성
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon className="text-muted-gray h-16 w-16" />}
            title="등록된 구인글이 없습니다"
            description="새 구인글을 작성하여 배우를 찾아보세요"
            action={
              <Link href="/job-posts/new">
                <Button variant="gold">
                  <PlusIcon className="mr-1 h-4 w-4" /> 첫 구인글 작성하기
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobListCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
