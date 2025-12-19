"use client";

import { useState } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import FilterModal from "../components/FilterModal";
import EmptyState from "../components/EmptyState";
import ActorCarousel from "../components/ActorCarousel";
import type { Actor } from "../components/ActorCarousel";

const sampleActors: Actor[] = [
  {
    id: "1",
    name: "김배우",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=533&fit=crop&crop=face",
    age: "20대 중반",
    filmography: 15,
    tags: ["섬세한연기", "청춘물감정", "카리스마"],
  },
  {
    id: "2",
    name: "이연기",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&crop=face",
    age: "30대 초반",
    filmography: 23,
    tags: ["감성연기", "로맨스", "멜로"],
  },
  {
    id: "3",
    name: "박스타",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=533&fit=crop&crop=face",
    age: "20대 후반",
    filmography: 8,
    tags: ["신선함", "액션", "코미디"],
  },
  {
    id: "4",
    name: "최연기",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop&crop=face",
    age: "20대 초반",
    filmography: 5,
    tags: ["풋풋함", "학원물", "성장드라마"],
  },
  {
    id: "5",
    name: "정배우",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=533&fit=crop&crop=face",
    age: "30대 중반",
    filmography: 42,
    tags: ["베테랑", "극한연기", "몰입력"],
  },
];

const filterOptions = [
  { id: "actorType", label: "배우유형" },
  { id: "genderAge", label: "성별/나이대" },
  { id: "workType", label: "출연한작품유형/분위기" },
  { id: "views", label: "조회수" },
];

const filterOptionsData: Record<string, { value: string; label: string }[]> = {
  actorType: [
    { value: "movie", label: "영화배우" },
    { value: "drama", label: "드라마배우" },
    { value: "musical", label: "뮤지컬배우" },
    { value: "theater", label: "연극배우" },
    { value: "cf", label: "CF모델" },
  ],
  genderAge: [
    { value: "50s", label: "50대" },
    { value: "40s", label: "40대" },
    { value: "30s", label: "30대" },
    { value: "20s", label: "20대" },
    { value: "10s", label: "10대" },
  ],
  workType: [
    { value: "romance", label: "로맨스" },
    { value: "action", label: "액션" },
    { value: "comedy", label: "코미디" },
    { value: "thriller", label: "스릴러" },
    { value: "drama", label: "드라마" },
  ],
  views: [
    { value: "high", label: "조회수 높은순" },
    { value: "low", label: "조회수 낮은순" },
    { value: "recent", label: "최신순" },
  ],
};

const filterTitles: Record<string, string> = {
  actorType: "배우유형",
  genderAge: "배우유형·성별·나이대",
  workType: "출연한작품유형/분위기",
  views: "조회수",
};

export default function RecommendPage() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [showEmpty, setShowEmpty] = useState(true);

  const handleFilterClick = (filterId: string) => {
    setActiveFilterId(filterId);
  };

  const handleFilterSelect = (value: string) => {
    if (activeFilterId) {
      const option = filterOptionsData[activeFilterId]?.find((opt) => opt.value === value);
      if (option) {
        setSelectedFilters((prev) => ({
          ...prev,
          [activeFilterId]: option.label,
        }));
        setShowEmpty(false);
      }
    }
  };

  const handleCloseModal = () => {
    setActiveFilterId(null);
  };

  const handleEmptyButtonClick = () => {
    setActiveFilterId("actorType");
  };

  const hasResults = !showEmpty && Object.keys(selectedFilters).length > 0;

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col overflow-hidden">
        <Header title="역 추천 배우" highlightedName="서은우" />

        <FilterBar filters={filterOptions} selectedFilters={selectedFilters} onFilterClick={handleFilterClick} />

        <main className="flex-1 flex flex-col justify-between pb-5">
          {hasResults ? (
            <ActorCarousel actors={sampleActors} />
          ) : (
            <EmptyState
              message={`검색조건에 해당되는 배우를\n찾을 수 없습니다`}
              buttonLabel="조건 선택하기"
              onButtonClick={handleEmptyButtonClick}
            />
          )}
        </main>

        <FilterModal
          isOpen={activeFilterId !== null}
          onClose={handleCloseModal}
          title={activeFilterId ? filterTitles[activeFilterId] : ""}
          options={activeFilterId ? filterOptionsData[activeFilterId] || [] : []}
          selectedValue={
            activeFilterId
              ? Object.entries(filterOptionsData[activeFilterId] || []).find(
                  ([, opt]) => opt.label === selectedFilters[activeFilterId]
                )?.[1]?.value
              : undefined
          }
          onSelect={handleFilterSelect}
        />
      </div>
    </div>
  );
}
