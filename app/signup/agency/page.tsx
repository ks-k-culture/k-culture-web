"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StickyHeader } from "@/app/components/StickyHeader";
import { PageLayout } from "@/app/components/PageLayout";
import { Button } from "@/components/ui/button";
import { ClearButton } from "@/app/components/ClearButton";
import { FormLabel } from "@/app/components/FormLabel";
import { COLORS, SPECIALTY_OPTIONS } from "@/lib/constants";

export default function AgencySignupPage() {
  const router = useRouter();

  const [agencyName, setAgencyName] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const isValid =
    agencyName.trim() !== "" &&
    representativeName.trim() !== "" &&
    foundedYear.trim() !== "" &&
    selectedSpecialties.length > 0;

  const handleClearAgencyName = () => setAgencyName("");
  const handleClearRepresentativeName = () => setRepresentativeName("");
  const handleClearFoundedYear = () => setFoundedYear("");

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  };

  const handleSubmit = () => {
    if (!isValid) return;
    router.push("/signup/complete?type=agency");
  };

  return (
    <PageLayout>
      <StickyHeader href="/" title="에이전시 프로필 등록" />
      <main className="flex-1 w-full px-5 py-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <FormLabel>에이전시 소개</FormLabel>
            <div className="space-y-2">
              <FormLabel>에이전시명</FormLabel>
              <div className="relative border-b" style={{ borderColor: COLORS.border.default }}>
                <input
                  type="text"
                  placeholder="에이전시명 입력"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full pb-3 pt-1 text-base focus:outline-none bg-transparent pr-8"
                  style={{ color: COLORS.text.primary }}
                />
                {agencyName && <ClearButton onClick={handleClearAgencyName} backgroundColor={COLORS.text.disabled} />}
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>대표자명</FormLabel>
              <div className="relative border-b" style={{ borderColor: COLORS.border.default }}>
                <input
                  type="text"
                  placeholder="대표자명 입력"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full pb-3 pt-1 text-base focus:outline-none bg-transparent pr-8"
                  style={{ color: COLORS.text.primary }}
                />
                {representativeName && (
                  <ClearButton onClick={handleClearRepresentativeName} backgroundColor={COLORS.text.disabled} />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>설립연도</FormLabel>
              <div className="relative border-b" style={{ borderColor: COLORS.border.default }}>
                <input
                  type="text"
                  placeholder="설립연도 입력 (예: 2020)"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  className="w-full pb-3 pt-1 text-base focus:outline-none bg-transparent pr-8"
                  style={{ color: COLORS.text.primary }}
                />
                {foundedYear && <ClearButton onClick={handleClearFoundedYear} backgroundColor={COLORS.text.disabled} />}
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <FormLabel>주요 분야</FormLabel>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((specialty) => {
                const isSelected = selectedSpecialties.includes(specialty);
                return (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all border bg-white"
                    style={{
                      borderColor: isSelected ? COLORS.accent.red : COLORS.border.default,
                      color: isSelected ? COLORS.accent.red : COLORS.text.secondary,
                    }}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
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
    </PageLayout>
  );
}
