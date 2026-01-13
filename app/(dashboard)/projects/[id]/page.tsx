"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout } from "@/components/common";
import { PencilIcon, PlusIcon, UserIcon, XMarkIcon } from "@/components/common/Misc/Icons";

import { useGetProjectCharacters } from "@/src/characters/characters";
import { useGetProjectDetail } from "@/src/projects/projects";

const statusColors: Record<string, string> = {
  미시작: "bg-luxury-tertiary text-muted-gray",
  진행중: "bg-blue-500/10 text-blue-400",
  캐스팅완료: "bg-green-500/10 text-green-400",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: projectData, isLoading: projectLoading } = useGetProjectDetail(projectId);
  const { data: charactersData } = useGetProjectCharacters(projectId);

  const project = projectData?.data;
  const characters = charactersData?.data?.characters || [];

  if (projectLoading || !project) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="md" />
        </div>
      </DashboardLayout>
    );
  }

  const totalCharacters = characters.length;
  const castingComplete = characters.filter((c) => c.roleType === "주연").length;
  const progress = totalCharacters > 0 ? Math.round((castingComplete / totalCharacters) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-ivory text-2xl font-bold">{project.projectName}</h1>
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  statusColors[project.status] || statusColors["진행중"]
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-muted-gray">
              {project.company} · {project.projectType} · {project.genre}
            </p>
          </div>
          <Button variant="gold-outline" size="sm">
            <PencilIcon className="mr-1 h-4 w-4" /> 수정
          </Button>
        </div>

        <DarkCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-ivory text-lg font-semibold">캐스팅 진행률</h2>
              <p className="text-muted-gray text-sm">
                {castingComplete}/{totalCharacters} 배역 완료
              </p>
            </div>
            <span className="text-gold text-3xl font-bold">{progress}%</span>
          </div>
          <div className="bg-luxury-tertiary h-2 overflow-hidden rounded-full">
            <div className="bg-gold h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </DarkCard>

        <DarkCard>
          <h2 className="text-ivory mb-4 text-lg font-semibold">프로젝트 정보</h2>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-gray text-sm">촬영 기간</p>
              <p className="text-ivory">{project.shootingPeriod || "미정"}</p>
            </div>
            <div>
              <p className="text-muted-gray text-sm">총 배역</p>
              <p className="text-ivory">{totalCharacters}개</p>
            </div>
          </div>
          <div>
            <p className="text-muted-gray mb-1 text-sm">배역 상세</p>
            <p className="text-warm-gray">{project.roleInfo || "정보 없음"}</p>
          </div>
        </DarkCard>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-ivory text-lg font-semibold">캐릭터 ({totalCharacters})</h2>
            <Button variant="gold" size="sm" onClick={() => setShowAddModal(true)}>
              <PlusIcon className="mr-1 h-4 w-4" /> 캐릭터 추가
            </Button>
          </div>

          <div className="space-y-4">
            {characters.map((character) => (
              <DarkCard key={character.id} variant="hover">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <div className="bg-luxury-secondary flex h-full w-full items-center justify-center">
                      <UserIcon className="text-muted-gray h-8 w-8" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-ivory font-semibold">{character.name}</h3>
                      <span className="bg-gold/10 text-gold rounded px-2 py-0.5 text-xs">{character.roleType}</span>
                    </div>
                    <p className="text-muted-gray mb-2 text-sm">
                      {character.gender} · {character.ageRange}
                    </p>
                    <p className="text-muted-gray line-clamp-1 text-sm">{character.description}</p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link href={`/actor-search?character=${character.id}`}>
                      <Button variant="gold-outline" size="sm">
                        배우 찾기
                      </Button>
                    </Link>
                  </div>
                </div>
              </DarkCard>
            ))}
          </div>
        </div>

        <DarkCard variant="gold">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-ivory mb-1 font-semibold">AI로 배우 추천받기</h3>
              <p className="text-muted-gray text-sm">시놉시스와 캐릭터 정보로 최적의 배우를 찾아드립니다</p>
            </div>
            <Link href={`/ai-matching?project=${projectId}`}>
              <Button variant="gold">AI 매칭 시작</Button>
            </Link>
          </div>
        </DarkCard>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <DarkCard className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-ivory text-xl font-bold">캐릭터 추가</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-gray hover:text-ivory"
                aria-label="모달 닫기"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-muted-gray py-8 text-center">캐릭터 추가 폼은 추후 구현 예정입니다</p>
            <Button variant="gold" fullWidth onClick={() => setShowAddModal(false)}>
              닫기
            </Button>
          </DarkCard>
        </div>
      )}
    </DashboardLayout>
  );
}
