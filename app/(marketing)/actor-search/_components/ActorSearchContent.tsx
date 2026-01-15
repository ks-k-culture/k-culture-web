"use client";

import { useState } from "react";

import { LandingHeader } from "@/components/common";

import { CompareFloatingBar, CompareModal } from "@/components/features/compare";
import {
  FilterBottomSheet,
  FilterFloatingButton,
  FilterSidebar,
  Pagination,
  SortBottomSheet,
  SortButton,
  SortDropdown,
} from "@/components/features/search";

import { ActorGrid } from "./ActorGrid";
import { ActorSearchHeader } from "./ActorSearchHeader";
import { useActorSearch } from "./useActorSearch";

export function ActorSearchContent() {
  const { actors, pagination, isLoading, isAuthenticated, currentPage, setPage } = useActorSearch();
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  return (
    <div className="bg-luxury-black min-h-screen">
      <LandingHeader currentPath="/actor-search" />

      <main className="mx-auto max-w-screen-2xl px-4 pt-6 pb-24 lg:px-6">
        <ActorSearchHeader isAuthenticated={isAuthenticated} />

        <div className="flex gap-8">
          <FilterSidebar />

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-body-sm text-muted-gray">
                <span className="text-ivory font-semibold">{pagination?.total || actors.length}</span>명의 배우·모델
              </p>
              <div className="hidden lg:block">
                <SortDropdown />
              </div>
            </div>

            <ActorGrid actors={actors} isLoading={isLoading} isAuthenticated={isAuthenticated} />

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10">
                <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed right-6 bottom-6 z-30 flex flex-col gap-3 lg:hidden">
        <SortButton onClick={() => setIsSortSheetOpen(true)} />
        <FilterFloatingButton />
      </div>

      <FilterBottomSheet />
      <SortBottomSheet isOpen={isSortSheetOpen} onClose={() => setIsSortSheetOpen(false)} />
      <CompareFloatingBar />
      <CompareModal />
    </div>
  );
}
