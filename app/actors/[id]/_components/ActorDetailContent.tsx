"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetActorDetail, useContactActor, useDownloadActorPortfolio } from "@/src/actors/actors";
import { ChevronLeftIcon, ShareIcon, PlayIcon, DownloadIcon, PhoneIcon } from "./Icons";
import type { FilmographyItem } from "@/src/model";

function ActorDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen pb-24 animate-pulse">
        <div className="h-[480px] bg-gray-200" />
        <section className="px-5 py-8">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-22 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 w-12 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
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

interface ActorDetailContentProps {
  actorId: string;
}

export function ActorDetailContent({ actorId }: ActorDetailContentProps) {
  const router = useRouter();

  const { data, isLoading } = useGetActorDetail(actorId, {
    query: { enabled: !!actorId },
  });

  const { mutate: contactActor, isPending: isContacting } = useContactActor();
  const { refetch: downloadPortfolio, isFetching: isDownloading } = useDownloadActorPortfolio(actorId, {
    query: { enabled: false },
  });

  const actor = data?.data;

  const handleContact = () => {
    if (!actor) return;
    contactActor({
      actorId: actor.id,
      data: {
        projectId: "",
        message: "캐스팅 제안드립니다.",
      },
    });
  };

  const handleDownloadPortfolio = async () => {
    const result = await downloadPortfolio();
    if (result.data) {
      const url = window.URL.createObjectURL(result.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${actor?.name ?? "actor"}_portfolio.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (isLoading) {
    return <ActorDetailSkeleton />;
  }

  if (!actor) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500">배우 정보를 찾을 수 없습니다.</p>
          <Link href="/recommend" className="mt-4 text-teal-500 underline">
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const groupedFilmography = groupFilmographyByYear(actor.filmography ?? []);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen pb-24">
        <section className="relative h-[480px]">
          <div className="absolute inset-0">
            {actor.profileImage ? (
              <Image src={actor.profileImage} alt={actor.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          </div>

          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 pt-12 pb-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <ShareIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{actor.name}</h1>
            <p className="text-white/80 text-sm mb-3">
              {actor.birthYear}년생 · 필모 {actor.filmographyCount ?? 0}편
            </p>
            <p className="text-teal-300 text-sm">{actor.introduction}</p>
          </div>
        </section>

        <section className="px-5 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">필모그래피</h2>

          {groupedFilmography.length === 0 ? (
            <p className="text-gray-400 text-center py-8">등록된 필모그래피가 없습니다.</p>
          ) : (
            groupedFilmography.map(({ year, items }) => (
              <div key={year} className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{year}</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={64}
                            height={88}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400 mb-1 block">{item.type}</span>
                        <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">
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

        <section className="px-5 py-6 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">스킬 및 특기</h2>
          <div className="flex flex-wrap gap-2">
            {(actor.skills ?? []).length === 0 ? (
              <p className="text-gray-400">등록된 스킬이 없습니다.</p>
            ) : (
              (actor.skills ?? []).map((skill, index) => (
                <span key={index} className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full">
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="px-5 py-6 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">대표 영상</h2>
          <div className="space-y-4">
            {(actor.showreels ?? []).length === 0 ? (
              <p className="text-gray-400">등록된 대표 영상이 없습니다.</p>
            ) : (
              (actor.showreels ?? []).map((showreel) => (
                <div key={showreel.id} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2">
                    {showreel.thumbnail ? (
                      <Image
                        src={showreel.thumbnail}
                        alt={showreel.title ?? "쇼릴"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <PlayIcon className="w-6 h-6 text-gray-800 ml-1" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{showreel.title}</h3>
                  <p className="text-xs text-gray-400">{showreel.duration}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100">
          <div className="max-w-lg mx-auto px-5 py-4 flex gap-3">
            <button
              onClick={handleDownloadPortfolio}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>{isDownloading ? "다운로드중..." : "포트폴리오"}</span>
            </button>
            <button
              onClick={handleContact}
              disabled={isContacting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-400 rounded-xl text-white font-medium hover:bg-teal-500 transition-colors disabled:opacity-50"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>{isContacting ? "전송중..." : "연락하기"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

