"use client";

import { memo, useMemo } from "react";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

/**
 * 페이지네이션 컴포넌트
 * 현재 페이지 주변의 페이지 번호와 첫/마지막 페이지로 이동하는 버튼 제공
 */
export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  // 페이지 범위 계산
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // 양쪽 sibling + 현재 + 처음/끝 + 2개의 DOTS

    // 페이지 수가 보여줄 수 있는 수보다 적으면 모두 표시
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [1, "...", ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, "...", ...middleRange, "...", totalPages];
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav role="navigation" aria-label="페이지네이션" className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(1)}
        disabled={!canGoPrevious}
        className="text-muted-gray hover:bg-luxury-tertiary hover:text-ivory flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="첫 페이지로"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="text-muted-gray hover:bg-luxury-tertiary hover:text-ivory flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span key={`dots-${index}`} className="text-muted-gray flex h-9 w-9 items-center justify-center">
                ⋯
              </span>
            );
          }

          const page = pageNumber as number;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors ${
                isActive ? "bg-gold text-luxury-black" : "text-muted-gray hover:bg-luxury-tertiary hover:text-ivory"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="text-muted-gray hover:bg-luxury-tertiary hover:text-ivory flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={!canGoNext}
        className="text-muted-gray hover:bg-luxury-tertiary hover:text-ivory flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="마지막 페이지로"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </nav>
  );
});
