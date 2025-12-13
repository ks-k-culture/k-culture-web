"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (!isValid) return;
    console.log("로그인:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col border-x border-gray-200">
        {/* Header */}
        <div className="px-6 pt-16 pb-8">
          <h1 className="text-3xl font-bold text-gray-900">배우담</h1>
        </div>

        {/* Form */}
        <div className="flex-1 px-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="이메일 주소 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base border-gray-200 focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base border-gray-200 focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={!isValid}
              className={`w-full h-12 text-base font-semibold rounded-lg transition-all ${
                isValid
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              로그인
            </Button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link href="/signup" className="text-sm text-gray-500 hover:text-gray-700">
              회원가입
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

