"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetMyProfile } from "@/src/users/users";
import {
  useGetActorFilmography,
  useDeleteFilmography,
  getGetActorFilmographyQueryKey,
} from "@/src/filmography/filmography";
import { useQueryClient } from "@tanstack/react-query";
import { PencilIcon, XMarkIcon } from "@/app/components/Icons";
import { PageLayout } from "@/app/components/PageLayout";
import { StickyHeader } from "@/app/components/StickyHeader";
import type { FilmographyItem } from "@/src/model";
import { COLORS } from "@/lib/constants";

function FilmographySkeleton() {
  return (
    <div className="px-5 py-6">
      {[1, 2].map((group) => (
        <div key={group} className="mb-6">
          <div className="h-6 w-16 bg-gray-200 rounded mb-5 animate-pulse" />
          {[1, 2].map((item) => (
            <div key={item} className="flex pb-5 animate-pulse">
              <div className="flex flex-col items-center mr-4">
                <div className="w-2 h-2 rounded-full bg-gray-200 mt-1" />
                <div className="w-px flex-1 mt-1 bg-gray-100" style={{ minHeight: "160px" }} />
              </div>
              <div className="flex flex-1 gap-4">
                <div className="w-[120px] h-[160px] bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 w-12 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
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

export function FilmographyManageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfile();
  const actorId = profileData?.data?.id;

  const { data, isLoading: isFilmographyLoading } = useGetActorFilmography(actorId ?? "", undefined, {
    query: { enabled: !!actorId },
  });

  const { mutate: deleteFilmography, isPending: isDeleting } = useDeleteFilmography({
    mutation: {
      onSuccess: () => {
        if (actorId) {
          queryClient.invalidateQueries({ queryKey: getGetActorFilmographyQueryKey(actorId) });
        }
      },
    },
  });

  const isLoading = isProfileLoading || isFilmographyLoading;
  const filmography = data?.data?.filmography ?? [];
  const groupedFilmography = groupFilmographyByYear(filmography);

  const handleDelete = (id: string) => {
    if (confirm("이 작품을 삭제하시겠습니까?")) {
      deleteFilmography({ filmographyId: id });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/mypage/filmography/edit/${id}`);
  };

  return (
    <PageLayout>
      <StickyHeader title="필모그래피 관리" showBorder />

      {isLoading ? (
        <FilmographySkeleton />
      ) : (
        <main className="px-5 py-6">
          {groupedFilmography.map(({ year, items }, groupIndex) => (
            <div key={year} className="mb-2">
              <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text.primary }}>
                {year}
              </h2>

              <div className="relative">
                {items.map((item, index) => {
                  const isLastInGroup = index === items.length - 1;
                  const isLastGroup = groupIndex === groupedFilmography.length - 1;
                  const showLine = !isLastInGroup || !isLastGroup;

                  return (
                    <div key={item.id} className="relative flex pb-5">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className="w-2 h-2 rounded-full border bg-white z-10 mt-1"
                          style={{ borderColor: COLORS.text.secondary }}
                        />
                        {showLine && (
                          <div
                            className="w-px flex-1 mt-1"
                            style={{ backgroundColor: COLORS.background.secondary, minHeight: "160px" }}
                          />
                        )}
                      </div>

                      <div className="flex flex-1 gap-4">
                        <div className="w-[120px] h-[160px] shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              width={120}
                              height={160}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col pt-1">
                          <span className="text-sm mb-1" style={{ color: COLORS.text.muted }}>
                            {item.type}
                          </span>
                          <h3
                            className="text-base font-semibold leading-snug mb-2 line-clamp-3"
                            style={{ color: COLORS.text.primary }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                            {item.roleType} · {item.role}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-1">
                          <button
                            onClick={() => handleEdit(item.id)}
                            disabled={isDeleting}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            <PencilIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            <XMarkIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filmography.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400 text-center">등록된 필모그래피가 없습니다.</p>
            </div>
          )}
        </main>
      )}
    </PageLayout>
  );
}
