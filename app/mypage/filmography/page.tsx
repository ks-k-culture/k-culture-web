"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 아이콘 컴포넌트들
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function PencilIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
      />
    </svg>
  );
}

function XMarkIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// 필모그래피 타입
interface FilmographyItem {
  id: string;
  year: number;
  type: "영화" | "드라마";
  title: string;
  role: string;
  character?: string;
  thumbnail: string;
}

// 샘플 필모그래피 데이터
const initialFilmography: FilmographyItem[] = [
  {
    id: "f1",
    year: 2023,
    type: "영화",
    title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
    role: "주연",
    character: "강민준",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=560&fit=crop",
  },
  {
    id: "f2",
    year: 2023,
    type: "영화",
    title: "서울의 밤",
    role: "주연",
    character: "강민준",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=560&fit=crop",
  },
  {
    id: "f3",
    year: 2022,
    type: "영화",
    title: "제목이 긴 경우 이런식으로 들어갈 예정입니다",
    role: "주연",
    character: "강민준",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=560&fit=crop",
  },
  {
    id: "f4",
    year: 2022,
    type: "드라마",
    title: "코드네임 : 그림자",
    role: "조연",
    character: "에이전트 7",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=560&fit=crop",
  },
];

// 연도별로 필모그래피 그룹화
function groupFilmographyByYear(filmography: FilmographyItem[]) {
  const grouped: Record<number, FilmographyItem[]> = {};
  filmography.forEach((item) => {
    if (!grouped[item.year]) {
      grouped[item.year] = [];
    }
    grouped[item.year].push(item);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function FilmographyManagePage() {
  const router = useRouter();
  const [filmography, setFilmography] = useState<FilmographyItem[]>(initialFilmography);

  const groupedFilmography = groupFilmographyByYear(filmography);

  const handleDelete = (id: string) => {
    if (confirm("이 작품을 삭제하시겠습니까?")) {
      setFilmography((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    // TODO: 수정 모달 또는 페이지로 이동
    console.log("Edit:", id);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen">
        {/* 헤더 */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">필모그래피 관리</h1>
          </div>
        </header>

        {/* 필모그래피 목록 */}
        <main className="px-5 py-6">
          {groupedFilmography.map(({ year, items }, groupIndex) => (
            <div key={year} className="mb-2">
              {/* 연도 헤더 */}
              <h2 className="text-xl font-bold mb-5" style={{ color: "#191F28" }}>
                {year}
              </h2>

              {/* 타임라인 */}
              <div className="relative">
                {items.map((item, index) => {
                  const isLastInGroup = index === items.length - 1;
                  const isLastGroup = groupIndex === groupedFilmography.length - 1;
                  const showLine = !isLastInGroup || !isLastGroup;

                  return (
                    <div key={item.id} className="relative flex pb-5">
                      {/* 타임라인 점과 선 */}
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className="w-2 h-2 rounded-full border bg-white z-10 mt-1"
                          style={{ borderColor: "#4E5968" }}
                        />
                        {showLine && (
                          <div
                            className="w-px flex-1 mt-1"
                            style={{ backgroundColor: "#F2F4F6", minHeight: "160px" }}
                          />
                        )}
                      </div>

                      {/* 콘텐츠 영역 */}
                      <div className="flex flex-1 gap-4">
                        {/* 포스터 이미지 */}
                        <div className="w-[120px] h-[160px] shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            width={120}
                            height={160}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* 정보 */}
                        <div className="flex-1 flex flex-col pt-1">
                          <span className="text-sm mb-1" style={{ color: "#8B95A1" }}>
                            {item.type}
                          </span>
                          <h3
                            className="text-base font-semibold leading-snug mb-2 line-clamp-3"
                            style={{ color: "#191F28" }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-sm" style={{ color: "#4E5968" }}>
                            {item.role} · {item.character}
                          </p>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex flex-col gap-3 pt-1">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <PencilIcon className="w-5 h-5" style={{ color: "#6B7684" }} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" style={{ color: "#6B7684" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 빈 상태 */}
          {filmography.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400 text-center">등록된 필모그래피가 없습니다.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
