"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/app/components/StickyHeader";
import { PageLayout } from "@/app/components/PageLayout";
import { COLORS } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = email.length > 0 && email.includes("@");

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: API 호출
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  if (isSubmitted) {
    return (
      <PageLayout>
        <StickyHeader href="/login" title="비밀번호 찾기" />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: COLORS.accent.teal }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: COLORS.text.primary }}>
            이메일을 확인해주세요
          </h2>
          <p className="text-center mb-8" style={{ color: COLORS.text.secondary }}>
            <span style={{ color: COLORS.text.primary }}>{email}</span>으로
            <br />
            비밀번호 재설정 링크를 보냈습니다.
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full h-14 text-base font-semibold rounded-2xl transition-all"
            style={{
              backgroundColor: COLORS.text.primary,
              color: COLORS.background.primary,
            }}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <StickyHeader href="/login" title="비밀번호 찾기" />
      <div className="flex-1 px-8 pt-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2" style={{ color: COLORS.text.primary }}>
            비밀번호를 잊으셨나요?
          </h2>
          <p style={{ color: COLORS.text.secondary }}>
            가입한 이메일 주소를 입력하시면
            <br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>
        <div className="space-y-0">
          <div className="py-5 border-b" style={{ borderColor: COLORS.border.default }}>
            <input
              type="email"
              placeholder="이메일 주소 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-base bg-transparent focus:outline-none"
              style={{ color: COLORS.text.primary }}
            />
          </div>
          <div className="pt-8">
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full h-14 text-base font-semibold rounded-2xl transition-all"
              style={{
                backgroundColor: COLORS.text.primary,
                color: COLORS.background.primary,
                opacity: isValid ? 1 : 0.3,
              }}
            >
              비밀번호 재설정 링크 받기
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
