"use client";

import Image from "next/image";

import { useAgencyOnboardingStore } from "@/stores/useAgencyOnboardingStore";

interface AgencyProfilePreviewProps {
  className?: string;
}

export function AgencyProfilePreview({ className = "" }: AgencyProfilePreviewProps) {
  const { data } = useAgencyOnboardingStore();

  return (
    <div className={`bg-luxury-black border-border overflow-hidden rounded-2xl border ${className}`}>
      <div className="bg-luxury-secondary relative aspect-[3/4]">
        {data.profileImage ? (
          <Image src={data.profileImage} alt="회사 로고 미리보기" fill className="object-cover" />
        ) : (
          <div className="text-muted-gray absolute inset-0 flex flex-col items-center justify-center">
            <svg className="mb-2 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-body-sm">로고를 추가해주세요</p>
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-heading-md text-ivory font-bold">{data.agencyName || "회사명을 입력해주세요"}</h3>

        <div className="text-body-sm text-muted-gray space-y-1">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{data.representativeName || "담당자명 없음"}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{data.foundedYear ? `${data.foundedYear} 설립` : "설립연도 없음"}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span>{data.specialty || "주요 분야 없음"}</span>
          </div>
        </div>

        {data.specialty && (
          <div className="pt-2">
            <span className="bg-gold/10 text-gold text-caption rounded-full px-3 py-1">{data.specialty}</span>
          </div>
        )}
      </div>
    </div>
  );
}
