"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 아이콘 컴포넌트들
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// 작품 유형 옵션
const projectTypes = ["영화", "드라마", "웹드라마", "OTT 시리즈", "뮤직비디오", "광고", "기타"];

// 장르 옵션
const genres = ["액션", "로맨스", "코미디", "드라마", "스릴러", "공포", "SF", "판타지", "사극", "기타"];

export default function NewProjectPage() {
  const router = useRouter();

  // 폼 상태
  const [projectName, setProjectName] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [genre, setGenre] = useState("");
  const [shootingPeriod, setShootingPeriod] = useState("");
  const [roleInfo, setRoleInfo] = useState("");

  // 드롭다운 상태
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  // 폼 유효성 검사
  const isFormValid = projectName.trim() !== "" && company.trim() !== "" && projectType !== "" && genre !== "";

  const handleSubmit = () => {
    if (isFormValid) {
      // 프로젝트 정보를 저장하고 캐릭터 입력 페이지로 이동
      console.log("프로젝트 정보:", {
        projectName,
        company,
        projectType,
        genre,
        shootingPeriod,
        roleInfo,
      });
      router.push("/mypage/projects/new/characters");
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        {/* 헤더 */}
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

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-5 pb-32">
          {/* 프로젝트명 */}
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

          {/* 제작사 */}
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

          {/* 작품 유형 */}
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

          {/* 장르 */}
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

          {/* 촬영 기간 */}
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

          {/* 배역 정보 */}
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

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full py-4 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: isFormValid ? "#191F28" : "rgba(25, 31, 40, 0.3)",
              color: "#FFFFFF",
            }}
          >
            프로젝트 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
