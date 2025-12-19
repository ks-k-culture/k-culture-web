"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from "./icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TermsModal from "./TermsModal";

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "actor";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateEmail = (value: string): string | undefined => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "잘 못된 형식입니다.";
    }
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return undefined;
    if (value.length < 8) {
      return "비밀번호는 최소 8글자 이상이어야 합니다.";
    }
    return undefined;
  };

  const validatePasswordConfirm = (value: string, pwd: string): string | undefined => {
    if (!value) return undefined;
    if (value !== pwd) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return undefined;
  };

  const computedErrors: FormErrors = {};
  if (touched.email) {
    computedErrors.email = validateEmail(email);
  }
  if (touched.password) {
    computedErrors.password = validatePassword(password);
  }
  if (touched.passwordConfirm) {
    computedErrors.passwordConfirm = validatePasswordConfirm(passwordConfirm, password);
  }

  const emailValid = email && !validateEmail(email);
  const passwordValid = password && !validatePassword(password);
  const passwordConfirmValid = passwordConfirm && !validatePasswordConfirm(passwordConfirm, password);
  const computedIsValid = !!emailValid && !!passwordValid && !!passwordConfirmValid;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    if (!computedIsValid) return;
    setShowTermsModal(true);
  };

  const handleTermsAgree = () => {
    if (userType === "agency") {
      router.push("/signup/agency");
    } else {
      router.push("/signup/actor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col border-x border-gray-200 overflow-hidden">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="px-4 h-14 flex items-center">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="뒤로가기"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 -ml-10">회원가입</h1>
          </div>
        </header>
        <main className="flex-1 w-full px-5 py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이메일 주소</label>
              <Input
                type="email"
                placeholder="이메일 주소 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!computedErrors.email}
                className="h-12 text-base border-gray-200 focus:border-gray-400"
              />
              {computedErrors.email && <p className="text-sm text-red-500">{computedErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!computedErrors.password}
                  className="h-12 text-base border-gray-200 focus:border-gray-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {computedErrors.password && <p className="text-sm text-red-500">{computedErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
              <div className="relative">
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호 다시 입력"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  onBlur={() => handleBlur("passwordConfirm")}
                  aria-invalid={!!computedErrors.passwordConfirm}
                  className="h-12 text-base border-gray-200 focus:border-gray-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPasswordConfirm ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {computedErrors.passwordConfirm && (
                <p className="text-sm text-red-500">{computedErrors.passwordConfirm}</p>
              )}
            </div>
          </div>
        </main>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 w-full">
          <Button
            onClick={handleSubmit}
            disabled={!computedIsValid}
            className={`w-full h-14 text-base font-semibold rounded-xl transition-all ${
              computedIsValid
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </Button>
        </div>
        <TermsModal open={showTermsModal} onOpenChange={setShowTermsModal} onAgree={handleTermsAgree} />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
