"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, Spinner } from "@/components/ui";

import { Modal } from "@/components/common";

import { useCreateFilmography, useUpdateFilmography } from "@/src/filmography/filmography";
import type { FilmographyItem } from "@/src/model";
import { FilmographyItemRoleType, FilmographyItemType } from "@/src/model";

const filmographySchema = z.object({
  title: z.string().min(1, "작품 제목을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  year: z
    .string()
    .min(1, "연도를 입력해주세요")
    .refine((val) => !isNaN(Number(val)), "숫자를 입력해주세요")
    .refine((val) => Number(val) >= 1900, "1900년 이후로 입력해주세요")
    .refine((val) => Number(val) <= 2100, "올바른 연도를 입력해주세요")
    .transform(Number),
  type: z.enum(["영화", "드라마", "뮤지컬", "연극", "웹드라마", "광고", "기타"]),
  role: z.string().max(50, "50자 이내로 입력해주세요").optional(),
  roleType: z.enum(["주연", "조연", "단역", "엑스트라", "특별출연"]),
  thumbnail: z.string().url("올바른 URL을 입력해주세요").optional().or(z.literal("")),
});

type FilmographyFormData = z.output<typeof filmographySchema>;
type FilmographyFormInput = z.input<typeof filmographySchema>;

interface FilmographyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingItem: FilmographyItem | null;
}

export function FilmographyFormModal({ isOpen, onClose, onSuccess, editingItem }: FilmographyFormModalProps) {
  const isEditing = !!editingItem;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilmographyFormInput, unknown, FilmographyFormData>({
    resolver: zodResolver(filmographySchema),
    defaultValues: {
      title: "",
      year: String(new Date().getFullYear()),
      type: "영화",
      role: "",
      roleType: "조연",
      thumbnail: "",
    },
  });

  const createMutation = useCreateFilmography({
    mutation: {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    },
  });

  const updateMutation = useUpdateFilmography({
    mutation: {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (editingItem) {
      reset({
        title: editingItem.title,
        year: String(editingItem.year),
        type: editingItem.type as FilmographyFormInput["type"],
        role: editingItem.role || "",
        roleType: (editingItem.roleType as FilmographyFormInput["roleType"]) || "조연",
        thumbnail: editingItem.thumbnail || "",
      });
    } else {
      reset({
        title: "",
        year: String(new Date().getFullYear()),
        type: "영화",
        role: "",
        roleType: "조연",
        thumbnail: "",
      });
    }
  }, [editingItem, reset]);

  const onSubmit: SubmitHandler<FilmographyFormData> = (data) => {
    const payload = {
      title: data.title,
      year: data.year,
      type: data.type,
      role: data.role || undefined,
      roleType: data.roleType,
      thumbnail: data.thumbnail || undefined,
    };

    if (isEditing && editingItem) {
      updateMutation.mutate({
        filmographyId: editingItem.id,
        data: payload,
      });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "필모그래피 수정" : "필모그래피 추가"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-ivory mb-2 block text-sm font-medium">
            작품 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className="border-luxury-tertiary bg-luxury-secondary text-ivory focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
            placeholder="작품 제목을 입력하세요"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">
              출연 연도 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("year")}
              className="border-luxury-tertiary bg-luxury-secondary text-ivory focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
              placeholder="2024"
            />
            {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
          </div>

          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">
              작품 유형 <span className="text-red-500">*</span>
            </label>
            <select
              {...register("type")}
              className="border-luxury-tertiary bg-luxury-secondary text-ivory focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
            >
              {Object.values(FilmographyItemType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">배역명</label>
            <input
              type="text"
              {...register("role")}
              className="border-luxury-tertiary bg-luxury-secondary text-ivory focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
              placeholder="예: 김철수 역"
            />
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <div>
            <label className="text-ivory mb-2 block text-sm font-medium">
              역할 유형 <span className="text-red-500">*</span>
            </label>
            <select
              {...register("roleType")}
              className="border-luxury-tertiary bg-luxury-secondary text-ivory focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
            >
              {Object.values(FilmographyItemRoleType).map((roleType) => (
                <option key={roleType} value={roleType}>
                  {roleType}
                </option>
              ))}
            </select>
            {errors.roleType && <p className="mt-1 text-sm text-red-500">{errors.roleType.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-ivory mb-2 block text-sm font-medium">썸네일 URL</label>
          <input
            type="text"
            {...register("thumbnail")}
            className="border-luxury-tertiary bg-luxury-secondary text-ivory focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
            placeholder="https://example.com/image.jpg"
          />
          {errors.thumbnail && <p className="mt-1 text-sm text-red-500">{errors.thumbnail.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button type="submit" variant="gold" disabled={isPending}>
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            {isEditing ? "수정하기" : "추가하기"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
