"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetFilmographyDetail,
  useUpdateFilmography,
  getGetActorFilmographyQueryKey,
} from "@/src/filmography/filmography";
import { useGetMyProfile } from "@/src/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronDownIcon, XCircleIcon } from "@/app/components/Icons";
import { FilmographyItemType } from "@/src/model/filmographyItemType";
import { FilmographyItemRoleType } from "@/src/model/filmographyItemRoleType";
import { COLORS } from "@/lib/constants";

const roleTypes = Object.values(FilmographyItemRoleType);
const years = Array.from({ length: 30 }, (_, i) => 2024 - i);
const genres = Object.values(FilmographyItemType);

function FormSkeleton() {
  return (
    <div className="flex-1 px-5 py-6 space-y-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i}>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

interface FilmographyEditFormProps {
  filmographyId: string;
}

export function FilmographyEditForm({ filmographyId }: FilmographyEditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profileData } = useGetMyProfile();
  const actorId = profileData?.data?.id;

  const { data, isLoading } = useGetFilmographyDetail(filmographyId, {
    query: { enabled: !!filmographyId },
  });

  const { mutate: updateFilmography, isPending: isUpdating } = useUpdateFilmography({
    mutation: {
      onSuccess: () => {
        if (actorId) {
          queryClient.invalidateQueries({ queryKey: getGetActorFilmographyQueryKey(actorId) });
        }
        router.back();
      },
    },
  });

  const filmographyData = data?.data;

  const [title, setTitle] = useState("");
  const [year, setYear] = useState(2023);
  const [genre, setGenre] = useState<string>(FilmographyItemType.영화);
  const [role, setRole] = useState("");
  const [roleType, setRoleType] = useState<string>(FilmographyItemRoleType.주연);

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  useEffect(() => {
    if (filmographyData) {
      setTitle(filmographyData.title ?? "");
      setYear(filmographyData.year ?? 2023);
      setGenre(filmographyData.type ?? FilmographyItemType.영화);
      setRole(filmographyData.role ?? "");
      setRoleType(filmographyData.roleType ?? FilmographyItemRoleType.주연);
    }
  }, [filmographyData]);

  const handleSave = () => {
    updateFilmography({
      filmographyId,
      data: {
        title,
        year,
        type: genre as (typeof FilmographyItemType)[keyof typeof FilmographyItemType],
        role,
        roleType: roleType as (typeof FilmographyItemRoleType)[keyof typeof FilmographyItemRoleType],
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
              필모그래피 작품 편집
            </h1>
          </div>
        </header>

        <div className="px-5 py-4 border-b" style={{ borderColor: COLORS.border.default }}>
          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
            편집중인 작품
          </p>
          <p className="text-base font-medium mt-1" style={{ color: COLORS.text.primary }}>
            {isLoading ? "로딩중..." : filmographyData?.title || "새 작품"}
          </p>
        </div>

        {isLoading ? (
          <FormSkeleton />
        ) : (
          <main className="flex-1 px-5 py-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                작품명
              </label>
              <div
                className="relative flex items-center border rounded-xl px-4 py-3"
                style={{ borderColor: COLORS.border.default }}
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="작품명을 입력하세요"
                  className="flex-1 text-base outline-none bg-transparent"
                  style={{ color: COLORS.text.primary }}
                />
                {title && (
                  <button onClick={() => setTitle("")} className="ml-2">
                    <XCircleIcon className="w-5 h-5" style={{ color: COLORS.text.disabled }} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                연도
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowGenreDropdown(false);
                  }}
                  className="w-full flex items-center justify-between border rounded-xl px-4 py-3"
                  style={{ borderColor: COLORS.border.default }}
                >
                  <span style={{ color: COLORS.text.primary }}>{year}</span>
                  <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
                </button>
                {showYearDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                    style={{ borderColor: COLORS.border.default }}
                  >
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          setYear(y);
                          setShowYearDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                        style={{ color: year === y ? COLORS.accent.red : COLORS.text.primary }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                장르
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowGenreDropdown(!showGenreDropdown);
                    setShowYearDropdown(false);
                  }}
                  className="w-full flex items-center justify-between border rounded-xl px-4 py-3"
                  style={{ borderColor: COLORS.border.default }}
                >
                  <span style={{ color: COLORS.text.primary }}>{genre}</span>
                  <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
                </button>
                {showGenreDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                    style={{ borderColor: COLORS.border.default }}
                  >
                    {genres.map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setGenre(g);
                          setShowGenreDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                        style={{ color: genre === g ? COLORS.accent.red : COLORS.text.primary }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                역할 배역
              </label>
              <div
                className="relative flex items-center border rounded-xl px-4 py-3"
                style={{ borderColor: COLORS.border.default }}
              >
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="배역 이름을 입력하세요"
                  className="flex-1 text-base outline-none bg-transparent"
                  style={{ color: COLORS.text.primary }}
                />
                {role && (
                  <button onClick={() => setRole("")} className="ml-2">
                    <XCircleIcon className="w-5 h-5" style={{ color: COLORS.text.disabled }} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
                역할 타입
              </label>
              <div className="flex flex-wrap gap-2">
                {roleTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setRoleType(type)}
                    className="px-5 py-3 rounded-lg border text-sm font-medium transition-colors"
                    style={{
                      borderColor: roleType === type ? COLORS.accent.red : COLORS.border.default,
                      color: roleType === type ? COLORS.accent.red : COLORS.text.secondary,
                      backgroundColor: "white",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </main>
        )}

        <div className="sticky bottom-0 bg-white px-5 py-6 border-t" style={{ borderColor: COLORS.border.default }}>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1 py-4 rounded-xl border font-medium disabled:opacity-50"
              style={{ borderColor: COLORS.border.dark, color: COLORS.text.secondary }}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating || isLoading}
              className="flex-[2] py-4 rounded-xl font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: COLORS.text.primary }}
            >
              {isUpdating ? "저장중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
