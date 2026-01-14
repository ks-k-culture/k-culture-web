"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { OnboardingLayout } from "@/app/(onboarding)/onboarding/_components";
import { toast } from "sonner";

import { Button } from "@/components/ui";

import { XMarkIcon } from "@/components/common/Misc/Icons";

import { useOnboardingStore } from "@/stores/useOnboardingStore";

import { useCreateActorProfile } from "@/src/actors/actors";

const SKILL_CATEGORIES = [
  {
    name: "연기",
    skills: ["감정연기", "코미디연기", "액션연기", "뮤지컬연기", "즉흥연기"],
  },
  {
    name: "언어",
    skills: ["영어", "일본어", "중국어", "한국어(사투리)", "수어"],
  },
  {
    name: "무용/댄스",
    skills: ["발레", "현대무용", "한국무용", "힙합", "팝핀", "왁킹"],
  },
  {
    name: "스포츠",
    skills: ["수영", "승마", "검술", "태권도", "유도", "복싱", "골프"],
  },
  {
    name: "음악",
    skills: ["피아노", "기타", "바이올린", "드럼", "노래"],
  },
  {
    name: "기타",
    skills: ["운전면허", "오토바이", "스턴트", "MC진행", "나레이션"],
  },
];

function birthYearToAgeGroup(birthYear: string): string {
  if (!birthYear) return "20대";
  const year = parseInt(birthYear);
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  if (age < 20) return "10대";
  if (age < 30) return "20대";
  if (age < 40) return "30대";
  if (age < 50) return "40대";
  if (age < 60) return "50대";
  return "60대 이상";
}

export default function ActorOnboardingStep3() {
  const router = useRouter();
  const { data, updateData, resetData } = useOnboardingStore();
  const createProfileMutation = useCreateActorProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    const newSkills = data.skills.includes(skill) ? data.skills.filter((s) => s !== skill) : [...data.skills, skill];
    updateData({ skills: newSkills });
  };

  const removeSkill = (skill: string) => {
    updateData({ skills: data.skills.filter((s) => s !== skill) });
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let profileImageBlob: Blob | undefined;
      if (data.profileImage) {
        const response = await fetch(data.profileImage);
        profileImageBlob = await response.blob();
      }

      await createProfileMutation.mutateAsync({
        data: {
          name: data.name,
          introduction: data.introduction || "안녕하세요!",
          ageGroup: birthYearToAgeGroup(data.birthYear) as "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상",
          profileImage: profileImageBlob,
        },
      });

      resetData();
      toast.success("프로필이 등록되었습니다!");
      router.push("/onboarding/actor/complete");
    } catch (error) {
      console.error("프로필 등록 실패:", error);
      toast.error("프로필 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="특기를 선택해주세요"
      subtitle="보유한 스킬을 선택하면 매칭에 도움이 됩니다"
    >
      <div className="space-y-6">
        {data.skills.length > 0 && (
          <div>
            <p className="text-caption text-muted-gray mb-2">선택된 특기 ({data.skills.length}개)</p>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gold/10 border-gold/30 text-gold inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-gold-light"
                    aria-label={`${skill} 삭제`}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="hide-scrollbar max-h-64 space-y-4 overflow-y-auto pr-2">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h3 className="text-body-sm text-muted-gray mb-2 font-medium">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => {
                  const isSelected = data.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                        isSelected
                          ? "bg-gold text-luxury-black font-medium"
                          : "bg-luxury-tertiary text-warm-gray hover:bg-zinc-700"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="gold-secondary" className="flex-1" onClick={handleSkip} disabled={isSubmitting}>
            건너뛰기
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleComplete} loading={isSubmitting}>
            완료
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
