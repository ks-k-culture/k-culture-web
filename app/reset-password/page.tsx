"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/app/components/StickyHeader";
import { PageLayout } from "@/app/components/PageLayout";
import { EyeIcon, EyeOffIcon } from "@/app/components/Icons";
import { COLORS } from "@/lib/constants";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValid =
    email.length > 0 &&
    email.includes("@") &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: API 호출
    router.push("/login");
  };

  return (
    <PageLayout>
      <StickyHeader href="/login" title="비밀번호 재설정" />
      <main className="flex-1 px-5 pt-8">
        <p className="text-sm mb-8" style={{ color: COLORS.text.secondary }}>
          이메일로 전송된 인증 코드와 새 비밀번호를<br />
          입력해 주세요.
        </p>

        <div className="space-y-0">
          {/* 이메일 입력 */}
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

          {/* 새 비밀번호 */}
          <div className="py-5 border-b flex items-center" style={{ borderColor: COLORS.border.default }}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 text-base bg-transparent focus:outline-none"
              style={{ color: COLORS.text.primary }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="ml-2"
              style={{ color: COLORS.text.tertiary }}
            >
              {showNewPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="py-5 border-b flex items-center" style={{ borderColor: COLORS.border.default }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 text-base bg-transparent focus:outline-none"
              style={{ color: COLORS.text.primary }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2"
              style={{ color: COLORS.text.tertiary }}
            >
              {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="p-5 pb-8">
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
          비밀번호 재설정 완료
        </button>
      </div>
    </PageLayout>
  );
}

