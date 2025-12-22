"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMyProfile } from "@/src/users/users";
import { useGetActorShowreels } from "@/src/showreels/showreels";
import { PencilIcon, PlayIcon } from "./Icons";

function ShowreelSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      ))}
    </div>
  );
}

export function ShowreelSection() {
  const { data: profileData } = useGetMyProfile();
  const actorId = profileData?.data?.id;

  const { data, isLoading } = useGetActorShowreels(actorId ?? "", {
    query: { enabled: !!actorId },
  });

  const showreels = data?.data?.showreels ?? [];

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">대표 영상</h2>
        <Link href="/mypage/showreel" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
          <PencilIcon className="w-4 h-4" />
          <span>수정하기</span>
        </Link>
      </div>

      {isLoading || !actorId ? (
        <ShowreelSkeleton />
      ) : showreels.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>등록된 대표 영상이 없습니다.</p>
          <Link href="/mypage/showreel" className="text-teal-500 text-sm mt-2 inline-block">
            + 대표 영상 추가하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {showreels.map((showreel) => (
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
          ))}
        </div>
      )}
    </section>
  );
}
