"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProject, getGetProjectsQueryKey } from "@/src/projects/projects";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronDownIcon } from "@/app/components/Icons";
import type { ProjectCreateRequestGenre } from "@/src/model/projectCreateRequestGenre";
import type { ProjectCreateRequestProjectType } from "@/src/model/projectCreateRequestProjectType";

const projectTypes: ProjectCreateRequestProjectType[] = [
  "영화",
  "드라마",
  "웹드라마",
  "OTT 시리즈",
  "뮤직비디오",
  "광고",
  "기타",
];
const genres: ProjectCreateRequestGenre[] = [
  "액션",
  "로맨스",
  "코미디",
  "드라마",
  "스릴러",
  "공포",
  "SF",
  "판타지",
  "사극",
  "기타",
];

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
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6 text-[#191F28]" />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "#191F28" }}>
              새 프로젝트 만들기
            </h1>
          </div>
        </header>

        <main className="flex-1 px-5 pb-32">
          <div className="py-4 border-b" style={{ borderColor: "#E5E8EB" }}>
            <label className="block text-sm mb-2" style={{ color: "#8B95A1" }}>
              프로젝트명
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트명을 입력해주세요"
              className="w-full text-base outline-none"
              style={{ color: "#191F28" }}
            />
          </div>

          <div className="py-4 border-b" style={{ borderColor: "#E5E8EB" }}>
            <label className="block text-sm mb-2" style={{ color: "#8B95A1" }}>
              제작사
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="제작사를 입력해주세요"
              className="w-full text-base outline-none"
              style={{ color: "#191F28" }}
            />
          </div>

          <div className="py-4 border-b relative" style={{ borderColor: "#E5E8EB" }}>
            <label className="block text-sm mb-2" style={{ color: "#8B95A1" }}>
              작품 유형
            </label>
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowGenreDropdown(false);
              }}
              className="w-full flex items-center justify-between text-base"
            >
              <span style={{ color: projectType ? "#191F28" : "#8B95A1" }}>{projectType || "유형을 선택해주세요"}</span>
              <ChevronDownIcon className="w-5 h-5 text-[#6B7684]" />
            </button>

            {showTypeDropdown && (
              <div
                className="absolute left-0 right-0 top-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                style={{ borderColor: "#E5E8EB" }}
              >
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setProjectType(type);
                      setShowTypeDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-base"
                    style={{ color: "#191F28" }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-4 border-b relative" style={{ borderColor: "#E5E8EB" }}>
            <label className="block text-sm mb-2" style={{ color: "#8B95A1" }}>
              장르
            </label>
            <button
              onClick={() => {
                setShowGenreDropdown(!showGenreDropdown);
                setShowTypeDropdown(false);
              }}
              className="w-full flex items-center justify-between text-base"
            >
              <span style={{ color: genre ? "#191F28" : "#8B95A1" }}>{genre || "장르를 선택해주세요"}</span>
              <ChevronDownIcon className="w-5 h-5 text-[#6B7684]" />
            </button>

            {showGenreDropdown && (
              <div
                className="absolute left-0 right-0 top-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                style={{ borderColor: "#E5E8EB" }}
              >
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGenre(g);
                      setShowGenreDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-base"
                    style={{ color: "#191F28" }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-4 border-b" style={{ borderColor: "#E5E8EB" }}>
            <label className="block text-sm mb-2" style={{ color: "#8B95A1" }}>
              촬영 기간
            </label>
            <input
              type="text"
              value={shootingPeriod}
              onChange={(e) => setShootingPeriod(e.target.value)}
              placeholder="예: 2024.03 ~ 2024.06"
              className="w-full text-base outline-none"
              style={{ color: "#191F28" }}
            />
          </div>

          <div className="py-4">
            <label className="block text-sm mb-2" style={{ color: "#8B95A1" }}>
              배역 정보
            </label>
            <textarea
              value={roleInfo}
              onChange={(e) => setRoleInfo(e.target.value)}
              placeholder="캐스팅 중인 배역의 상세 정보를 입력해주세요. 배역명, 나이대, 성별, 캐릭터 특징 등을 포함해주세요."
              rows={5}
              className="w-full text-base outline-none resize-none rounded-lg p-4"
              style={{
                color: "#191F28",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E8EB",
              }}
            />
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isCreating}
            className="w-full py-4 rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
            style={{
              backgroundColor: isFormValid && !isCreating ? "#191F28" : "rgba(25, 31, 40, 0.3)",
              color: "#FFFFFF",
            }}
          >
            {isCreating ? "생성중..." : "프로젝트 추가하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
