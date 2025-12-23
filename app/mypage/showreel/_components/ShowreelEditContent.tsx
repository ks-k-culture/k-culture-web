"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMyProfile } from "@/src/users/users";
import { useCreateShowreel, getGetActorShowreelsQueryKey } from "@/src/showreels/showreels";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronDownIcon, UploadIcon, XMarkIcon } from "@/app/components/Icons";
import { PageLayout } from "@/app/components/PageLayout";
import { COLORS, ROLE_TYPE_OPTIONS, GENRE_OPTIONS, REPRESENTATIVE_GENRE_OPTIONS, generateYears } from "@/lib/constants";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  format: string;
  file?: File;
}

const years = generateYears(20);

const availableTags = [
  { id: "acting", label: "연기" },
  { id: "action", label: "액션" },
  { id: "drama", label: "드라마" },
  { id: "humor", label: "유머" },
];

function FormSkeleton() {
  return (
    <main className="flex-1 pb-32 animate-pulse">
      <section className="px-5 py-6 border-b" style={{ borderColor: COLORS.border.light }}>
        <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-32 bg-gray-200 rounded-xl" />
      </section>
      {[1, 2, 3].map((i) => (
        <section key={i} className="px-5 py-4 border-b" style={{ borderColor: COLORS.border.default }}>
          <div className="h-12 bg-gray-200 rounded" />
        </section>
      ))}
    </main>
  );
}

export function ShowreelEditContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isProfileLoading } = useGetMyProfile();
  const actorId = profileData?.data?.id;

  const { mutate: createShowreel, isPending: isCreating } = useCreateShowreel({
    mutation: {
      onSuccess: () => {
        if (actorId) {
          queryClient.invalidateQueries({ queryKey: getGetActorShowreelsQueryKey(actorId) });
        }
        router.back();
      },
    },
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [roleType, setRoleType] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [role, setRole] = useState("");
  const [representativeGenre, setRepresentativeGenre] = useState("");

  const [showRoleTypeDropdown, setShowRoleTypeDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showRepGenreDropdown, setShowRepGenreDropdown] = useState(false);

  const [selectedTags, setSelectedTags] = useState<typeof availableTags>([]);

  const closeAllDropdowns = () => {
    setShowRoleTypeDropdown(false);
    setShowGenreDropdown(false);
    setShowYearDropdown(false);
    setShowRepGenreDropdown(false);
  };

  const handleUpload = () => {
    if (uploadedFiles.length >= 5) {
      alert("최대 5개까지 업로드 가능합니다.");
      return;
    }

    const newFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: `showreel_${uploadedFiles.length + 1}`,
      size: "15.5MB",
      format: "mp4",
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const isAddEnabled = uploadedFiles.length > 0 && roleType && workTitle;

  const handleAdd = () => {
    if (!isAddEnabled) return;

    createShowreel({
      data: {
        videos: [],
        roleType,
        workTitle,
        year: year ? Number(year) : undefined,
        genre: genre || undefined,
        role: role || undefined,
        representativeGenre: representativeGenre || undefined,
        tags: selectedTags.map((t) => t.label),
      },
    });
  };

  if (isProfileLoading) {
    return (
      <PageLayout>
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
              쇼릴 편집하기
            </h1>
          </div>
        </header>
        <FormSkeleton />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
            <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
            쇼릴 편집하기
          </h1>
        </div>
      </header>

      <main className="flex-1 pb-32">
        <section className="px-5 py-6 border-b" style={{ borderColor: COLORS.border.light }}>
          <p className="text-sm mb-4" style={{ color: COLORS.text.secondary }}>
            대표영상 업로드 (최대 5개), mp4, mov 형식 지원
          </p>

          <button
            onClick={handleUpload}
            className="w-full rounded-xl py-12 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-gray-50"
            style={{
              backgroundColor: "#F9FAFB",
              border: `1px dashed ${COLORS.border.default}`,
            }}
          >
            <UploadIcon className="w-6 h-6" style={{ color: COLORS.text.tertiary }} />
            <div className="text-center">
              <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                대표영상 업로드 (최대 5개)
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.text.muted }}>
                mp4, mov 형식 지원
              </p>
            </div>
          </button>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ borderColor: COLORS.border.default }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: COLORS.text.primary }}>
                      {file.size}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: COLORS.text.muted }}>
                      {file.format}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="px-5 py-4 border-b" style={{ borderColor: COLORS.border.default }}>
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowRoleTypeDropdown(!showRoleTypeDropdown);
              }}
              className="w-full flex items-center justify-between py-3"
            >
              <span style={{ color: roleType ? COLORS.text.primary : COLORS.text.muted }}>
                {roleType || "역할 종류"}
              </span>
              <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
            </button>
            {showRoleTypeDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
                style={{ borderColor: COLORS.border.default }}
              >
                {ROLE_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setRoleType(type);
                      setShowRoleTypeDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                    style={{ color: roleType === type ? COLORS.accent.red : COLORS.text.primary }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-5 py-6 border-b" style={{ borderColor: COLORS.border.light }}>
          <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: COLORS.border.default }}>
            <div>
              <label className="block text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                작품명
              </label>
              <input
                type="text"
                placeholder="작품명을 입력하세요"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: COLORS.border.default, color: COLORS.text.primary }}
              />
            </div>

            <div className="relative">
              <label className="block text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                연도
              </label>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowYearDropdown(!showYearDropdown);
                }}
                className="w-full flex items-center justify-between px-4 py-3 border rounded-xl"
                style={{ borderColor: COLORS.border.default }}
              >
                <span style={{ color: year ? COLORS.text.primary : COLORS.text.muted }}>{year || "연도 선택"}</span>
                <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
              </button>
              {showYearDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
                  style={{ borderColor: COLORS.border.default }}
                >
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setYear(String(y));
                        setShowYearDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                      style={{ color: year === String(y) ? COLORS.accent.red : COLORS.text.primary }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                장르
              </label>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowGenreDropdown(!showGenreDropdown);
                }}
                className="w-full flex items-center justify-between px-4 py-3 border rounded-xl"
                style={{ borderColor: COLORS.border.default }}
              >
                <span style={{ color: genre ? COLORS.text.primary : COLORS.text.muted }}>{genre || "장르 선택"}</span>
                <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
              </button>
              {showGenreDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
                  style={{ borderColor: COLORS.border.default }}
                >
                  {GENRE_OPTIONS.map((g) => (
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

            <div>
              <label className="block text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                역할
              </label>
              <input
                type="text"
                placeholder="역할을 입력하세요"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: COLORS.border.default, color: COLORS.text.primary }}
              />
            </div>
          </div>
        </section>

        <section className="px-5 py-4 border-b" style={{ borderColor: COLORS.border.default }}>
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowRepGenreDropdown(!showRepGenreDropdown);
              }}
              className="w-full flex items-center justify-between py-3"
            >
              <span style={{ color: representativeGenre ? COLORS.text.primary : COLORS.text.muted }}>
                {representativeGenre || "대표 장르"}
              </span>
              <ChevronDownIcon className="w-5 h-5" style={{ color: COLORS.text.tertiary }} />
            </button>
            {showRepGenreDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
                style={{ borderColor: COLORS.border.default }}
              >
                {REPRESENTATIVE_GENRE_OPTIONS.map((rg) => (
                  <button
                    key={rg}
                    onClick={() => {
                      setRepresentativeGenre(rg);
                      setShowRepGenreDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                    style={{ color: representativeGenre === rg ? COLORS.accent.red : COLORS.text.primary }}
                  >
                    {rg}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-5 py-6">
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1 px-4 py-2 rounded-full"
                  style={{ backgroundColor: COLORS.background.secondary }}
                >
                  <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {tag.label}
                  </span>
                  <button onClick={() => handleRemoveTag(tag.id)} className="ml-1">
                    <XMarkIcon className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter((tag) => !selectedTags.some((t) => t.id === tag.id))
              .map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTags((prev) => [...prev, tag])}
                  className="flex items-center gap-1 px-4 py-2 rounded-full"
                  style={{ backgroundColor: COLORS.background.secondary }}
                >
                  <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {tag.label}
                  </span>
                  <XMarkIcon className="w-4 h-4" style={{ color: COLORS.text.secondary }} />
                </button>
              ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
        <button
          onClick={handleAdd}
          disabled={!isAddEnabled || isCreating}
          className="w-full py-4 rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
          style={{
            backgroundColor: isAddEnabled && !isCreating ? COLORS.text.primary : COLORS.border.default,
            color: isAddEnabled && !isCreating ? COLORS.background.primary : COLORS.text.disabled,
          }}
        >
          {isCreating ? "추가중..." : "추가하기"}
        </button>
      </div>
    </PageLayout>
  );
}
