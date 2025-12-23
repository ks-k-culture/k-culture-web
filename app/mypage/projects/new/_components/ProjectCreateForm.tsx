"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProject, getGetProjectsQueryKey } from "@/src/projects/projects";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon } from "@/app/components/Icons";
import { PageLayout } from "@/app/components/PageLayout";
import { StickyHeader } from "@/app/components/StickyHeader";
import { FixedBottomArea } from "@/app/components/FixedBottomArea";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { FormSection } from "@/app/components/FormSection";
import type { ProjectCreateRequestGenre } from "@/src/model/projectCreateRequestGenre";
import type { ProjectCreateRequestProjectType } from "@/src/model/projectCreateRequestProjectType";
import { COLORS, PROJECT_TYPE_OPTIONS, PROJECT_GENRE_OPTIONS } from "@/lib/constants";

const projectTypes = PROJECT_TYPE_OPTIONS as unknown as ProjectCreateRequestProjectType[];
const genres = PROJECT_GENRE_OPTIONS as unknown as ProjectCreateRequestGenre[];

export function ProjectCreateForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: createProject, isPending: isCreating } = useCreateProject({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
        const projectId = data?.data?.id;
        if (projectId) {
          router.push(`/mypage/projects/new/characters?projectId=${projectId}`);
        } else {
          router.push("/mypage/projects/new/characters");
        }
      },
    },
  });

  const [projectName, setProjectName] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState<ProjectCreateRequestProjectType | "">("");
  const [genre, setGenre] = useState<ProjectCreateRequestGenre | "">("");
  const [shootingPeriod, setShootingPeriod] = useState("");
  const [roleInfo, setRoleInfo] = useState("");

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const isFormValid = projectName.trim() !== "" && company.trim() !== "" && projectType !== "" && genre !== "";

  const handleSubmit = () => {
    if (!isFormValid || isCreating) return;

    createProject({
      data: {
        projectName,
        company,
        projectType: projectType as ProjectCreateRequestProjectType,
        genre: genre as ProjectCreateRequestGenre,
        shootingPeriod: shootingPeriod || undefined,
        roleInfo: roleInfo || undefined,
      },
    });
  };

  return (
    <PageLayout>
      <StickyHeader title="새 프로젝트 만들기" />

      <main className="flex-1 px-5 pb-32">
        <FormSection>
          <label className="block text-sm mb-2" style={{ color: COLORS.text.muted }}>
            프로젝트명
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="프로젝트명을 입력해주세요"
            className="w-full text-base outline-none"
            style={{ color: COLORS.text.primary }}
          />
        </FormSection>

        <FormSection>
          <label className="block text-sm mb-2" style={{ color: COLORS.text.muted }}>
            제작사
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="제작사를 입력해주세요"
            className="w-full text-base outline-none"
            style={{ color: COLORS.text.primary }}
          />
        </FormSection>

        <FormSection className="relative">
          <label className="block text-sm mb-2" style={{ color: COLORS.text.muted }}>
            작품 유형
          </label>
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowGenreDropdown(false);
            }}
            className="w-full flex items-center justify-between text-base"
          >
            <span style={{ color: projectType ? COLORS.text.primary : COLORS.text.muted }}>
              {projectType || "유형을 선택해주세요"}
            </span>
            <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
          </button>

          {showTypeDropdown && (
            <div
              className="absolute left-0 right-0 top-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
              style={{ borderColor: COLORS.border.default }}
            >
              {projectTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setProjectType(type);
                    setShowTypeDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-base"
                  style={{ color: COLORS.text.primary }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection className="relative">
          <label className="block text-sm mb-2" style={{ color: COLORS.text.muted }}>
            장르
          </label>
          <button
            onClick={() => {
              setShowGenreDropdown(!showGenreDropdown);
              setShowTypeDropdown(false);
            }}
            className="w-full flex items-center justify-between text-base"
          >
            <span style={{ color: genre ? COLORS.text.primary : COLORS.text.muted }}>
              {genre || "장르를 선택해주세요"}
            </span>
            <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
          </button>

          {showGenreDropdown && (
            <div
              className="absolute left-0 right-0 top-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
              style={{ borderColor: COLORS.border.default }}
            >
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGenre(g);
                    setShowGenreDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-base"
                  style={{ color: COLORS.text.primary }}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection>
          <label className="block text-sm mb-2" style={{ color: COLORS.text.muted }}>
            촬영 기간
          </label>
          <input
            type="text"
            value={shootingPeriod}
            onChange={(e) => setShootingPeriod(e.target.value)}
            placeholder="예: 2024.03 ~ 2024.06"
            className="w-full text-base outline-none"
            style={{ color: COLORS.text.primary }}
          />
        </FormSection>

        <div className="py-4">
          <label className="block text-sm mb-2" style={{ color: COLORS.text.muted }}>
            배역 정보
          </label>
          <textarea
            value={roleInfo}
            onChange={(e) => setRoleInfo(e.target.value)}
            placeholder="캐스팅 중인 배역의 상세 정보를 입력해주세요. 배역명, 나이대, 성별, 캐릭터 특징 등을 포함해주세요."
            rows={5}
            className="w-full text-base outline-none resize-none rounded-lg p-4"
            style={{
              color: COLORS.text.primary,
              backgroundColor: COLORS.background.primary,
              border: `1px solid ${COLORS.border.default}`,
            }}
          />
        </div>
      </main>

      <FixedBottomArea>
        <PrimaryButton onClick={handleSubmit} disabled={!isFormValid} loading={isCreating}>
          {isCreating ? "생성중..." : "프로젝트 추가하기"}
        </PrimaryButton>
      </FixedBottomArea>
    </PageLayout>
  );
}
