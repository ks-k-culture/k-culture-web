"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  useGetProjectCharacters,
  useDeleteCharacter,
  getGetProjectCharactersQueryKey,
} from "@/src/characters/characters";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, PencilIcon, XMarkIcon, XCircleIcon } from "./Icons";

function CharactersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl border animate-pulse" style={{ borderColor: "#E5E8EB" }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-4 w-full bg-gray-200 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

export function CharactersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") ?? "";
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetProjectCharacters(projectId, {
    query: { enabled: !!projectId },
  });

  const { mutate: deleteCharacter, isPending: isDeleting } = useDeleteCharacter({
    mutation: {
      onSuccess: () => {
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: getGetProjectCharactersQueryKey(projectId) });
        }
      },
    },
  });

  const characters = data?.data?.characters ?? [];

  const handleDeleteCharacter = (id: string) => {
    if (confirm("이 캐릭터를 삭제하시겠습니까?")) {
      deleteCharacter({ characterId: id });
    }
  };

  const handleComplete = () => {
    if (characters.length > 0) {
      router.push("/mypage/projects");
    }
  };

  const addCharacterUrl = projectId
    ? `/mypage/projects/new/characters/add?projectId=${projectId}`
    : "/mypage/projects/new/characters/add";

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: "#191F28" }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "#191F28" }}>
              새 프로젝트 만들기
            </h1>
          </div>
        </header>

        <main className="flex-1 px-5 pb-32">
          <div className="py-4">
            <h2 className="text-xl font-bold mb-2" style={{ color: "#191F28" }}>
              캐릭터를 등록해보세요
            </h2>
            <p className="text-sm" style={{ color: "#4E5968" }}>
              캐스팅할 배역을 추가하고 상세 정보를 입력해주세요.
            </p>
          </div>

          {isLoading ? (
            <CharactersSkeleton />
          ) : characters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#F2F4F6" }}
              >
                <XCircleIcon className="w-12 h-12" style={{ color: "#D1D6DB" }} />
              </div>
              <p className="text-center text-sm" style={{ color: "#4E5968" }}>
                등록된 캐릭터가 없습니다.
                <br />
                아래 버튼을 눌러 새 캐릭터를 추가해보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {characters.map((character, index) => (
                <div key={character.id} className="p-4 rounded-xl border" style={{ borderColor: "#E5E8EB" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: "#4E5968" }}>
                          {String(index + 1).padStart(2, "0")} .
                        </span>
                        <span className="text-base font-semibold" style={{ color: "#191F28" }}>
                          {character.name}
                        </span>
                      </div>
                      <p className="text-sm mb-1" style={{ color: "#8B95A1" }}>
                        {character.ageRange} · {character.gender}
                      </p>
                      {character.roleType && (
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs"
                          style={{ backgroundColor: "#F2F4F6", color: "#4E5968" }}
                        >
                          {character.roleType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`${addCharacterUrl}&edit=${character.id}`}>
                        <PencilIcon className="w-5 h-5" style={{ color: "#6B7684" }} />
                      </Link>
                      <button onClick={() => handleDeleteCharacter(character.id)} disabled={isDeleting}>
                        <XMarkIcon className="w-5 h-5" style={{ color: "#6B7684" }} />
                      </button>
                    </div>
                  </div>
                  {character.description && (
                    <p className="text-sm mt-2" style={{ color: "#8B95A1" }}>
                      {character.description}
                    </p>
                  )}
                </div>
              ))}

              <Link
                href={addCharacterUrl}
                className="w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2"
                style={{ borderColor: "#E5E8EB", color: "#6B7684" }}
              >
                <span className="text-xl">+</span>
                <span className="text-sm font-medium">캐릭터 추가</span>
              </Link>
            </div>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">
          {characters.length === 0 ? (
            <Link
              href={addCharacterUrl}
              className="w-full py-4 rounded-xl font-medium flex items-center justify-center"
              style={{ backgroundColor: "#191F28", color: "#FFFFFF" }}
            >
              캐릭터 추가하기
            </Link>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-xl font-medium text-white"
              style={{ backgroundColor: "#191F28" }}
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
