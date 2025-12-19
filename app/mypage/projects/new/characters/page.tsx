"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ChevronLeftIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
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

interface Character {
  id: string;
  name: string;
  gender: string;
  ageRange: string;
  roleType: string;
  description: string;
  specialTags?: string[];
  keywords?: string[];
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return JSON.stringify(initialValue);
    const stored = localStorage.getItem(key);
    return stored ?? JSON.stringify(initialValue);
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => JSON.stringify(initialValue), [initialValue]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    },
    [key]
  );

  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key]
  );

  return [JSON.parse(storedValue) as T, setValue];
}

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useLocalStorage<Character[]>("newProjectCharacters", []);

  const handleDeleteCharacter = (id: string) => {
    const updated = characters.filter((c) => c.id !== id);
    setCharacters(updated);
  };

  const handleComplete = () => {
    if (characters.length > 0) {
      console.log("프로젝트 생성 완료:", { characters });
      setCharacters([]);
      router.push("/mypage/projects");
    }
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

          {characters.length === 0 ? (
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
                      <Link href={`/mypage/projects/new/characters/add?edit=${character.id}`}>
                        <PencilIcon className="w-5 h-5" style={{ color: "#6B7684" }} />
                      </Link>
                      <button onClick={() => handleDeleteCharacter(character.id)}>
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
                href="/mypage/projects/new/characters/add"
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
              href="/mypage/projects/new/characters/add"
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
