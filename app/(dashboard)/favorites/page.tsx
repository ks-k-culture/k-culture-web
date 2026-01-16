"use client";

import { useCallback } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";

import { DarkCard, DashboardLayout, DashboardLoadingState } from "@/components/common";
import { HeartIcon, XMarkIcon } from "@/components/common/Misc/Icons";

import { getActorImageUrl } from "@/lib/constants/images";
import { GRADIENT_OVERLAYS } from "@/lib/constants/styles";

import { useDeleteFavorite, useGetFavorites } from "@/src/favorites/favorites";
import { FavoriteItem } from "@/src/model";

export default function FavoritesPage() {
  const { data: favoritesData, isLoading, refetch } = useGetFavorites({ type: "actor" });
  const deleteFavoriteMutation = useDeleteFavorite();

  type BackendResponse = {
    content: FavoriteItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  const responseData = favoritesData?.data as unknown as BackendResponse | undefined;
  const favorites = responseData?.content || [];

  const handleRemove = useCallback(
    (id: string) => {
      deleteFavoriteMutation.mutate({ favoriteId: id }, { onSuccess: () => refetch() });
    },
    [deleteFavoriteMutation, refetch]
  );

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-heading-xl text-ivory">찜 목록</h1>
          <p className="text-muted-gray mt-1">관심있는 배우를 저장하고 관리하세요</p>
        </div>

        {favorites.length === 0 ? (
          <DarkCard className="py-16 text-center">
            <HeartIcon className="text-muted-gray mx-auto mb-4 h-16 w-16" />
            <h2 className="text-ivory mb-2 text-xl font-semibold">찜한 배우가 없습니다</h2>
            <p className="text-muted-gray mb-6">배우 검색에서 마음에 드는 배우를 찜해보세요</p>
            <Link href="/actor-search">
              <Button variant="gold">배우 검색하기</Button>
            </Link>
          </DarkCard>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((item) => (
              <DarkCard key={item.id} variant="hover" padding="none" className="group overflow-hidden">
                <Link href={`/actors/${item.targetId}`}>
                  <div className="relative aspect-3/4">
                    <Image
                      src={getActorImageUrl(item.actor?.imageUrl)}
                      alt={item.actor?.name || ""}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 ${GRADIENT_OVERLAYS.DARK_TO_TRANSPARENT}`} />
                    <div className="absolute right-0 bottom-0 left-0 p-4">
                      <h3 className="mb-1 text-lg font-semibold text-white">{item.actor?.name}</h3>
                      <p className="text-warm-gray mb-2 text-sm">
                        {item.actor?.age} · 필모 {item.actor?.filmography}편
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.actor?.tags?.map((tag) => (
                          <span key={tag} className="bg-gold/20 text-gold rounded px-2 py-0.5 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(item.id!);
                  }}
                  disabled={deleteFavoriteMutation.isPending}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-all hover:scale-110 hover:bg-red-500"
                  aria-label="찜 삭제"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>

                <div className="border-border border-t p-3">
                  <div className="flex gap-2">
                    <Link href={`/actors/${item.targetId}`} className="flex-1">
                      <Button variant="gold-secondary" size="sm" fullWidth>
                        프로필 보기
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item.id!);
                      }}
                      disabled={deleteFavoriteMutation.isPending}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
