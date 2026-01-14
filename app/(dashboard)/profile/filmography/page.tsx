"use client";

import { useOptimistic, useState, useTransition } from "react";

import Image from "next/image";

import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout, EmptyState, PageHeader } from "@/components/common";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/common/Misc/Icons";

import {
  getGetActorFilmographyQueryKey,
  useDeleteFilmography,
  useGetActorFilmography,
} from "@/src/filmography/filmography";
import type { FilmographyItem } from "@/src/model";
import { useGetMyProfile } from "@/src/users/users";

import { FilmographyFormModal } from "./_components/FilmographyFormModal";

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

export default function FilmographyPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FilmographyItem | null>(null);
  const [, startTransition] = useTransition();

  const { data: profileData } = useGetMyProfile();
  const userId = profileData?.data?.id;

  const { data: filmographyData, isLoading } = useGetActorFilmography(userId || "", undefined, {
    query: { enabled: !!userId },
  });

  const filmography = (filmographyData?.data as FilmographyItem[] | undefined) || [];

  const [optimisticFilmography, removeOptimistic] = useOptimistic(
    filmography,
    (currentFilmography, deletedId: string) => currentFilmography.filter((item) => item.id !== deletedId)
  );

  const deleteMutation = useDeleteFilmography({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetActorFilmographyQueryKey(userId),
        });
        toast.success("필모그래피가 삭제되었습니다");
      },
      onError: () => {
        queryClient.invalidateQueries({
          queryKey: getGetActorFilmographyQueryKey(userId),
        });
        toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
      },
    },
  });

  const groupedFilmography = groupFilmographyByYear(optimisticFilmography);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FilmographyItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("정말 이 필모그래피를 삭제하시겠습니까?")) return;

    startTransition(() => {
      removeOptimistic(id);
    });

    deleteMutation.mutate({ filmographyId: id });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getGetActorFilmographyQueryKey(userId),
    });
    handleModalClose();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <PageHeader
          title="필모그래피 관리"
          backHref="/profile"
          action={
            <Button variant="gold" size="sm" onClick={handleAdd}>
              <PlusIcon className="mr-1 h-4 w-4" /> 추가
            </Button>
          }
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : filmography.length === 0 ? (
          <EmptyState
            description="아직 등록된 필모그래피가 없습니다."
            action={
              <Button variant="gold-outline" onClick={handleAdd}>
                <PlusIcon className="mr-1 h-4 w-4" /> 첫 필모그래피 추가
              </Button>
            }
          />
        ) : (
          <div className="space-y-8">
            {groupedFilmography.map(({ year, items }) => (
              <DarkCard key={year}>
                <h2 className="text-heading-md text-gold mb-4">{year || "기타"}</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-luxury-tertiary hover:bg-luxury-tertiary/80 group flex gap-4 rounded-xl p-4 transition-colors"
                    >
                      {item.thumbnail && (
                        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.thumbnail}
                            alt={item.title || "작품"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-ivory font-medium">{item.title}</p>
                            <p className="text-body-sm text-muted-gray">{item.role}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-gold/20 text-gold text-caption shrink-0 rounded px-2 py-0.5">
                              {item.roleType}
                            </span>
                            <span className="bg-luxury-secondary text-ivory/70 text-caption rounded px-2 py-0.5">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="text-muted-gray hover:text-ivory h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-muted-gray h-8 w-8 p-0 hover:text-red-500"
                          disabled={deleteMutation.isPending}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </div>

      <FilmographyFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingItem={editingItem}
      />
    </DashboardLayout>
  );
}
