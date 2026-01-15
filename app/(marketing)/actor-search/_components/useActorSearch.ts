import { useCallback, useEffect, useMemo, useRef } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { SortOption } from "@/components/features/search";

import { useAuthStore } from "@/stores/useAuthStore";
import { useFilterStore } from "@/stores/useFilterStore";

import { useGetActors } from "@/src/actors/actors";
import { GetActorsParams } from "@/src/model";

const PAGE_SIZE = 20;

/**
 * 배우 검색 로직을 담당하는 커스텀 훅
 * 필터, 정렬, 페이지네이션을 통합 관리
 */
export function useActorSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { filters } = useFilterStore();

  // URL에서 페이지 번호 읽기 (기본값 1)
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSort = (searchParams.get("sort") as SortOption) || "latest";

  // Sort 옵션을 API sortBy 파라미터로 매핑
  const getSortByParam = useCallback((sortOption: SortOption): string => {
    switch (sortOption) {
      case "filmography":
        return "views_high";
      case "age-asc":
        return "age_young";
      case "age-desc":
        return "age_old";
      case "name":
        return "name";
      case "latest":
      default:
        return "recent";
    }
  }, []);

  // 필터 상태를 API 파라미터로 변환
  type ExtendedParams = GetActorsParams & {
    category?: string;
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    heightMin?: number;
    heightMax?: number;
    weightMin?: number;
    weightMax?: number;
    skills?: string[];
    keyword?: string;
  };

  const buildApiParams = useMemo((): ExtendedParams => {
    const params: ExtendedParams = {
      page: currentPage,
      limit: PAGE_SIZE,
      sortBy: getSortByParam(currentSort) as GetActorsParams["sortBy"],
    };

    if (filters.category && filters.category !== "무관") {
      params.category = filters.category;
    }

    if (filters.gender && filters.gender !== "무관") {
      params.gender = filters.gender;
    }

    if (filters.ageMin) {
      params.ageMin = parseInt(filters.ageMin, 10);
    }
    if (filters.ageMax) {
      params.ageMax = parseInt(filters.ageMax, 10);
    }

    if (filters.heightMin) {
      params.heightMin = parseInt(filters.heightMin, 10);
    }
    if (filters.heightMax) {
      params.heightMax = parseInt(filters.heightMax, 10);
    }

    if (filters.weightMin) {
      params.weightMin = parseInt(filters.weightMin, 10);
    }
    if (filters.weightMax) {
      params.weightMax = parseInt(filters.weightMax, 10);
    }

    if (filters.skills && filters.skills.length > 0) {
      params.skills = filters.skills;
    }

    if (filters.keyword) {
      params.keyword = filters.keyword;
    }

    return params;
  }, [currentPage, currentSort, filters, getSortByParam]);

  const { data: actorsData, isLoading, isFetching } = useGetActors(buildApiParams, {
    query: {
      staleTime: 1000 * 60, // 1분 캐시
      placeholderData: (previousData) => previousData, // 이전 데이터 유지
    },
  });

  // 백엔드 실제 응답: { data: { content: [...], page, limit, total, totalPages }, success }
  type BackendResponse = {
    content: Array<{
      id: string;
      name: string;
      stageName?: string;
      profileImage?: string;
      age?: number;
      gender?: string;
      category?: string;
      height?: number;
      weight?: number;
      introduction?: string;
      agency?: string;
      skills?: string[];
      viewCount?: number;
    }>;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  const responseData = actorsData?.data as unknown as BackendResponse | undefined;

  // 배우 데이터를 UI에 맞게 변환
  const actors = useMemo(() => {
    if (!responseData?.content) return [];

    return responseData.content.map((actor) => ({
      id: actor.id,
      name: actor.stageName || actor.name,
      imageUrl: actor.profileImage,
      age: actor.age ? `${actor.age}세` : undefined,
      filmography: actor.viewCount || 0,
      tags: actor.skills?.slice(0, 3) || [],
    }));
  }, [responseData]);

  const pagination = useMemo(() => {
    if (!responseData) return undefined;
    return {
      page: responseData.page,
      limit: responseData.limit,
      total: responseData.total,
      totalPages: responseData.totalPages,
    };
  }, [responseData]);

  const setPage = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const setSort = useCallback((newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1"); // 정렬 변경 시 첫 페이지로
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const prevFiltersRef = useRef<string>(JSON.stringify(filters));

  useEffect(() => {
    const currentFiltersStr = JSON.stringify(filters);

    if (prevFiltersRef.current !== currentFiltersStr) {
      prevFiltersRef.current = currentFiltersStr;

      const currentPageParam = searchParams.get("page");
      if (currentPageParam && currentPageParam !== "1") {
        setPage(1);
      }
    }
  }, [filters, searchParams, setPage]);

  return {
    actors,
    pagination,
    isLoading: isLoading || isFetching,
    isAuthenticated,
    currentSort,
    currentPage,
    setPage,
    setSort,
    pageSize: PAGE_SIZE,
  };
}
