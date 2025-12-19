"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const roleTypes = ["주연", "조연", "단역", "특별출연"];

const years = Array.from({ length: 30 }, (_, i) => 2024 - i);

const genres = ["영화", "드라마", "뮤지컬", "연극", "웹드라마", "예능", "광고"];

const sampleFilmography: Record<
  string,
  {
    id: string;
    title: string;
    year: number;
    genre: string;
    role: string;
    roleType: string;
  }
> = {
  f1: {
    id: "f1",
    title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
    year: 2023,
    genre: "영화",
    role: "강민준",
    roleType: "주연",
  },
  f2: {
    id: "f2",
    title: "서울의 밤",
    year: 2023,
    genre: "영화",
    role: "강민준",
    roleType: "주연",
  },
  f3: {
    id: "f3",
    title: "코드네임 : 그림자",
    year: 2022,
    genre: "드라마",
    role: "에이전트 7",
    roleType: "조연",
  },
};

export default function FilmographyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const existingData = sampleFilmography[id] || {
    id: "",
    title: "",
    year: 2023,
    genre: "영화",
    role: "",
    roleType: "주연",
  };

  const [title, setTitle] = useState(existingData.title);
  const [year, setYear] = useState(existingData.year);
  const [genre, setGenre] = useState(existingData.genre);
  const [role, setRole] = useState(existingData.role);
  const [roleType, setRoleType] = useState(existingData.roleType);

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const handleSave = () => {
    console.log("Save:", { title, year, genre, role, roleType });
    router.back();
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
              <ChevronLeftIcon className="w-6 h-6 text-[#191F28]" />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "#191F28" }}>
              필모그래피 작품 편집
            </h1>
          </div>
        </header>

        <div className="px-5 py-4 border-b" style={{ borderColor: "#E5E8EB" }}>
          <p className="text-sm" style={{ color: "#4E5968" }}>
            편집중인 작품
          </p>
          <p className="text-base font-medium mt-1" style={{ color: "#191F28" }}>
            {existingData.title || "새 작품"}
          </p>
        </div>

        <main className="flex-1 px-5 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              작품명
            </label>
            <div className="relative flex items-center border rounded-xl px-4 py-3" style={{ borderColor: "#E5E8EB" }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="작품명을 입력하세요"
                className="flex-1 text-base outline-none bg-transparent"
                style={{ color: "#191F28" }}
              />
              {title && (
                <button onClick={() => setTitle("")} className="ml-2">
                  <XCircleIcon className="w-5 h-5 text-[#B0B8C1]" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              연도
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowGenreDropdown(false);
                }}
                className="w-full flex items-center justify-between border rounded-xl px-4 py-3"
                style={{ borderColor: "#E5E8EB" }}
              >
                <span style={{ color: "#191F28" }}>{year}</span>
                <ChevronDownIcon className="w-5 h-5 text-[#6B7684]" />
              </button>
              {showYearDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                  style={{ borderColor: "#E5E8EB" }}
                >
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setShowYearDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                      style={{ color: year === y ? "#E50815" : "#191F28" }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              장르
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowGenreDropdown(!showGenreDropdown);
                  setShowYearDropdown(false);
                }}
                className="w-full flex items-center justify-between border rounded-xl px-4 py-3"
                style={{ borderColor: "#E5E8EB" }}
              >
                <span style={{ color: "#191F28" }}>{genre}</span>
                <ChevronDownIcon className="w-5 h-5 text-[#6B7684]" />
              </button>
              {showGenreDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                  style={{ borderColor: "#E5E8EB" }}
                >
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGenre(g);
                        setShowGenreDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                      style={{ color: genre === g ? "#E50815" : "#191F28" }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              역할 배역
            </label>
            <div className="relative flex items-center border rounded-xl px-4 py-3" style={{ borderColor: "#E5E8EB" }}>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="배역 이름을 입력하세요"
                className="flex-1 text-base outline-none bg-transparent"
                style={{ color: "#191F28" }}
              />
              {role && (
                <button onClick={() => setRole("")} className="ml-2">
                  <XCircleIcon className="w-5 h-5 text-[#B0B8C1]" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#4E5968" }}>
              역할 타입
            </label>
            <div className="flex flex-wrap gap-2">
              {roleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setRoleType(type)}
                  className="px-5 py-3 rounded-lg border text-sm font-medium transition-colors"
                  style={{
                    borderColor: roleType === type ? "#E50815" : "#E5E8EB",
                    color: roleType === type ? "#E50815" : "#4E5968",
                    backgroundColor: "white",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </main>

        <div className="sticky bottom-0 bg-white px-5 py-6 border-t" style={{ borderColor: "#E5E8EB" }}>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-4 rounded-xl border font-medium"
              style={{ borderColor: "#D1D6DB", color: "#4E5968" }}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] py-4 rounded-xl font-medium text-white"
              style={{ backgroundColor: "#191F28" }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
