"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateCharacter, getGetProjectCharactersQueryKey } from "@/src/characters/characters";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronDownIcon, XCircleIcon, PlusIcon } from "@/app/components/Icons";
import { PageLayout } from "@/app/components/PageLayout";
import type { CharacterCreateRequestGender } from "@/src/model/characterCreateRequestGender";
import type { CharacterCreateRequestRoleType } from "@/src/model/characterCreateRequestRoleType";
import { COLORS, AGE_RANGE_OPTIONS, GENDER_OPTIONS, ROLE_TYPE_OPTIONS } from "@/lib/constants";

const genderOptions = GENDER_OPTIONS as unknown as CharacterCreateRequestGender[];
const roleTypeOptions = ROLE_TYPE_OPTIONS.filter(
  (r) => r !== "엑스트라"
) as unknown as CharacterCreateRequestRoleType[];
const specialTags = ["주연", "조연", "신인", "기타"];

export function CharacterAddForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") ?? "";
  const queryClient = useQueryClient();

  const { mutate: createCharacter, isPending: isCreating } = useCreateCharacter({
    mutation: {
      onSuccess: () => {
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: getGetProjectCharactersQueryKey(projectId) });
        }
        router.push(`/mypage/projects/new/characters?projectId=${projectId}`);
      },
    },
  });

  const [characterName, setCharacterName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState<CharacterCreateRequestGender | "">("");
  const [roleType, setRoleType] = useState<CharacterCreateRequestRoleType | "">("");
  const [selectedSpecialTags, setSelectedSpecialTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const [isRoleTypeDropdownOpen, setIsRoleTypeDropdownOpen] = useState(false);

  const isFormValid = characterName.trim() !== "" && gender !== "" && ageRange !== "" && roleType !== "";

  const toggleSpecialTag = (tag: string) => {
    setSelectedSpecialTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleAddCharacter = () => {
    if (!isFormValid || !projectId || isCreating) return;

    createCharacter({
      projectId,
      data: {
        name: characterName,
        gender: gender as CharacterCreateRequestGender,
        ageRange,
        roleType: roleType as CharacterCreateRequestRoleType,
        description: description || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
      },
    });
  };

  return (
    <PageLayout>
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
            <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
          </button>
          <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
            캐릭터 입력
          </h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-4 pb-32 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            캐릭터명
          </label>
          <div className="relative">
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="캐릭터명을 입력해주세요"
              className="w-full px-4 py-3 rounded-xl border text-base outline-none"
              style={{ borderColor: COLORS.border.default, color: COLORS.text.primary }}
            />
            {characterName && (
              <button onClick={() => setCharacterName("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <XCircleIcon className="w-5 h-5" style={{ color: COLORS.text.disabled }} />
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            나이
          </label>
          <button
            type="button"
            onClick={() => {
              setIsAgeDropdownOpen(!isAgeDropdownOpen);
              setIsRoleTypeDropdownOpen(false);
            }}
            className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-base"
            style={{
              borderColor: COLORS.border.default,
              color: ageRange ? COLORS.text.primary : COLORS.text.disabled,
            }}
          >
            {ageRange || "나이대를 선택해주세요"}
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${isAgeDropdownOpen ? "rotate-180" : ""}`}
              style={{ color: COLORS.text.tertiary }}
            />
          </button>
          {isAgeDropdownOpen && (
            <div
              className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
              style={{ borderColor: COLORS.border.default }}
            >
              {AGE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setAgeRange(option);
                    setIsAgeDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base"
                  style={{ color: COLORS.text.primary }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            성별
          </label>
          <div className="flex gap-2">
            {genderOptions.map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: gender === option ? COLORS.status.ongoing.bg : COLORS.background.secondary,
                  color: gender === option ? COLORS.accent.red : COLORS.text.secondary,
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            역할 유형
          </label>
          <button
            type="button"
            onClick={() => {
              setIsRoleTypeDropdownOpen(!isRoleTypeDropdownOpen);
              setIsAgeDropdownOpen(false);
            }}
            className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-base"
            style={{
              borderColor: COLORS.border.default,
              color: roleType ? COLORS.text.primary : COLORS.text.disabled,
            }}
          >
            {roleType || "역할 유형을 선택해주세요"}
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${isRoleTypeDropdownOpen ? "rotate-180" : ""}`}
              style={{ color: COLORS.text.tertiary }}
            />
          </button>
          {isRoleTypeDropdownOpen && (
            <div
              className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
              style={{ borderColor: COLORS.border.default }}
            >
              {roleTypeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setRoleType(option);
                    setIsRoleTypeDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base"
                  style={{ color: COLORS.text.primary }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            특이사항
          </label>
          <div className="flex flex-wrap gap-2">
            {specialTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleSpecialTag(tag)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: selectedSpecialTags.includes(tag)
                    ? COLORS.status.ongoing.bg
                    : COLORS.background.secondary,
                  color: selectedSpecialTags.includes(tag) ? COLORS.accent.red : COLORS.text.secondary,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            상세 설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="캐릭터에 대한 상세 설명을 입력해주세요"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border text-base outline-none resize-none"
            style={{ borderColor: COLORS.border.default, color: COLORS.text.primary }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.secondary }}>
            키워드 추가
          </label>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm"
                  style={{ backgroundColor: COLORS.status.ongoing.bg, color: COLORS.accent.red }}
                >
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)}>
                    <XCircleIcon className="w-4 h-4" style={{ color: COLORS.accent.red }} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              const input = prompt("키워드를 입력해주세요");
              if (input && input.trim() && !keywords.includes(input.trim())) {
                setKeywords((prev) => [...prev, input.trim()]);
              }
            }}
            className="w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2"
            style={{ borderColor: COLORS.border.dark, color: COLORS.text.secondary }}
          >
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm">키워드 입력</span>
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
        <button
          onClick={handleAddCharacter}
          disabled={!isFormValid || isCreating}
          className="w-full py-4 rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
          style={{
            backgroundColor: isFormValid && !isCreating ? COLORS.text.primary : COLORS.border.default,
            color: isFormValid && !isCreating ? COLORS.background.primary : COLORS.text.disabled,
          }}
        >
          {isCreating ? "추가중..." : "캐릭터 추가하기"}
        </button>
      </div>
    </PageLayout>
  );
}
