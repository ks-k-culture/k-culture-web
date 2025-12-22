"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetProjects } from "@/src/projects/projects";
import { ChevronLeftIcon, PlusIcon } from "@/app/components/Icons";
import { GetProjectsStatus } from "@/src/model/getProjectsStatus";
import { COLORS } from "@/lib/constants";

type TabType = "all" | "ongoing" | "planning" | "completed";

const statusStyles: Record<string, { bg: string; text: string }> = {
  기획중: COLORS.status.planning,
  진행중: COLORS.status.ongoing,
  캐스팅완료: COLORS.status.completed,
};

const progressColors: Record<string, string> = {
  기획중: COLORS.status.planning.text,
  진행중: COLORS.status.ongoing.text,
  캐스팅완료: COLORS.status.completed.text,
};

const statusMap: Record<TabType, GetProjectsStatus | null> = {
  all: null,
  ongoing: GetProjectsStatus.ongoing,
  planning: GetProjectsStatus.planning,
  completed: GetProjectsStatus.completed,
};

function ProjectsSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-[110px] h-[147px] bg-gray-200 rounded-lg" />
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
            <div>
              <div className="h-1 bg-gray-200 rounded-full mb-2" />
              <div className="h-3 w-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const statusFilter = statusMap[activeTab];
  const { data, isLoading } = useGetProjects(statusFilter ? { status: statusFilter } : undefined);

  const projects = data?.data?.projects ?? [];

  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "ongoing", label: "진행중" },
    { key: "planning", label: "기획중" },
    { key: "completed", label: "완료됨" },
  ];

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
              진행중인 프로젝트
            </h1>
          </div>
        </header>

        <div className="px-5">
          <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.background.secondary }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key ? "bg-white rounded-lg shadow-sm" : ""
                }`}
                style={{
                  color: activeTab === tab.key ? COLORS.text.primary : COLORS.text.muted,
                  margin: activeTab === tab.key ? "4px" : "4px 0",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 pb-32">
          <section className="px-5 py-6 border-b" style={{ borderColor: COLORS.border.light }}>
            {isLoading ? (
              <ProjectsSkeleton />
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-400">등록된 프로젝트가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {projects.map((project) => {
                  const status = project.status ?? "기획중";
                  const style = statusStyles[status] ?? statusStyles["기획중"];
                  const progressColor = progressColors[status] ?? progressColors["기획중"];
                  const progress = project.progress ?? 0;

                  return (
                    <div key={project.id} className="flex gap-4">
                      <div
                        className="w-[110px] h-[147px] shrink-0 rounded-lg overflow-hidden"
                        style={{ backgroundColor: COLORS.background.secondary }}
                      >
                        {project.thumbnail ? (
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            width={110}
                            height={147}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-xs mb-1" style={{ color: COLORS.text.muted }}>
                            {project.company}
                          </p>
                          <h3 className="text-base font-semibold mb-2" style={{ color: COLORS.text.primary }}>
                            {project.title}
                          </h3>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: style.bg,
                              color: style.text,
                            }}
                          >
                            {status}
                          </span>
                        </div>

                        <div>
                          <div className="mb-2">
                            <div
                              className="w-full h-1 rounded-full overflow-hidden"
                              style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                            >
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: progressColor,
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs" style={{ color: COLORS.text.muted }}>
                            {progress}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={() => router.push("/mypage/projects/new")}
            className="w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.text.primary }}
          >
            <PlusIcon className="w-5 h-5" />
            <span>새 프로젝트 추가하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
