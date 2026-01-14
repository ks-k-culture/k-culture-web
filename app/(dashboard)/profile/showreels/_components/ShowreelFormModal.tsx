"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button, Spinner } from "@/components/ui";

import { Modal } from "@/components/common/Misc";

import {
  type CreateShowreelRequest,
  type ShowreelResponse,
  useCreateShowreel,
  useUpdateShowreel,
} from "@/lib/showreel-api";

const showreelFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200),
  videoUrl: z.string().min(1, "영상 URL을 입력해주세요").url("올바른 URL 형식을 입력해주세요"),
  thumbnailUrl: z.string().url("올바른 URL 형식을 입력해주세요").optional().or(z.literal("")),
  duration: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  workTitle: z.string().max(200).optional().or(z.literal("")),
  genre: z.string().max(50).optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
  tags: z.string().optional(),
});

type ShowreelFormInput = z.input<typeof showreelFormSchema>;
type ShowreelFormData = z.output<typeof showreelFormSchema>;

interface ShowreelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingItem?: ShowreelResponse | null;
}

const GENRE_OPTIONS = ["드라마", "영화", "예능", "광고", "뮤직비디오", "뮤지컬", "연극", "웹드라마", "기타"];

export function ShowreelFormModal({ isOpen, onClose, onSuccess, editingItem }: ShowreelFormModalProps) {
  const isEditing = !!editingItem;

  const createMutation = useCreateShowreel();
  const updateMutation = useUpdateShowreel();

  const defaultValues = useMemo<ShowreelFormInput>(
    () => ({
      title: editingItem?.title ?? "",
      videoUrl: editingItem?.videoUrl ?? "",
      thumbnailUrl: editingItem?.thumbnailUrl ?? "",
      duration: editingItem?.duration?.toString() ?? "",
      workTitle: editingItem?.workTitle ?? "",
      genre: editingItem?.genre ?? "",
      description: editingItem?.description ?? "",
      tags: editingItem?.tags?.join(", ") ?? "",
    }),
    [editingItem]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShowreelFormInput, unknown, ShowreelFormData>({
    resolver: zodResolver(showreelFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset, defaultValues]);

  const onSubmit: SubmitHandler<ShowreelFormData> = async (data) => {
    const requestData: CreateShowreelRequest = {
      title: data.title,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl || undefined,
      duration: data.duration,
      workTitle: data.workTitle || undefined,
      genre: data.genre || undefined,
      description: data.description || undefined,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    };

    try {
      if (isEditing && editingItem) {
        await updateMutation.mutateAsync({ showreelId: editingItem.id, data: requestData });
        toast.success("쇼릴이 수정되었습니다");
      } else {
        await createMutation.mutateAsync(requestData);
        toast.success("쇼릴이 추가되었습니다");
      }
      onSuccess();
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "쇼릴 수정" : "쇼릴 추가"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-ivory mb-1 block text-sm font-medium">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="예: 드라마 '별들의 고향' 하이라이트"
            className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-ivory mb-1 block text-sm font-medium">
            영상 URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            {...register("videoUrl")}
            placeholder="https://youtube.com/watch?v=... 또는 https://vimeo.com/..."
            className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
          />
          {errors.videoUrl && <p className="mt-1 text-sm text-red-500">{errors.videoUrl.message}</p>}
          <p className="text-muted-gray mt-1 text-xs">YouTube, Vimeo 등 영상 링크를 입력해주세요</p>
        </div>

        <div>
          <label className="text-ivory mb-1 block text-sm font-medium">썸네일 URL</label>
          <input
            type="url"
            {...register("thumbnailUrl")}
            placeholder="https://example.com/thumbnail.jpg"
            className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
          />
          {errors.thumbnailUrl && <p className="mt-1 text-sm text-red-500">{errors.thumbnailUrl.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-ivory mb-1 block text-sm font-medium">관련 작품명</label>
            <input
              type="text"
              {...register("workTitle")}
              placeholder="예: 별들의 고향"
              className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-ivory mb-1 block text-sm font-medium">장르</label>
            <select
              {...register("genre")}
              className="bg-luxury-tertiary border-border text-ivory focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
            >
              <option value="">선택하세요</option>
              {GENRE_OPTIONS.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-ivory mb-1 block text-sm font-medium">영상 길이 (초)</label>
          <input
            type="number"
            {...register("duration")}
            placeholder="예: 180"
            min={0}
            className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
          />
          <p className="text-muted-gray mt-1 text-xs">초 단위로 입력 (예: 3분 = 180)</p>
        </div>

        <div>
          <label className="text-ivory mb-1 block text-sm font-medium">설명</label>
          <textarea
            {...register("description")}
            placeholder="쇼릴에 대한 간단한 설명을 입력해주세요"
            rows={3}
            className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full resize-none rounded-lg border px-4 py-2.5 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-ivory mb-1 block text-sm font-medium">태그</label>
          <input
            type="text"
            {...register("tags")}
            placeholder="예: 감정연기, 액션, 로맨스"
            className="bg-luxury-tertiary border-border text-ivory placeholder:text-muted-gray focus:border-gold w-full rounded-lg border px-4 py-2.5 focus:outline-none"
          />
          <p className="text-muted-gray mt-1 text-xs">콤마(,)로 구분하여 입력해주세요</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button type="submit" variant="gold" disabled={isPending}>
            {isPending ? <Spinner size="sm" /> : isEditing ? "수정" : "추가"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
