"use client";

import { useOptimistic, useState, useTransition } from "react";

import Image from "next/image";

import { toast } from "sonner";

import { Button, Spinner } from "@/components/ui";

import { DarkCard, DashboardLayout, EmptyState, PageHeader } from "@/components/common";
import { PencilIcon, PlayIcon, PlusIcon, TrashIcon } from "@/components/common/Misc/Icons";

import { type ShowreelResponse, useDeleteShowreel, useGetMyShowreels } from "@/lib/showreel-api";

import { ShowreelFormModal, VideoPlayerModal } from "./_components";

export default function ShowreelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShowreelResponse | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title?: string } | null>(null);
  const [, startTransition] = useTransition();

  const { data: showreelsData, isLoading, refetch } = useGetMyShowreels();
  const showreels = showreelsData?.data || [];

  const [optimisticShowreels, removeOptimistic] = useOptimistic(showreels, (current, deletedId: string) =>
    current.filter((item) => item.id !== deletedId)
  );

  const deleteMutation = useDeleteShowreel();

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ShowreelResponse) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 쇼릴을 삭제하시겠습니까?")) return;

    startTransition(() => {
      removeOptimistic(id);
    });

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("쇼릴이 삭제되었습니다");
    } catch {
      refetch();
      toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handlePlay = (item: ShowreelResponse) => {
    setPlayingVideo({ url: item.videoUrl, title: item.title });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleModalSuccess = () => {
    refetch();
    handleModalClose();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <PageHeader
          title="쇼릴 관리"
          backHref="/profile"
          description="쇼릴은 배우님의 연기 하이라이트를 보여주는 영상입니다. YouTube나 Vimeo 링크를 등록해주세요."
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
        ) : showreels.length === 0 ? (
          <EmptyState
            icon={<PlayIcon className="text-gold h-8 w-8" />}
            description="아직 등록된 쇼릴이 없습니다."
            action={
              <Button variant="gold-outline" onClick={handleAdd}>
                <PlusIcon className="mr-1 h-4 w-4" /> 첫 쇼릴 추가
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {optimisticShowreels.map((item) => (
              <DarkCard key={item.id} className="group overflow-hidden p-0">
                <div
                  className="relative aspect-video cursor-pointer bg-black"
                  onClick={() => handlePlay(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handlePlay(item)}
                >
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="bg-luxury-tertiary flex h-full w-full items-center justify-center">
                      <PlayIcon className="text-muted-gray h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="bg-gold flex h-14 w-14 items-center justify-center rounded-full">
                      <PlayIcon className="text-luxury-black ml-1 h-7 w-7" />
                    </div>
                  </div>
                  {item.durationFormatted && (
                    <span className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                      {item.durationFormatted}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-ivory truncate font-medium">{item.title}</h3>
                      {item.workTitle && <p className="text-muted-gray truncate text-sm">{item.workTitle}</p>}
                    </div>
                    {item.genre && (
                      <span className="bg-gold/20 text-gold shrink-0 rounded px-2 py-0.5 text-xs">{item.genre}</span>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-luxury-tertiary text-ivory/70 rounded px-2 py-0.5 text-xs">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && <span className="text-muted-gray text-xs">+{item.tags.length - 3}</span>}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-gray text-xs">조회수 {item.viewCount?.toLocaleString() || 0}회</span>
                    <div className="flex items-center gap-1">
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
                </div>
              </DarkCard>
            ))}
          </div>
        )}
      </div>

      <ShowreelFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingItem={editingItem}
      />

      {playingVideo && (
        <VideoPlayerModal
          isOpen={!!playingVideo}
          onClose={() => setPlayingVideo(null)}
          videoUrl={playingVideo.url}
          title={playingVideo.title}
        />
      )}
    </DashboardLayout>
  );
}
