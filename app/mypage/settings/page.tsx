"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ChevronLeftIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRightIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#E50815]" : "bg-[#E5E8EB]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  const [castingNotification, setCastingNotification] = useState(true);
  const [messageNotification, setMessageNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2">
              <ChevronLeftIcon className="w-6 h-6" style={{ color: "#191F28" }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "#191F28" }}>
              설정 페이지
            </h1>
          </div>
        </header>

        <main className="flex-1">
          <section className="px-5 py-6 border-b" style={{ borderColor: "#E5E8EB" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: "rgba(78, 89, 104, 0.1)", color: "#4E5968" }}
                  >
                    프로필 설정
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "#191F28" }}>
                  사용자 이름
                </h2>
                <p className="text-sm" style={{ color: "#4E5968" }}>
                  user@email.com
                </p>
              </div>

              <div className="relative">
                <div
                  className="w-[100px] h-[100px] rounded-full overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: "#8B95A1" }}
                >
                  <span className="text-white text-3xl font-bold">U</span>
                </div>
                <Link
                  href="/mypage/settings/profile"
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white border flex items-center justify-center"
                  style={{ borderColor: "#E5E8EB" }}
                >
                  <PencilIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
                </Link>
              </div>
            </div>
          </section>

          <section className="border-b" style={{ borderColor: "#F2F4F6" }}>
            <div className="px-5 py-4">
              <h3 className="text-sm font-medium mb-4" style={{ color: "#4E5968" }}>
                알림 설정
              </h3>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  새로운 캐스팅 제안
                </span>
                <ToggleSwitch
                  enabled={castingNotification}
                  onToggle={() => setCastingNotification(!castingNotification)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  메시지 알림
                </span>
                <ToggleSwitch
                  enabled={messageNotification}
                  onToggle={() => setMessageNotification(!messageNotification)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  마케팅 알림
                </span>
                <ToggleSwitch
                  enabled={marketingNotification}
                  onToggle={() => setMarketingNotification(!marketingNotification)}
                />
              </div>
            </div>
          </section>

          <section className="border-b" style={{ borderColor: "#F2F4F6" }}>
            <div className="px-5 py-4">
              <h3 className="text-sm font-medium mb-4" style={{ color: "#4E5968" }}>
                계정 관리
              </h3>

              <button className="flex items-center justify-between w-full py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  로그아웃
                </span>
                <ChevronRightIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
              </button>

              <button className="flex items-center justify-between w-full py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  계정 삭제
                </span>
                <ChevronRightIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
              </button>

              <div className="flex items-center justify-between py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  앱 정보
                </span>
                <span className="text-sm" style={{ color: "#8B95A1" }}>
                  v1.0.2
                </span>
              </div>
            </div>
          </section>

          <section className="border-b" style={{ borderColor: "#F2F4F6" }}>
            <div className="px-5 py-4">
              <button className="flex items-center justify-between w-full py-3">
                <span className="text-base" style={{ color: "#4E5968" }}>
                  이용약관 및 개인정보 처리방침
                </span>
                <ChevronRightIcon className="w-5 h-5" style={{ color: "#8B95A1" }} />
              </button>
            </div>
          </section>

          <section className="px-5 py-8 flex flex-col items-center">
            <p className="text-sm font-medium mb-2" style={{ color: "#E50815" }}>
              궁금한 점이 있으신가요?
            </p>
            <p className="text-sm" style={{ color: "#8B95A1" }}>
              고객센터 문의하기
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
