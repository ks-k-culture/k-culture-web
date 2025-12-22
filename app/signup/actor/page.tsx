"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeftIcon } from "@/app/components/Icons";
import { Button } from "@/components/ui/button";
import AgeSelectModal from "./AgeSelectModal";
import { COLORS } from "@/lib/constants";

export default function ActorSignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [showAgeModal, setShowAgeModal] = useState(false);

  const isValid = name.trim() !== "" && introduction.trim() !== "" && ageGroup !== "";

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearName = () => {
    setName("");
  };

  const handleAgeSelect = (age: string) => {
    setAgeGroup(age);
    setShowAgeModal(false);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    router.push("/signup/complete?type=actor");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-full max-w-lg bg-white min-h-screen flex flex-col border-x border-gray-200 overflow-hidden">
        <header className="sticky top-0 z-50 bg-white">
          <div className="px-4 h-14 flex items-center">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="뒤로가기"
            >
              <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
            </button>
            <h1 className="ml-2 text-base font-semibold" style={{ color: COLORS.text.primary }}>
              배우 프로필 등록
            </h1>
          </div>
        </header>
        <main className="flex-1 w-full px-5 py-6">
          <div className="space-y-6">
            <div className="relative w-[100px] h-[100px]">
              <div
                onClick={handleImageClick}
                className="w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer border"
                style={{ backgroundColor: COLORS.border.dark, borderColor: COLORS.border.default }}
              >
                {profileImage ? (
                  <Image src={profileImage} alt="프로필 이미지" fill className="object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-white" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="32" r="18" />
                    <ellipse cx="50" cy="90" r="35" ry="28" />
                  </svg>
                )}
              </div>
              <button
                onClick={handleImageClick}
                className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border"
                style={{ borderColor: COLORS.border.default }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: COLORS.text.muted }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 5l4 4M5.5 18.5H9.5L19.5 8.5C20.03 7.97 20.328 7.25 20.328 6.5C20.328 5.75 20.03 5.03 19.5 4.5C18.97 3.97 18.25 3.672 17.5 3.672C16.75 3.672 16.03 3.97 15.5 4.5L5.5 14.5V18.5Z" />
                </svg>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                이름
              </label>
              <div className="relative border-b" style={{ borderColor: COLORS.border.default }}>
                <input
                  type="text"
                  placeholder="활동명 입력"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pb-3 pt-1 text-base focus:outline-none bg-transparent pr-8"
                  style={{ color: COLORS.text.primary }}
                />
                {name && (
                  <button
                    type="button"
                    onClick={handleClearName}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.text.muted }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                한 줄 소개
              </label>
              <textarea
                placeholder="캐릭터를 잘 나타내는 한 줄 소개를 작성해 보세요"
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                rows={5}
                className="w-full p-4 text-base border rounded-xl focus:border-gray-400 focus:outline-none resize-none"
                style={{
                  color: COLORS.text.primary,
                  borderColor: COLORS.border.default,
                }}
              />
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                나이대
              </label>
              <button
                type="button"
                onClick={() => setShowAgeModal(true)}
                className="w-full pb-3 pt-1 text-base text-left flex items-center justify-between border-b"
                style={{ borderColor: COLORS.border.default }}
              >
                <span style={{ color: ageGroup ? COLORS.text.primary : COLORS.text.muted }}>
                  {ageGroup || "나이대 선택"}
                </span>
                <svg
                  className="w-5 h-5"
                  style={{ color: COLORS.text.tertiary }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </main>
        <div className="p-5 pb-8 w-full">
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full h-14 text-base font-semibold rounded-xl transition-all"
            style={{
              backgroundColor: isValid ? COLORS.text.primary : "rgba(25, 31, 40, 0.3)",
              color: COLORS.background.primary,
            }}
          >
            다음
          </Button>
        </div>
        <AgeSelectModal
          open={showAgeModal}
          onOpenChange={setShowAgeModal}
          selectedAge={ageGroup}
          onSelect={handleAgeSelect}
        />
      </div>
    </div>
  );
}
