"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMyProfile } from "@/src/users/users";
import { PencilIcon, HeartIcon, SettingsIcon } from "@/app/components/Icons";
import { COLORS } from "@/lib/constants";

function ProfileSkeleton() {
  return (
    <section className="relative h-[420px] bg-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 text-center">
        <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-2" />
        <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-2" />
        <div className="h-4 bg-gray-300 rounded w-64 mx-auto" />
      </div>
    </section>
  );
}

export function ProfileSection() {
  const { data, isLoading } = useGetMyProfile();
  const profile = data?.data;
  const defaultImage = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&crop=face";

  if (isLoading) return <ProfileSkeleton />;

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-5 pt-12 pb-4">
        <h1 className="text-lg font-semibold" style={{ color: COLORS.background.primary }}>
          마이페이지
        </h1>
        <Link href="/mypage/settings" className="w-10 h-10 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6" style={{ color: COLORS.background.primary }} />
        </Link>
      </header>

      <section className="relative h-[420px]">
        <div className="absolute inset-0">
          <Image
            src={profile?.profileImage || defaultImage}
            alt={profile?.name || "프로필"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.background.primary }}>
            {profile?.name || "이름 없음"}
          </h2>
          <p className="text-white/80 text-sm mb-2">
            {profile?.position || "배우"}
            {profile?.agency && ` · ${profile.agency}`}
          </p>
          <p className="text-sm mb-5" style={{ color: COLORS.accent.teal }}>
            {profile?.bio || "한 줄 소개를 입력해주세요"}
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/mypage/settings/profile"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              style={{ color: COLORS.background.primary }}
            >
              <PencilIcon className="w-4 h-4" />
              <span>수정하기</span>
            </Link>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: COLORS.accent.red, color: COLORS.background.primary }}
            >
              <HeartIcon className="w-4 h-4" />
              <span>팬에게 후원받기</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
