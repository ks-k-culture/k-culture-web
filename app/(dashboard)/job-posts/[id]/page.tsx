"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout, Modal } from "@/components/common";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EyeIcon,
  LocationIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
} from "@/components/common/Misc/Icons";

import { useDeleteJob, useGetJobDetail } from "@/src/jobs/jobs";
import { JobStatus } from "@/src/model";

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    단편영화: "bg-green-500/10 text-green-400 border-green-500/20",
    장편영화: "bg-gold/10 text-gold border-gold/20",
    웹드라마: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    광고: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    뮤직비디오: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    기타: "bg-gray-500/10 text-muted-gray border-gray-500/20",
  };
  return colors[category] || colors["기타"];
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const { data: jobData, isLoading } = useGetJobDetail(jobId);
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const job = jobData?.data;

  const handleDelete = () => {
    deleteJob(
      { jobId },
      {
        onSuccess: () => {
          router.push("/job-posts");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="md" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center">
          <h2 className="text-ivory mb-2 text-xl font-semibold">구인글을 찾을 수 없습니다</h2>
          <p className="text-muted-gray mb-6">삭제되었거나 존재하지 않는 구인글입니다</p>
          <Link href="/job-posts">
            <Button variant="gold">목록으로 돌아가기</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isRecruiting = job.status === JobStatus.모집중;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-muted-gray hover:text-ivory flex items-center gap-2 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>목록으로</span>
          </button>

          <div className="flex gap-2">
            <Link href={`/job-posts/${jobId}/edit`}>
              <Button variant="gold-outline" size="sm">
                <PencilIcon className="mr-1 h-4 w-4" /> 수정
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(true)}>
              <TrashIcon className="mr-1 h-4 w-4 text-red-400" />
              <span className="text-red-400">삭제</span>
            </Button>
          </div>
        </div>

        <DarkCard>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${getCategoryColor(job.category)}`}>
              {job.category}
            </span>
            <span
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                isRecruiting ? "bg-green-500/10 text-green-400" : "text-muted-gray bg-gray-500/10"
              }`}
            >
              {job.status}
            </span>
            {job.isPumasi && (
              <span className="bg-gold/10 text-gold rounded-lg px-3 py-1.5 text-sm font-medium">품앗이</span>
            )}
          </div>

          <h1 className="text-ivory mb-4 text-2xl font-bold">{job.title}</h1>

          <div className="text-muted-gray mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              조회 {job.views?.toLocaleString()}
            </span>
            <span>작성일: {job.createdAt?.slice(0, 10)}</span>
            {job.updatedAt !== job.createdAt && <span>수정일: {job.updatedAt?.slice(0, 10)}</span>}
          </div>

          <div className="border-border mb-6 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
            <div>
              <p className="text-muted-gray mb-1 text-sm">제작사</p>
              <p className="text-ivory font-medium">{job.production}</p>
            </div>
            <div>
              <p className="text-muted-gray mb-1 text-sm">작품명</p>
              <p className="text-ivory font-medium">{job.workTitle}</p>
            </div>
            <div>
              <p className="text-muted-gray mb-1 text-sm">성별</p>
              <p className="text-ivory font-medium">{job.gender || "-"}</p>
            </div>
            <div>
              <p className="text-muted-gray mb-1 text-sm">나이대</p>
              <p className="text-ivory font-medium">{job.ageRange || "-"}</p>
            </div>
          </div>

          <div className="border-border mb-6 border-t pt-6">
            <p className="text-muted-gray mb-1 text-sm">출연료</p>
            <p className="text-gold text-xl font-bold">
              {job.isPumasi ? "품앗이 (무보수)" : job.price ? `${job.price.toLocaleString()}원` : "협의"}
            </p>
          </div>

          {(job.shootingDate || job.shootingLocation) && (
            <div className="border-border mb-6 grid grid-cols-2 gap-4 border-t pt-6">
              {job.shootingDate && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="text-muted-gray mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-muted-gray mb-1 text-sm">촬영 예정일</p>
                    <p className="text-ivory">{job.shootingDate}</p>
                  </div>
                </div>
              )}
              {job.shootingLocation && (
                <div className="flex items-start gap-3">
                  <LocationIcon className="text-muted-gray mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-muted-gray mb-1 text-sm">촬영 장소</p>
                    <p className="text-ivory">{job.shootingLocation}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {job.description && (
            <div className="border-border border-t pt-6">
              <p className="text-muted-gray mb-3 text-sm">상세 설명</p>
              <div className="text-warm-gray leading-relaxed whitespace-pre-wrap">{job.description}</div>
            </div>
          )}
        </DarkCard>

        {isRecruiting && (
          <DarkCard variant="gold" className="text-center">
            <h3 className="text-ivory mb-2 text-lg font-semibold">이 작품에 관심이 있으신가요?</h3>
            <p className="text-muted-gray mb-4 text-sm">담당자에게 직접 연락하여 지원해보세요</p>
            <Button variant="gold" size="lg" onClick={() => setShowContactModal(true)}>
              지원 문의하기
            </Button>
          </DarkCard>
        )}

        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="구인글 삭제">
          <div className="space-y-6">
            <p className="text-warm-gray">
              정말로 이 구인글을 삭제하시겠습니까?
              <br />
              <span className="text-red-400">삭제된 구인글은 복구할 수 없습니다.</span>
            </p>
            <div className="flex gap-3">
              <Button variant="gold-secondary" fullWidth onClick={() => setShowDeleteModal(false)}>
                취소
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={handleDelete}
                loading={isDeleting}
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                삭제하기
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="지원 문의">
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

            <Button variant="gold" fullWidth onClick={() => setShowContactModal(false)}>
              확인
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
