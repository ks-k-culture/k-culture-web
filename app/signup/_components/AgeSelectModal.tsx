"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { COLORS, AGE_RANGE_OPTIONS } from "@/lib/constants";

interface AgeSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAge: string;
  onSelect: (age: string) => void;
}

const ageOptions = [...AGE_RANGE_OPTIONS].reverse();

export default function AgeSelectModal({ open, onOpenChange, selectedAge, onSelect }: AgeSelectModalProps) {
  const [tempSelectedAge, setTempSelectedAge] = useState(selectedAge);

  if (!open) return null;

  const handleConfirm = () => {
    if (tempSelectedAge) {
      onSelect(tempSelectedAge);
      onOpenChange(false);
    }
  };

  const selectedIndex = ageOptions.indexOf(tempSelectedAge as (typeof ageOptions)[number]);

  return (
    <>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[15px] z-60" onClick={() => onOpenChange(false)} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-70 animate-slide-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: COLORS.border.default }} />
        </div>
        <div className="px-5 pt-4 pb-6">
          <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
            나이대를 선택해 주세요
          </h2>
        </div>
        <div className="relative px-5">
          <div className="absolute top-0 left-0 right-0 h-[92px] bg-linear-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[92px] bg-linear-to-t from-white to-transparent z-10 pointer-events-none" />

          <div className="flex flex-col items-center py-4">
            {ageOptions.map((age, index) => {
              const isSelected = tempSelectedAge === age;
              const distance = selectedIndex >= 0 ? Math.abs(selectedIndex - index) : -1;

              let opacity = 1;
              let textColor: string = COLORS.text.primary;
              if (tempSelectedAge && !isSelected) {
                if (distance === 1) {
                  opacity = 0.6;
                  textColor = COLORS.text.secondary;
                } else if (distance >= 2) {
                  opacity = 0.3;
                  textColor = COLORS.text.muted;
                }
              }

              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => setTempSelectedAge(age)}
                  className={`w-full py-3 text-center text-lg transition-all rounded-xl ${
                    isSelected ? "font-bold" : "font-medium"
                  }`}
                  style={{
                    opacity: isSelected ? 1 : opacity,
                    color: isSelected ? COLORS.text.primary : textColor,
                    backgroundColor: isSelected ? COLORS.background.secondary : "transparent",
                  }}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-5 pb-8 pt-4">
          <Button
            onClick={handleConfirm}
            className="w-full h-14 text-base font-semibold rounded-xl hover:bg-gray-800 text-white"
            style={{ backgroundColor: COLORS.text.primary }}
          >
            확인
          </Button>
        </div>
      </div>
    </>
  );
}
