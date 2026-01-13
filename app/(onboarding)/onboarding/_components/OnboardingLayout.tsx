"use client";

import { useState } from "react";

import Link from "next/link";

import { DoDreamLogo } from "@/components/common";

import { AutoSaveIndicator, ProfilePreview, ProfilePreviewModal } from "@/components/features/profile";

import { useOnboardingStore } from "@/stores/useOnboardingStore";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  customPreview?: React.ReactNode;
  customCompletionPercentage?: number;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  customPreview,
  customCompletionPercentage,
}: OnboardingLayoutProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { getCompletionPercentage } = useOnboardingStore();
  const completionPercentage = customCompletionPercentage ?? getCompletionPercentage();
  const stepProgress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-luxury-black flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 p-4 lg:p-6">
        <Link href="/">
          <DoDreamLogo size="md" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-body-sm hidden items-center gap-2 sm:flex">
            <span className="text-muted-gray">프로필 완성도</span>
            <span className="text-gold font-semibold">{completionPercentage}%</span>
          </div>
          <span className="text-muted-gray text-body-sm bg-luxury-secondary rounded-full px-3 py-1">
            {currentStep} / {totalSteps}단계
          </span>
        </div>
      </header>

      <div className="bg-luxury-secondary/50 px-4 py-3 lg:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-luxury-tertiary h-2 overflow-hidden rounded-full">
                <div
                  className="from-gold to-gold-light h-full bg-gradient-to-r transition-all duration-500"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
            </div>
            <span className="text-caption text-muted-gray whitespace-nowrap">{Math.round(stepProgress)}%</span>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-8 lg:px-6 lg:py-12">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex gap-8 lg:gap-12">
            <div className="mx-auto max-w-lg flex-1 lg:mx-0">
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-heading-xl lg:text-display-sm text-ivory mb-2">{title}</h1>
                {subtitle && <p className="text-body-base text-muted-gray">{subtitle}</p>}
              </div>

              <div className="bg-luxury-secondary border-border rounded-2xl border p-6 lg:p-8">{children}</div>

              <div className="mt-6 lg:hidden">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="bg-luxury-tertiary text-ivory text-body-base flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 font-medium transition-colors hover:bg-zinc-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>미리보기</span>
                </button>
              </div>
            </div>

            <div className="hidden w-80 shrink-0 lg:block">
              <div className="sticky top-8">
                <div className="mb-4">
                  <h2 className="text-heading-md text-ivory mb-1">실시간 미리보기</h2>
                  <p className="text-caption text-muted-gray">입력하면 바로 반영됩니다</p>
                </div>
                {customPreview ?? <ProfilePreview />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProfilePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />

      <AutoSaveIndicator />
    </div>
  );
}
