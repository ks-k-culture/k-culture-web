"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMyProfile } from "@/src/users/users";
import { useGetActorFilmography } from "@/src/filmography/filmography";
import { PencilIcon } from "@/app/components/Icons";
import type { FilmographyItem } from "@/src/model";
import { COLORS } from "@/lib/constants";

function FilmographySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-16 h-22 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-12 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function groupFilmographyByYear(filmography: FilmographyItem[]) {
  const grouped: Record<number, FilmographyItem[]> = {};
  filmography.forEach((item) => {
    const year = item.year ?? 0;
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(item);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export function FilmographySection() {
  const { data: profileData } = useGetMyProfile();
  const actorId = profileData?.data?.id;

  const { data, isLoading } = useGetActorFilmography(actorId ?? "", undefined, {
    query: { enabled: !!actorId },
  });

  const filmography = data?.data?.filmography ?? [];
  const groupedFilmography = groupFilmographyByYear(filmography);

  return (
    <section className="px-5 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
          필모그래피
        </h2>
        <Link
          href="/mypage/filmography"
          className="flex items-center gap-1 text-sm hover:opacity-70"
          style={{ color: COLORS.text.disabled }}
        >
          <PencilIcon className="w-4 h-4" />
          <span>수정하기</span>
        </Link>
      </div>

      {isLoading || !actorId ? (
        <FilmographySkeleton />
      ) : filmography.length === 0 ? (
        <div className="text-center py-8" style={{ color: COLORS.text.disabled }}>
          <p>등록된 필모그래피가 없습니다.</p>
          <Link href="/mypage/filmography" className="text-sm mt-2 inline-block" style={{ color: COLORS.accent.teal }}>
            + 필모그래피 추가하기
          </Link>
        </div>
      ) : (
        groupedFilmography.map(({ year, items }) => (
          <div key={year} className="mb-8">
            <h3 className="text-base font-semibold mb-4" style={{ color: COLORS.text.primary }}>
              {year}
            </h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title ?? ""}
                        width={64}
                        height={88}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs mb-1 block" style={{ color: COLORS.text.disabled }}>
                      {item.type}
                    </span>
                    <h4 className="text-sm font-medium leading-snug mb-1 line-clamp-2" style={{ color: COLORS.text.primary }}>
                      {item.title}
                    </h4>
                    <p className="text-xs" style={{ color: COLORS.text.tertiary }}>
                      {item.roleType} · {item.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
