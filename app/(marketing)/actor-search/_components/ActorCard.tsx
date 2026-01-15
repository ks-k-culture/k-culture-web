"use client";

import { memo, useCallback } from "react";

import Image from "next/image";
import Link from "next/link";

import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui";

import { CheckIcon, HeartIcon, PlusIcon } from "@/components/common/Misc/Icons";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/useAuthStore";
import { CompareActor, useCompareStore } from "@/stores/useCompareStore";

import { getGetFavoritesQueryKey, useAddFavorite, useDeleteFavorite, useGetFavorites } from "@/src/favorites/favorites";
import { FavoriteItem, FavoriteType } from "@/src/model";

interface ActorCardProps {
  actor: {
    id: string;
    name: string;
    imageUrl?: string;
    age?: string;
    filmography?: number;
    tags?: string[];
  };
  isBlurred?: boolean;
}

export const ActorCard = memo(function ActorCard({ actor, isBlurred = false }: ActorCardProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const addActor = useCompareStore((state) => state.addActor);
  const removeActor = useCompareStore((state) => state.removeActor);
  const isInCompare = useCompareStore((state) => state.isInCompare);

  const actorsCount = useCompareStore((state) => state.actors.length);
  const maxActors = useCompareStore((state) => state.maxActors);

  const isSelected = isInCompare(Number(actor.id));
  const isFull = actorsCount >= maxActors;

  const { data: favoritesData } = useGetFavorites(
    isAuthenticated ? { type: "actor" as unknown as FavoriteType } : undefined,
    { query: { enabled: isAuthenticated } }
  );
  const addFavoriteMutation = useAddFavorite();
  const deleteFavoriteMutation = useDeleteFavorite();

  type BackendFavoritesResponse = { content: FavoriteItem[] };
  const favoritesContent = (favoritesData?.data as unknown as BackendFavoritesResponse | undefined)?.content || [];

  const favoriteItem = favoritesContent.find((fav) => fav.targetId === actor.id);
  const isFavorited = !!favoriteItem;

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) return;

      if (isFavorited && favoriteItem?.id) {
        deleteFavoriteMutation.mutate(
          { favoriteId: favoriteItem.id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
            },
          }
        );
      } else {
        addFavoriteMutation.mutate(
          { data: { type: FavoriteType.actor, targetId: actor.id } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
            },
          }
        );
      }
    },
    [isAuthenticated, isFavorited, favoriteItem, actor.id, addFavoriteMutation, deleteFavoriteMutation, queryClient]
  );

  const handleCompareClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSelected) {
        removeActor(Number(actor.id));
      } else if (!isFull) {
        const compareActor: CompareActor = {
          id: Number(actor.id),
          name: actor.name,
          gender: "미정",
          age: 0,
          height: 0,
          weight: 0,
          work: "",
          image: actor.imageUrl || "",
        };
        addActor(compareActor);
      }
    },
    [isSelected, isFull, actor.id, actor.name, actor.imageUrl, removeActor, addActor]
  );

  const cardContent = (
    <div
      className={cn(
        "bg-luxury-black cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 active:scale-[0.98]",
        isSelected ? "border-gold shadow-gold/20 shadow-lg" : "border-border hover:border-muted-gray hover:shadow-lg"
      )}
    >
      <div className="bg-luxury-secondary relative aspect-3/4">
        {actor.imageUrl ? (
          <Image
            src={actor.imageUrl}
            alt={actor.name}
            fill
            className={cn("object-cover", isBlurred && "blur-sm")}
            unoptimized={actor.imageUrl.includes("localhost")}
          />
        ) : (
          <div
            className={cn("bg-luxury-tertiary flex h-full w-full items-center justify-center", isBlurred && "blur-sm")}
          >
            <svg className="text-muted-gray h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}

        {!isBlurred && (
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            {isAuthenticated && (
              <button
                onClick={handleFavoriteClick}
                disabled={addFavoriteMutation.isPending || deleteFavoriteMutation.isPending}
                aria-label={isFavorited ? "찜 취소" : "찜하기"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                  isFavorited
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-luxury-black/70 text-white backdrop-blur-sm hover:bg-red-500"
                )}
              >
                <HeartIcon className={cn("h-4 w-4", isFavorited && "fill-current")} />
              </button>
            )}
            <button
              onClick={handleCompareClick}
              disabled={!isSelected && isFull}
              aria-label={isSelected ? "비교에서 제거" : "비교에 추가"}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                isSelected
                  ? "bg-gold text-luxury-black hover:bg-gold-light"
                  : isFull
                    ? "bg-luxury-black/50 text-muted-gray cursor-not-allowed"
                    : "bg-luxury-black/70 hover:bg-gold hover:text-luxury-black text-white backdrop-blur-sm"
              )}
            >
              {isSelected ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
            </button>
          </div>
        )}

        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center">
              <svg className="mx-auto mb-2 h-8 w-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-caption text-white/80">로그인하고 보기</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className={cn("text-ivory mb-2 font-bold", isBlurred && "blur-sm")}>{isBlurred ? "***" : actor.name}</h3>

        <div className="text-body-sm text-muted-gray mb-3 space-y-1">
          <div className="flex items-center gap-2">
            <span>{actor.age || "정보없음"}</span>
            {actor.filmography && actor.filmography > 0 && (
              <span className="text-muted-gray">· 작품 {actor.filmography}편</span>
            )}
          </div>
        </div>

        {actor.tags && actor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {actor.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-gold/10 text-gold border-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isBlurred) {
    return <Link href="/login">{cardContent}</Link>;
  }

  return <Link href={`/actors/${actor.id}`}>{cardContent}</Link>;
});
