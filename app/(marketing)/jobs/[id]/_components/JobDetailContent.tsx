"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Badge, Button, Card, Spinner } from "@/components/ui";

import {
  ArrowLeftIcon,
  CalendarIcon,
  EyeIcon,
  LocationIcon,
  MailIcon,
  MarketingLayout,
  Modal,
  PhoneIcon,
} from "@/components/common";

import { getJobCategoryStyle, getJobStatusStyle } from "@/lib/constants/styles";
import { cn } from "@/lib/utils";

import { useGetJobDetail } from "@/src/jobs/jobs";
import { JobStatus } from "@/src/model";

export function JobDetailContent() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [showApplyModal, setShowApplyModal] = useState(false);

  const { data: jobData, isLoading } = useGetJobDetail(jobId);
  const job = jobData?.data;

  if (isLoading) {
    return (
      <MarketingLayout showFooterGradient={false}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MarketingLayout>
    );
  }

  if (!job) {
    return (
      <MarketingLayout>
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-ivory mb-4 text-2xl font-bold">구인글을 찾을 수 없습니다</h2>
          <p className="text-muted-gray mb-8">삭제되었거나 존재하지 않는 구인글입니다</p>
          <Link href="/jobs">
            <Button variant="gold">목록으로 돌아가기</Button>
          </Link>
        </main>
      </MarketingLayout>
    );
  }

  const isRecruiting = job.status === JobStatus.모집중;

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

        <Card className="bg-luxury-secondary border-border mb-6 overflow-hidden">
          <div className="p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={cn("font-medium", getJobCategoryStyle(job.category))}>
                {job.category}
              </Badge>
              <Badge variant="outline" className={cn("font-medium", getJobStatusStyle(job.status))}>
                {job.status}
              </Badge>
              {job.isPumasi && (
                <Badge variant="outline" className="border-gold/20 bg-gold/10 text-gold font-medium">
                  💜 품앗이
                </Badge>
              )}
            </div>

            <h1 className="mb-4 text-2xl font-bold text-white md:text-3xl">{job.title}</h1>

            <div className="text-muted-gray mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                조회 {job.views?.toLocaleString()}
              </span>
              <span>등록일: {job.createdAt?.slice(0, 10)}</span>
            </div>

            <div className="border-border mb-8 grid grid-cols-2 gap-6 border-t pt-8 md:grid-cols-4">
              <div>
                <p className="text-muted-gray mb-1 text-sm">제작사</p>
                <p className="font-medium text-white">{job.production}</p>
              </div>
              <div>
                <p className="text-muted-gray mb-1 text-sm">작품명</p>
                <p className="font-medium text-white">{job.workTitle}</p>
              </div>
              <div>
                <p className="text-muted-gray mb-1 text-sm">성별</p>
                <p className="font-medium text-white">{job.gender || "-"}</p>
              </div>
              <div>
                <p className="text-muted-gray mb-1 text-sm">나이대</p>
                <p className="font-medium text-white">{job.ageRange || "-"}</p>
              </div>
            </div>

            <div className="border-border mb-8 border-t pt-8">
              <p className="text-muted-gray mb-2 text-sm">출연료</p>
              <p className="text-gold text-2xl font-bold">
                {job.isPumasi ? "품앗이 (무보수)" : job.price ? `${job.price.toLocaleString()}원` : "협의"}
              </p>
            </div>

            {(job.shootingDate || job.shootingLocation) && (
              <div className="border-border mb-8 grid gap-6 border-t pt-8 md:grid-cols-2">
                {job.shootingDate && (
                  <div className="flex items-start gap-4">
                    <div className="bg-gold/10 rounded-full p-3">
                      <CalendarIcon className="text-gold h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-muted-gray mb-1 text-sm">촬영 예정일</p>
                      <p className="font-medium text-white">{job.shootingDate}</p>
                    </div>
                  </div>
                )}
                {job.shootingLocation && (
                  <div className="flex items-start gap-4">
                    <div className="bg-gold/10 rounded-full p-3">
                      <LocationIcon className="text-gold h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-muted-gray mb-1 text-sm">촬영 장소</p>
                      <p className="font-medium text-white">{job.shootingLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {job.description && (
              <div className="border-border border-t pt-8">
                <p className="text-muted-gray mb-4 text-sm">상세 설명</p>
                <div className="text-warm-gray leading-relaxed whitespace-pre-wrap">{job.description}</div>
              </div>
            )}
          </div>
        </Card>

        {isRecruiting && (
          <Card className="from-gold/10 border-gold/30 bg-gradient-to-r to-transparent p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-white">이 작품에 지원하고 싶으신가요?</h3>
            <p className="text-muted-gray mb-4 text-sm">담당자에게 직접 연락하여 지원해보세요</p>
            <Button variant="gold" size="lg" onClick={() => setShowApplyModal(true)}>
              지원 문의하기
            </Button>
          </Card>
        )}
      </main>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="지원 문의">
        <div className="space-y-6">
          <p className="text-muted-gray text-sm">아래 연락처로 직접 연락하여 지원해주세요</p>

          {job.contactEmail && (
            <div className="bg-luxury-tertiary flex items-center gap-4 rounded-xl p-4">
              <div className="bg-gold/10 rounded-full p-3">
                <MailIcon className="text-gold h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-gray mb-1 text-sm">이메일</p>
                <a href={`mailto:${job.contactEmail}`} className="text-ivory hover:text-gold transition-colors">
                  {job.contactEmail}
                </a>
              </div>
            </div>
          )}

          {job.contactPhone && (
            <div className="bg-luxury-tertiary flex items-center gap-4 rounded-xl p-4">
              <div className="bg-gold/10 rounded-full p-3">
                <PhoneIcon className="text-gold h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-gray mb-1 text-sm">연락처</p>
                <a href={`tel:${job.contactPhone}`} className="text-ivory hover:text-gold transition-colors">
                  {job.contactPhone}
                </a>
              </div>
            </div>
          )}

          {!job.contactEmail && !job.contactPhone && (
            <div className="text-muted-gray py-4 text-center">등록된 연락처가 없습니다</div>
          )}

          <Button variant="gold" fullWidth onClick={() => setShowApplyModal(false)}>
            확인
          </Button>
        </div>
      </Modal>
    </MarketingLayout>
  );
}
