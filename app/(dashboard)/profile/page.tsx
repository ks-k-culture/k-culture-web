"use client";

import Image from "next/image";
import Link from "next/link";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout } from "@/components/common";
import { PencilIcon } from "@/components/common/Misc/Icons";

import { useActorProfile } from "@/lib/hooks/use-actor-profile";

import { useGetActorFilmography } from "@/src/filmography/filmography";
import type { FilmographyItem } from "@/src/model";

export default function ProfilePage() {
  const { data: profileData, isLoading } = useActorProfile();
  const profile = profileData?.data;

  const { data: filmographyData } = useGetActorFilmography(profile?.id || "", undefined, {
    query: { enabled: !!profile?.id },
  });
  const filmography = (filmographyData?.data as FilmographyItem[] | undefined) || [];

  if (isLoading || !profile) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Spinner size="md" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-xl text-ivory">내 프로필</h1>
          <Link href="/profile/edit">
            <Button variant="gold-outline" size="sm">
              <PencilIcon className="mr-1 h-4 w-4" /> 수정
            </Button>
          </Link>
        </div>

        <DarkCard>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="bg-luxury-tertiary relative mx-auto flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl md:mx-0 md:h-40 md:w-40">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.stageName || profile.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-muted-gray text-4xl">👤</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-ivory mb-2 text-2xl font-bold">{profile.stageName || profile.name}</h2>
              <p className="text-muted-gray mb-4">{profile.introduction || "소개글이 없습니다"}</p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-muted-gray text-sm">출생년도</p>
                  <p className="text-ivory font-medium">{profile.birthYear ? `${profile.birthYear}년` : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-gray text-sm">소속사</p>
                  <p className="text-ivory font-medium">{profile.agency || "프리랜서"}</p>
                </div>
                <div>
                  <p className="text-muted-gray text-sm">키</p>
                  <p className="text-ivory font-medium">{profile.height ? `${profile.height}cm` : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-gray text-sm">몸무게</p>
                  <p className="text-ivory font-medium">{profile.weight ? `${profile.weight}kg` : "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </DarkCard>

        <DarkCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-ivory text-lg font-semibold">연락처</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-gray">이메일</span>
              <span className="text-ivory">{profile.email}</span>
            </div>
          </div>
        </DarkCard>

        {profile.skills && profile.skills.length > 0 && (
          <DarkCard>
            <h2 className="text-ivory mb-4 text-lg font-semibold">특기</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="bg-gold/10 text-gold rounded-full px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </DarkCard>
        )}

        {profile.languages && profile.languages.length > 0 && (
          <DarkCard>
            <h2 className="text-ivory mb-4 text-lg font-semibold">언어</h2>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang) => (
                <span key={lang} className="bg-gold/10 text-gold rounded-full px-3 py-1 text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </DarkCard>
        )}

        <DarkCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-ivory text-lg font-semibold">
              필모그래피 {filmography.length > 0 && <span className="text-gold">({filmography.length})</span>}
            </h2>
            <Link href="/profile/filmography">
              <Button variant="gold-ghost" size="sm">
                관리
              </Button>
            </Link>
          </div>
          {filmography.length === 0 ? (
            <p className="text-muted-gray py-8 text-center">필모그래피를 추가해보세요</p>
          ) : (
            <div className="space-y-3">
              {filmography.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-luxury-tertiary flex items-center justify-between rounded-lg p-3">
                  <div>
                    <p className="text-ivory font-medium">{item.title}</p>
                    <p className="text-muted-gray text-sm">
                      {item.year} · {item.type} · {item.roleType}
                    </p>
                  </div>
                  <span className="bg-gold/20 text-gold rounded px-2 py-0.5 text-xs">{item.role || "역할 미정"}</span>
                </div>
              ))}
              {filmography.length > 3 && (
                <Link href="/profile/filmography" className="text-gold block pt-2 text-center text-sm hover:underline">
                  +{filmography.length - 3}개 더 보기
                </Link>
              )}
            </div>
          )}
        </DarkCard>

        <DarkCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-ivory text-lg font-semibold">쇼릴</h2>
            <Link href="/profile/showreel">
              <Button variant="gold-ghost" size="sm">
                관리
              </Button>
            </Link>
          </div>
          <p className="text-muted-gray py-8 text-center">쇼릴을 추가해보세요</p>
        </DarkCard>
      </div>
    </DashboardLayout>
  );
}
