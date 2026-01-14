"use client";

import Link from "next/link";

import { Button, Spinner } from "@/components/ui";

import { DarkCard } from "@/components/common";
import { EyeIcon, HeartIcon, PhoneIcon, PlusIcon } from "@/components/common/Misc/Icons";

import { useGetDashboardStats } from "@/src/dashboard/dashboard";
import type { ActivityResponse, ActorDashboardStats } from "@/src/model";

import { StatCard } from "./StatCard";

const DEFAULT_STATS: ActorDashboardStats = {
  profileViews: 0,
  likes: 0,
  contactRequests: 0,
  profileCompleteness: 0,
  recentActivities: [],
};

export function ActorDashboard() {
  const { data: response, isLoading, isError } = useGetDashboardStats();
  const stats = (response?.data as ActorDashboardStats) ?? DEFAULT_STATS;

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
      <ProfileCompleteness completeness={stats.profileCompleteness} />
      <StatsGrid stats={stats} />
      <RecentActivity activities={stats.recentActivities ?? []} />
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-heading-xl text-ivory">대시보드</h1>
        <p className="text-muted-gray mt-1">내 활동 현황을 확인하세요</p>
      </div>
      <Link href="/profile/edit">
        <Button variant="gold-outline" size="sm">
          프로필 수정
        </Button>
      </Link>
    </div>
  );
}

function ProfileCompleteness({ completeness }: { completeness: number }) {
  return (
    <DarkCard variant="gold">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-ivory text-lg font-semibold">프로필 완성도</h2>
        <span className="text-gold text-2xl font-bold">{completeness}%</span>
      </div>
      <div className="bg-luxury-tertiary mb-4 h-2 overflow-hidden rounded-full">
        <div className="bg-gold h-full transition-all duration-500" style={{ width: `${completeness}%` }} />
      </div>
      <p className="text-muted-gray text-sm">프로필을 완성하면 더 많은 캐스팅 기회를 얻을 수 있습니다</p>
      <div className="mt-4 flex gap-2">
        <Link href="/profile/filmography">
          <Button variant="gold-ghost" size="sm">
            <PlusIcon className="mr-1 h-4 w-4" /> 필모그래피 추가
          </Button>
        </Link>
        <Link href="/profile/showreel">
          <Button variant="gold-ghost" size="sm">
            <PlusIcon className="mr-1 h-4 w-4" /> 쇼릴 추가
          </Button>
        </Link>
      </div>
    </DarkCard>
  );
}

function StatsGrid({ stats }: { stats: ActorDashboardStats }) {
  const statItems = [
    {
      icon: EyeIcon,
      bgColor: "bg-blue-500/10",
      color: "text-blue-400",
      label: "프로필 조회",
      value: stats.profileViews,
    },
    { icon: HeartIcon, bgColor: "bg-red-500/10", color: "text-red-400", label: "찜", value: stats.likes },
    {
      icon: PhoneIcon,
      bgColor: "bg-green-500/10",
      color: "text-green-400",
      label: "섭외 요청",
      value: stats.contactRequests,
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

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function RecentActivity({ activities }: { activities: ActivityResponse[] }) {
  const iconConfig = {
    view: { icon: EyeIcon, bgColor: "bg-blue-500/10", color: "text-blue-400" },
    like: { icon: HeartIcon, bgColor: "bg-red-500/10", color: "text-red-400" },
    contact: { icon: PhoneIcon, bgColor: "bg-green-500/10", color: "text-green-400" },
  };

  return (
    <DarkCard>
      <h2 className="text-ivory mb-4 text-lg font-semibold">최근 활동</h2>
      {activities.length === 0 ? (
        <p className="text-muted-gray py-8 text-center text-sm">아직 활동 내역이 없습니다</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = iconConfig[activity.type] || iconConfig.view;
            const { icon: Icon, bgColor, color } = config;
            return (
              <div key={activity.id} className="flex items-center gap-4 text-sm">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-warm-gray">{activity.message}</p>
                  <p className="text-muted-gray">{formatTimeAgo(activity.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DarkCard>
  );
}
