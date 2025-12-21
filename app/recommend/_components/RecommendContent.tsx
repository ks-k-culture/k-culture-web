"use client";

import { useState, useMemo } from "react";
import Header from "../../components/Header";
import FilterBar from "../../components/FilterBar";
import FilterModal from "../../components/FilterModal";
import EmptyState from "../../components/EmptyState";
import ActorCarousel from "../../components/ActorCarousel";
import { useGetActors } from "@/src/actors/actors";
import type { GetActorsParams } from "@/src/model";

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

export function RecommendContent() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const queryParams: GetActorsParams | undefined = useMemo(() => {
    if (!hasSearched) return undefined;

    const params: GetActorsParams = {};

    if (selectedFilters.genderAge) {
      params.ageGroup = selectedFilters.genderAge;
    }
    if (selectedFilters.workType) {
      params.genre = selectedFilters.workType;
    }
    if (selectedFilters.views === "조회수 높은순") {
      params.sortBy = "views";
      params.sortOrder = "desc";
    } else if (selectedFilters.views === "조회수 낮은순") {
      params.sortBy = "views";
      params.sortOrder = "asc";
    } else if (selectedFilters.views === "최신순") {
      params.sortBy = "createdAt";
      params.sortOrder = "desc";
    }

    return params;
  }, [selectedFilters, hasSearched]);

  const { data, isLoading } = useGetActors(queryParams, {
    query: { enabled: hasSearched },
  });

  const actors = useMemo(() => {
    const actorList = data?.data?.actors ?? [];
    return actorList.map((actor) => ({
      id: actor.id,
      name: actor.name,
      imageUrl: actor.profileImage ?? "",
      age: actor.ageGroup ?? "",
      filmography: actor.filmographyCount ?? 0,
      tags: actor.skills ?? [],
    }));
  }, [data]);

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
        setHasSearched(true);
      }
    }
  };

  const handleCloseModal = () => {
    setActiveFilterId(null);
  };

  const handleEmptyButtonClick = () => {
    setActiveFilterId("actorType");
  };

  const hasResults = hasSearched && actors.length > 0;

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col overflow-hidden">
        <Header title="역 추천 배우" highlightedName="서은우" />

        <FilterBar filters={filterOptions} selectedFilters={selectedFilters} onFilterClick={handleFilterClick} />

        <main className="flex-1 flex flex-col justify-between pb-5">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : hasResults ? (
            <ActorCarousel actors={actors} />
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

