"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { ChevronLeftIcon, HeartIcon, ShareIcon } from "@/components/common/Misc/Icons";

interface ActorProfileHeaderProps {
  name: string;
  englishName?: string;
  birthYear?: number;
  introduction?: string;
  profileImage?: string;
  height?: number;
  weight?: number;
  nationality?: string;
  gender?: string;
  agency?: string;
  viewCount?: number;
  likeCount?: number;
  isFavorited?: boolean;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
}

export function ActorProfileHeader({
  name,
  englishName,
  birthYear,
  introduction,
  profileImage,
  height,
  weight,
  gender,
  agency,
  viewCount = 0,
  likeCount = 0,
  isFavorited = false,
  onFavoriteClick,
  onShareClick,
}: ActorProfileHeaderProps) {
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - birthYear + 1 : null;

  return (
    <section className="relative">
      <div className="bg-luxury-black border-border sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3">
        <button
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="text-ivory hover:text-gold flex items-center gap-1 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-muted-gray text-xs">조회수</span>
            <p className="text-ivory text-sm font-semibold">{viewCount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <span className="text-muted-gray text-xs">좋아요</span>
            <p className="text-ivory text-sm font-semibold">{likeCount.toLocaleString()}</p>
          </div>
          <button
            onClick={onFavoriteClick}
            aria-label={isFavorited ? "찜 취소" : "찜하기"}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              isFavorited ? "bg-red-500 text-white" : "bg-luxury-tertiary text-ivory hover:bg-red-500 hover:text-white"
            }`}
          >
            <HeartIcon className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={onShareClick}
            aria-label="공유하기"
            className="bg-luxury-tertiary text-ivory hover:bg-luxury-secondary flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="bg-luxury-black flex-1 px-6 py-8 lg:max-w-md">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-display-sm text-ivory">{name}</h1>
              <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">배우</span>
            </div>
            {englishName && <p className="text-muted-gray mt-1 text-sm">{englishName}</p>}
          </div>

          {gender && (
            <div className="mb-4">
              <span className="border-gold text-gold rounded-full border px-3 py-1 text-xs">{gender}</span>
            </div>
          )}

          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-gray text-sm">🏢</span>
              <span className="text-ivory text-sm">{agency || "소속사 없음"}</span>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {age && (
              <div className="flex items-center gap-4">
                <span className="text-ivory w-24 text-sm">
                  {age}세 ({birthYear})
                </span>
                <div className="bg-luxury-tertiary h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="from-gold to-gold-light h-full rounded-full bg-gradient-to-r"
                    style={{ width: `${Math.min((age / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {height && (
              <div className="flex items-center gap-4">
                <span className="text-ivory w-24 text-sm">{height} cm</span>
                <div className="bg-luxury-tertiary h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="from-gold to-gold-light h-full rounded-full bg-gradient-to-r"
                    style={{ width: `${Math.min(((height - 140) / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {weight && (
              <div className="flex items-center gap-4">
                <span className="text-ivory w-24 text-sm">{weight} kg</span>
                <div className="bg-luxury-tertiary h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="from-gold to-gold-light h-full rounded-full bg-gradient-to-r"
                    style={{ width: `${Math.min(((weight - 30) / 70) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {introduction && (
            <div className="border-gold/30 border-l-2 pl-4">
              <p className="text-ivory/90 text-sm leading-relaxed whitespace-pre-wrap">{introduction}</p>
            </div>
          )}
        </div>

        <div className="relative aspect-[3/4] w-full lg:aspect-auto lg:h-[600px] lg:flex-1">
          {profileImage ? (
            <Image src={profileImage} alt={name} fill className="object-cover object-top" priority />
          ) : (
            <div className="bg-luxury-tertiary flex h-full w-full items-center justify-center">
              <span className="text-muted-gray text-6xl">👤</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-black/20" />
        </div>
      </div>
    </section>
  );
}
