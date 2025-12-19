"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function ChevronLeftIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function XCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

const ageRangeOptions = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

const genderOptions = ["남성", "여성", "무관"];

const roleTypeOptions = ["주연", "조연", "단역", "엑스트라", "특별출연"];

const specialTags = ["주연", "조연", "신인", "기타"];

export default function CharacterAddPage() {
  const router = useRouter();

  const [characterName, setCharacterName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [roleType, setRoleType] = useState("");
  const [selectedSpecialTags, setSelectedSpecialTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const [isRoleTypeDropdownOpen, setIsRoleTypeDropdownOpen] = useState(false);

  const isFormValid = characterName.trim() !== "" && gender !== "" && ageRange !== "";

  const toggleSpecialTag = (tag: string) => {
    setSelectedSpecialTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleAddCharacter = () => {
    if (!isFormValid) return;

    const existingCharacters = JSON.parse(localStorage.getItem("newProjectCharacters") || "[]");
    const newCharacter = {
      id: Date.now().toString(),
      name: characterName,
      gender,
      ageRange,
      roleType,
      specialTags: selectedSpecialTags,
      description,
      keywords,
    };
    localStorage.setItem("newProjectCharacters", JSON.stringify([...existingCharacters, newCharacter]));

    router.push("/mypage/projects/new/characters");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: "#191F28" }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "#191F28" }}>
              캐릭터 입력
            </h1>
          </div>
        </header>

        <main className="flex-1 px-5 py-4 pb-32 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              캐릭터명
            </label>
            <div className="relative">
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터명을 입력해주세요"
                className="w-full px-4 py-3 rounded-xl border text-base outline-none"
                style={{ borderColor: "#E5E8EB", color: "#191F28" }}
              />
              {characterName && (
                <button onClick={() => setCharacterName("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircleIcon className="w-5 h-5" style={{ color: "#B0B8C1" }} />
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              나이
            </label>
            <button
              type="button"
              onClick={() => {
                setIsAgeDropdownOpen(!isAgeDropdownOpen);
                setIsRoleTypeDropdownOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-base"
              style={{ borderColor: "#E5E8EB", color: ageRange ? "#191F28" : "#B0B8C1" }}
            >
              {ageRange || "나이대를 선택해주세요"}
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${isAgeDropdownOpen ? "rotate-180" : ""}`}
                style={{ color: "#6B7684" }}
              />
            </button>
            {isAgeDropdownOpen && (
              <div
                className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
                style={{ borderColor: "#E5E8EB" }}
              >
                {ageRangeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setAgeRange(option);
                      setIsAgeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base hover:bg-[#F2F4F6]"
                    style={{ color: "#191F28" }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              성별
            </label>
            <div className="flex gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setGender(option)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: gender === option ? "rgba(229, 8, 21, 0.1)" : "#F2F4F6",
                    color: gender === option ? "#E50815" : "#4E5968",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              역할 유형
            </label>
            <button
              type="button"
              onClick={() => {
                setIsRoleTypeDropdownOpen(!isRoleTypeDropdownOpen);
                setIsAgeDropdownOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between text-base"
              style={{ borderColor: "#E5E8EB", color: roleType ? "#191F28" : "#B0B8C1" }}
            >
              {roleType || "역할 유형을 선택해주세요"}
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${isRoleTypeDropdownOpen ? "rotate-180" : ""}`}
                style={{ color: "#6B7684" }}
              />
            </button>
            {isRoleTypeDropdownOpen && (
              <div
                className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
                style={{ borderColor: "#E5E8EB" }}
              >
                {roleTypeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setRoleType(option);
                      setIsRoleTypeDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base hover:bg-[#F2F4F6]"
                    style={{ color: "#191F28" }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              특이사항
            </label>
            <div className="flex flex-wrap gap-2">
              {specialTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleSpecialTag(tag)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedSpecialTags.includes(tag) ? "rgba(229, 8, 21, 0.1)" : "#F2F4F6",
                    color: selectedSpecialTags.includes(tag) ? "#E50815" : "#4E5968",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              상세 설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="캐릭터에 대한 상세 설명을 입력해주세요"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none resize-none"
              style={{ borderColor: "#E5E8EB", color: "#191F28" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              키워드 추가
            </label>

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm"
                    style={{ backgroundColor: "rgba(229, 8, 21, 0.1)", color: "#E50815" }}
                  >
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)}>
                      <XCircleIcon className="w-4 h-4" style={{ color: "#E50815" }} />
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
              style={{ borderColor: "#D1D6DB", color: "#4E5968" }}
            >
              <PlusIcon className="w-5 h-5" />
              <span className="text-sm">키워드 입력</span>
            </button>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          <button
            onClick={handleAddCharacter}
            disabled={!isFormValid}
            className="w-full py-4 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: isFormValid ? "#191F28" : "#E5E8EB",
              color: isFormValid ? "#FFFFFF" : "#B0B8C1",
            }}
          >
            캐릭터 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
