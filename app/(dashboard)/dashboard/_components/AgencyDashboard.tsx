"use client";

import Link from "next/link";

import { Button, Spinner } from "@/components/ui";

import { DarkCard } from "@/components/common";
import { ChartBarIcon, HeartIcon, PhoneIcon, PlusIcon, UserIcon } from "@/components/common/Misc/Icons";

import { useGetDashboardStats } from "@/src/dashboard/dashboard";
import type { AgencyDashboardStats } from "@/src/model";

import { StatCard } from "./StatCard";

const DEFAULT_STATS: AgencyDashboardStats = {
  activeProjects: 0,
  favoriteActors: 0,
  sentContacts: 0,
  totalCharacters: 0,
};

export function AgencyDashboard() {
  const { data: response, isLoading, isError } = useGetDashboardStats();
  const stats = (response?.data as AgencyDashboardStats) ?? DEFAULT_STATS;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <DarkCard className="text-center">
        <p className="text-muted-gray">통계를 불러오는데 실패했습니다.</p>
        <Button variant="gold-ghost" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </DarkCard>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsGrid stats={stats} />
      <ActiveProjects />
      <QuickActions />
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-ivory text-2xl font-bold">대시보드</h1>
        <p className="text-muted-gray mt-1">프로젝트와 캐스팅 현황을 확인하세요</p>
      </div>
      <Link href="/projects/new">
        <Button size="sm" variant="gold">
          <PlusIcon className="mr-1 h-4 w-4" /> 새 프로젝트
        </Button>
      </Link>
    </div>
  );
}

function StatsGrid({ stats }: { stats: AgencyDashboardStats }) {
  const statItems = [
    {
      icon: ChartBarIcon,
      bgColor: "bg-gold/10",
      color: "text-gold",
      label: "진행중 프로젝트",
      value: stats.activeProjects,
    },
    {
      icon: HeartIcon,
      bgColor: "bg-red-500/10",
      color: "text-red-400",
      label: "찜한 배우",
      value: stats.favoriteActors,
    },
    {
      icon: PhoneIcon,
      bgColor: "bg-green-500/10",
      color: "text-green-400",
      label: "보낸 섭외",
      value: stats.sentContacts,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {statItems.map(({ icon: Icon, bgColor, color, label, value }) => (
        <StatCard
          key={label}
          icon={<Icon className="h-6 w-6" />}
          iconBgColor={bgColor}
          iconColor={color}
          label={label}
          value={value}
        />
      ))}
    </div>
  );
}

function ActiveProjects() {
  // TODO: 백엔드 projects API 연동 예정
  const projects: { name: string; progress: number; roles: number }[] = [];

  return (
    <DarkCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-ivory text-lg font-semibold">진행중 프로젝트</h2>
        <Link href="/projects" className="text-gold hover:text-gold-light text-sm">
          전체보기
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-gray text-sm">아직 진행중인 프로젝트가 없습니다</p>
          <Link href="/projects/new">
            <Button variant="gold-ghost" size="sm" className="mt-4">
              <PlusIcon className="mr-1 h-4 w-4" /> 프로젝트 만들기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      )}
    </DarkCard>
  );
}

function ProjectCard({ name, progress, roles }: { name: string; progress: number; roles: number }) {
  return (
    <div className="bg-luxury-tertiary/50 flex items-center gap-4 rounded-xl p-3">
      <div className="flex-1">
        <p className="text-ivory font-medium">{name}</p>
        <p className="text-muted-gray text-sm">{roles}개 배역</p>
      </div>
      <div className="w-24">
        <div className="bg-luxury-tertiary h-1.5 overflow-hidden rounded-full">
          <div className="bg-gold h-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted-gray mt-1 text-right text-xs">{progress}%</p>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { href: "/actor-search", icon: UserIcon, title: "배우 검색", description: "조건에 맞는 배우를 찾아보세요" },
    { href: "/ai-matching", icon: ChartBarIcon, title: "AI 매칭", description: "시놉시스로 배우를 추천받으세요" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {actions.map(({ href, icon: Icon, title, description }) => (
        <Link key={href} href={href}>
          <DarkCard variant="hover" className="group">
            <div className="flex items-center gap-4">
              <div className="bg-luxury-tertiary group-hover:bg-gold/10 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                <Icon className="text-muted-gray group-hover:text-gold h-6 w-6 transition-colors" />
              </div>
              <div>
                <p className="text-ivory font-medium">{title}</p>
                <p className="text-muted-gray text-sm">{description}</p>
              </div>
            </div>
          </DarkCard>
        </Link>
      ))}
    </div>
  );
}
