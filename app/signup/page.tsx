"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from "./icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TermsModal from "./TermsModal";

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });
  const [isValid, setIsValid] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // 이메일 유효성 검사
  const validateEmail = (value: string): string | undefined => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "잘 못된 형식입니다.";
    }
    return undefined;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (value: string): string | undefined => {
    if (!value) return undefined;
    if (value.length < 8) {
      return "비밀번호는 최소 8글자 이상이어야 합니다.";
    }
    return undefined;
  };

  // 비밀번호 확인 유효성 검사
  const validatePasswordConfirm = (value: string, pwd: string): string | undefined => {
    if (!value) return undefined;
    if (value !== pwd) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return undefined;
  };

  // 실시간 유효성 검사
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (touched.email) {
      newErrors.email = validateEmail(email);
    }
    if (touched.password) {
      newErrors.password = validatePassword(password);
    }
    if (touched.passwordConfirm) {
      newErrors.passwordConfirm = validatePasswordConfirm(passwordConfirm, password);
    }

    setErrors(newErrors);

    // 모든 필드가 채워지고 에러가 없는지 확인
    const emailValid = email && !validateEmail(email);
    const passwordValid = password && !validatePassword(password);
    const passwordConfirmValid = passwordConfirm && !validatePasswordConfirm(passwordConfirm, password);

    setIsValid(!!emailValid && !!passwordValid && !!passwordConfirmValid);
  }, [email, password, passwordConfirm, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    // 약관동의 모달 열기
    setShowTermsModal(true);
  };

  const handleTermsAgree = () => {
    // 회원가입 완료 처리
    console.log("회원가입 완료:", { email, password });
    alert("회원가입이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col border-x border-gray-200 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="px-4 h-14 flex items-center">
            <button
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="뒤로가기"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 -ml-10">
              회원가입
            </h1>
          </div>
        </header>

        {/* Form */}
        <main className="flex-1 w-full px-5 py-6">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이메일 주소</label>
              <Input
                type="email"
                placeholder="이메일 주소 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!errors.email}
                className="h-12 text-base border-gray-200 focus:border-gray-400"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!errors.password}
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
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Password Confirm Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
              <div className="relative">
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호 다시 입력"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  onBlur={() => handleBlur("passwordConfirm")}
                  aria-invalid={!!errors.passwordConfirm}
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
              {errors.passwordConfirm && <p className="text-sm text-red-500">{errors.passwordConfirm}</p>}
            </div>
          </div>
        </main>

        {/* Bottom Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 w-full">
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full h-14 text-base font-semibold rounded-xl transition-all ${
              isValid
                ? "bg-gray-900 hover:bg-gray-800 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </Button>
        </div>

        {/* Terms Modal */}
        <TermsModal
          open={showTermsModal}
          onOpenChange={setShowTermsModal}
          onAgree={handleTermsAgree}
        />
      </div>
    </div>
  );
}
