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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

// 탭 타입
type TabType = "all" | "ongoing" | "planning" | "completed";

// 프로젝트 상태 타입
type ProjectStatus = "기획중" | "진행중" | "캐스팅완료";

// 프로젝트 타입
interface Project {
  id: string;
  thumbnail: string;
  company: string;
  title: string;
  status: ProjectStatus;
  progress: number;
  percentage: number;
}

// 추천 배우 타입
interface RecommendedActor {
  id: string;
  image: string;
  name: string;
  daysLeft: number;
}

// 더미 데이터 - 프로젝트
const allProjects: Project[] = [
  {
    id: "1",
    thumbnail: "/placeholder-poster.jpg",
    company: "스튜디오 드래곤",
    title: "킹더랜드 시즌2",
    status: "진행중",
    progress: 30,
    percentage: 30,
  },
  {
    id: "2",
    thumbnail: "/placeholder-poster.jpg",
    company: "스튜디오 드래곤",
    title: "킹더랜드 시즌2",
    status: "기획중",
    progress: 35,
    percentage: 35,
  },
  {
    id: "3",
    thumbnail: "/placeholder-poster.jpg",
    company: "스튜디오 드래곤",
    title: "킹더랜드 시즌2",
    status: "캐스팅완료",
    progress: 100,
    percentage: 100,
  },
];

// 더미 데이터 - 추천 배우
const recommendedActors: RecommendedActor[] = [
  { id: "1", image: "/placeholder-actor.jpg", name: "김민수", daysLeft: 50 },
  { id: "2", image: "/placeholder-actor.jpg", name: "김민수", daysLeft: 50 },
  { id: "3", image: "/placeholder-actor.jpg", name: "김민수", daysLeft: 50 },
  { id: "4", image: "/placeholder-actor.jpg", name: "김민수", daysLeft: 50 },
];

// 상태별 스타일
const statusStyles: Record<ProjectStatus, { bg: string; text: string }> = {
  기획중: { bg: "rgba(78, 89, 104, 0.1)", text: "#4E5968" },
  진행중: { bg: "rgba(229, 8, 21, 0.1)", text: "#E50815" },
  캐스팅완료: { bg: "rgba(0, 157, 255, 0.1)", text: "#009DFF" },
};

// 상태별 프로그레스 바 색상
const progressColors: Record<ProjectStatus, string> = {
  기획중: "#4E5968",
  진행중: "#E50815",
  캐스팅완료: "#009DFF",
};

export default function ProjectsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "ongoing", label: "진행중" },
    { key: "planning", label: "기획중" },
    { key: "completed", label: "완료됨" },
  ];

  // 탭에 따라 프로젝트 필터링
  const filteredProjects = allProjects.filter((project) => {
    if (activeTab === "all") return true;
    if (activeTab === "ongoing") return project.status === "진행중";
    if (activeTab === "planning") return project.status === "기획중";
    if (activeTab === "completed") return project.status === "캐스팅완료";
    return true;
  });

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
              진행중인 프로젝트
            </h1>
          </div>
        </header>

        {/* 탭 네비게이션 */}
        <div className="px-5">
          <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: "#F2F4F6" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key ? "bg-white rounded-lg shadow-sm" : ""
                }`}
                style={{
                  color: activeTab === tab.key ? "#191F28" : "#8B95A1",
                  margin: activeTab === tab.key ? "4px" : "4px 0",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 pb-32">
          {/* 프로젝트 목록 */}
          <section className="px-5 py-6 border-b" style={{ borderColor: "#F2F4F6" }}>
            <div className="space-y-5">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex gap-4">
                  {/* 포스터 이미지 */}
                  <div
                    className="w-[110px] h-[147px] shrink-0 rounded-lg overflow-hidden"
                    style={{ backgroundColor: "#F2F4F6" }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  </div>

                  {/* 프로젝트 정보 */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      {/* 제작사 */}
                      <p className="text-xs mb-1" style={{ color: "#8B95A1" }}>
                        {project.company}
                      </p>
                      {/* 작품명 */}
                      <h3 className="text-base font-semibold mb-2" style={{ color: "#191F28" }}>
                        {project.title}
                      </h3>
                      {/* 상태 배지 */}
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusStyles[project.status].bg,
                          color: statusStyles[project.status].text,
                        }}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* 하단 정보 */}
                    <div>
                      {/* 진행률 바 */}
                      <div className="mb-2">
                        <div
                          className="w-full h-1 rounded-full overflow-hidden"
                          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${project.progress}%`,
                              backgroundColor: progressColors[project.status],
                            }}
                          />
                        </div>
                      </div>
                      {/* 퍼센티지 */}
                      <p className="text-xs" style={{ color: "#8B95A1" }}>
                        {project.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 추천 배우 섹션 */}
          <section className="px-5 py-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#191F28" }}>
              추천 배우
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommendedActors.map((actor) => (
                <div key={actor.id} className="flex flex-col items-center shrink-0">
                  {/* 프로필 이미지 */}
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "#F2F4F6" }}>
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  </div>
                  {/* 이름 */}
                  <p className="text-sm font-medium mb-0.5" style={{ color: "#191F28" }}>
                    {actor.name}
                  </p>
                  {/* 상태 */}
                  <p className="text-xs" style={{ color: "#8B95A1" }}>
                    {actor.daysLeft}일
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={() => router.push("/mypage/projects/new")}
            className="w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#191F28" }}
          >
            <PlusIcon className="w-5 h-5" />
            <span>새 프로젝트 추가하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
