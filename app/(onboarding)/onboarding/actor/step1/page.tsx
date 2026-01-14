"use client";

import { Suspense, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { OnboardingLayout } from "@/app/(onboarding)/onboarding/_components";

import { Button, Spinner } from "@/components/ui";

import { DarkInput, DarkSelect } from "@/components/common";

import { BIRTH_YEAR_OPTIONS, GENDER_SELECT_OPTIONS } from "@/lib/constants";

import { type OnboardingData, useOnboardingStore } from "@/stores/useOnboardingStore";

function ActorOnboardingStep1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, updateData, resetData } = useOnboardingStore();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      resetData();
      router.replace("/onboarding/actor/step1");
    }
  }, [searchParams, resetData, router]);

  const isValid = data.name.trim().length >= 2 && data.gender !== "" && data.birthYear !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    localStorage.setItem("onboarding_step1", "visited");
    router.push("/onboarding/actor/step2");
  };

  const handleChange = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    updateData({ [field]: value });
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="기본 정보를 입력해주세요"
      subtitle="활동에 사용할 정보를 입력해주세요"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <DarkInput
            label="활동명"
            placeholder="활동명 또는 본명을 입력하세요"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <DarkSelect
            label="성별"
            placeholder="성별을 선택하세요"
            options={GENDER_SELECT_OPTIONS}
            value={data.gender}
            onChange={(value) => handleChange("gender", value)}
          />

          <DarkSelect
            label="출생년도"
            placeholder="출생년도를 선택하세요"
            options={BIRTH_YEAR_OPTIONS}
            value={data.birthYear}
            onChange={(value) => handleChange("birthYear", value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <DarkInput
              label="키 (선택)"
              placeholder="cm"
              type="number"
              value={data.height}
              onChange={(e) => handleChange("height", e.target.value)}
            />
            <DarkInput
              label="몸무게 (선택)"
              placeholder="kg"
              type="number"
              value={data.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="gold" fullWidth disabled={!isValid}>
              다음
            </Button>
          </div>
        </div>
      </form>
    </OnboardingLayout>
  );
}

export default function ActorOnboardingStep1() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ActorOnboardingStep1Content />
    </Suspense>
  );
}
