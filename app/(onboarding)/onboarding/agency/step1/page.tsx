"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { OnboardingLayout } from "@/app/(onboarding)/onboarding/_components";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui";

import { DarkInput, DarkSelect } from "@/components/common";

import { AgencyProfilePreview } from "@/components/features/profile";

import { AGENCY_SPECIALTY_OPTIONS, FOUNDED_YEAR_OPTIONS } from "@/lib/constants";
import { type AgencyOnboardingData, agencyOnboardingSchema } from "@/lib/validations";

import { useAgencyOnboardingStore } from "@/stores/useAgencyOnboardingStore";

export default function AgencyOnboardingStep1() {
  const router = useRouter();
  const { data: storeData, updateData, getCompletionPercentage } = useAgencyOnboardingStore();

  const form = useForm<AgencyOnboardingData>({
    resolver: zodResolver(agencyOnboardingSchema),
    defaultValues: {
      agencyName: storeData.agencyName || "",
      representativeName: storeData.representativeName || "",
      foundedYear: storeData.foundedYear || "",
      specialty: storeData.specialty || "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  // 폼 값 변경 시 스토어 업데이트
  const watchedValues = watch();

  useEffect(() => {
    updateData({
      agencyName: watchedValues.agencyName,
      representativeName: watchedValues.representativeName,
      foundedYear: watchedValues.foundedYear,
      specialty: watchedValues.specialty,
    });
  }, [
    watchedValues.agencyName,
    watchedValues.representativeName,
    watchedValues.foundedYear,
    watchedValues.specialty,
    updateData,
  ]);

  const onSubmit = handleSubmit((data) => {
    updateData(data);
    router.push("/onboarding/agency/complete");
  });

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={1}
      title="회사 정보를 입력해주세요"
      subtitle="캐스팅 진행 시 배우에게 보여질 정보입니다"
      customPreview={<AgencyProfilePreview />}
      customCompletionPercentage={getCompletionPercentage()}
    >
      <form onSubmit={onSubmit}>
        <div className="space-y-6">
          <DarkInput
            label="회사명"
            placeholder="회사명을 입력하세요"
            {...register("agencyName")}
            error={errors.agencyName?.message}
          />

          <DarkInput
            label="담당자명"
            placeholder="담당자 이름을 입력하세요"
            {...register("representativeName")}
            error={errors.representativeName?.message}
          />

          <Controller
            name="foundedYear"
            control={control}
            render={({ field }) => (
              <DarkSelect
                label="설립연도"
                placeholder="설립연도를 선택하세요"
                options={FOUNDED_YEAR_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.foundedYear?.message}
              />
            )}
          />

          <Controller
            name="specialty"
            control={control}
            render={({ field }) => (
              <DarkSelect
                label="주요 분야"
                placeholder="주요 제작 분야를 선택하세요"
                options={AGENCY_SPECIALTY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.specialty?.message}
              />
            )}
          />

          <div className="pt-4">
            <Button type="submit" variant="gold" fullWidth disabled={!isValid}>
              완료
            </Button>
          </div>
        </div>
      </form>
    </OnboardingLayout>
  );
}
