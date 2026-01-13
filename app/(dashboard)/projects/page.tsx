"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";

import { DarkCard, DashboardLayout, DashboardLoadingState } from "@/components/common";
import { FolderIcon, PlusIcon } from "@/components/common/Misc/Icons";

import { getThumbnailImageUrl } from "@/lib/constants/images";
import { getProjectStatusStyle } from "@/lib/constants/styles";

import { useGetProjects } from "@/src/projects/projects";

export default function ProjectsPage() {
  const { data: projectsData, isLoading } = useGetProjects();
  const projects = projectsData?.data?.projects || [];

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-xl text-ivory">프로젝트</h1>
            <p className="text-muted-gray mt-1">진행중인 프로젝트를 관리하세요</p>
          </div>
          <Link href="/projects/new">
            <Button variant="gold">
              <PlusIcon className="mr-1 h-4 w-4" /> 새 프로젝트
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <DarkCard className="py-16 text-center">
            <FolderIcon className="text-muted-gray mx-auto mb-4 h-16 w-16" />
            <h2 className="text-ivory mb-2 text-xl font-semibold">프로젝트가 없습니다</h2>
            <p className="text-muted-gray mb-6">새 프로젝트를 만들어 캐스팅을 시작하세요</p>
            <Link href="/projects/new">
              <Button variant="gold">
                <PlusIcon className="mr-1 h-4 w-4" /> 첫 프로젝트 만들기
              </Button>
            </Link>
          </DarkCard>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <DarkCard variant="hover" padding="none" className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={getThumbnailImageUrl(project.thumbnail)}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          getProjectStatusStyle(project.status).badge
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-ivory mb-1 text-lg font-semibold">{project.title}</h3>
                    <p className="text-muted-gray mb-3 text-sm">{project.company}</p>

                    <div className="mb-3">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-muted-gray">캐스팅 진행률</span>
                        <span className="text-gold">{project.progress}%</span>
                      </div>
                      <div className="bg-luxury-tertiary h-1.5 overflow-hidden rounded-full">
                        <div className="bg-gold h-full transition-all" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-gray">{project.createdAt?.slice(0, 10)}</span>
                    </div>
                  </div>
                </DarkCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
