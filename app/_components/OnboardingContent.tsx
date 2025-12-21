"use client";

import Link from "next/link";

export function OnboardingContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-full max-w-lg min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=face')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 min-h-screen flex flex-col px-6 py-12">
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">시나리오에</h1>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">생명을 불어넣을 완벽한 배우,</h1>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">AI가 찾아드립니다.</h1>
            </div>

            <p className="mt-6 text-sm text-gray-300 leading-relaxed max-w-xs">
              역할 디렉터와 에이전시를 위한
              <br />
              시놉시스 기반 배우 추천, 배우를 위한 새로운 기회
            </p>
          </div>
          <div className="space-y-3 pb-4">
            <Link
              href="/signup?type=agency"
              className="flex items-center justify-center w-full h-14 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              에이전시로 시작하기
            </Link>

            <Link
              href="/signup?type=actor"
              className="flex items-center justify-center w-full h-14 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all"
            >
              배우로 시작하기
            </Link>

            <div className="pt-4 text-center">
              <span className="text-sm text-gray-400">이미 계정이 있으신가요? </span>
              <Link href="/login" className="text-sm text-white font-medium hover:underline">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
