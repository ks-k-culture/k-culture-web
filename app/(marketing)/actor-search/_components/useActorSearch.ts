import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { SortOption } from "@/components/features/search";

import { useAuthStore } from "@/stores/useAuthStore";

import { useGetActors } from "@/src/actors/actors";
import { GetActorsSortBy } from "@/src/model";

/**
 * 배우 검색 로직을 담당하는 커스텀 훅
 */
export function useActorSearch() {
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [page, setPage] = useState(1);

  const currentSort = (searchParams.get("sort") as SortOption) || "latest";

  // Sort 옵션을 API sortBy 파라미터로 매핑
  const getSortByParam = (sortOption: SortOption): GetActorsSortBy => {
    switch (sortOption) {
      case "filmography":
        return GetActorsSortBy.views_high;
      case "latest":
      default:
        return GetActorsSortBy.recent;
    }
  };

  const { data: actorsData, isLoading } = useGetActors({
    page,
    limit: 20,
    sortBy: getSortByParam(currentSort),
  });

  // 백엔드 실제 응답: { data: { content: [...], page, limit, total, totalPages }, success }
  // 타입 정의와 다르므로 타입 캐스팅 사용
  type BackendResponse = {
    content: NonNullable<typeof actorsData>["data"]["actors"];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  const responseData = actorsData?.data as unknown as BackendResponse | undefined;

  const actors = responseData?.content || [];
  const pagination = responseData ? {
    page: responseData.page,
    limit: responseData.limit,
    total: responseData.total,
    totalPages: responseData.totalPages,
  } : undefined;

  return {
    actors,
    pagination,
    isLoading,
    isAuthenticated,
    currentSort,
    page,
    setPage,
  };
}
