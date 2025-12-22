"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AgeSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAge: string;
  onSelect: (age: string) => void;
}

const ageOptions = ["60대 이상", "50대", "40대", "30대", "20대", "10대"];

export default function AgeSelectModal({ open, onOpenChange, selectedAge, onSelect }: AgeSelectModalProps) {
  const [tempSelectedAge, setTempSelectedAge] = useState(selectedAge);

  if (!open) return null;

  const handleConfirm = () => {
    if (tempSelectedAge) {
      onSelect(tempSelectedAge);
      onOpenChange(false);
    }
  };

  const selectedIndex = ageOptions.indexOf(tempSelectedAge);

  return (
    <>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[15px] z-60" onClick={() => onOpenChange(false)} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-70 animate-slide-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
        </div>
        <div className="px-5 pt-4 pb-6">
          <h2 className="text-xl font-bold text-[#191F28]">나이대를 선택해 주세요</h2>
        </div>
        <div className="relative px-5">
          <div className="absolute top-0 left-0 right-0 h-[92px] bg-linear-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[92px] bg-linear-to-t from-white to-transparent z-10 pointer-events-none" />

          <div className="flex flex-col items-center py-4">
            {ageOptions.map((age, index) => {
              const isSelected = tempSelectedAge === age;
              const distance = selectedIndex >= 0 ? Math.abs(selectedIndex - index) : -1;

              let opacity = 1;
              let textColor = "#191F28";
              if (tempSelectedAge && !isSelected) {
                if (distance === 1) {
                  opacity = 0.6;
                  textColor = "#4E5968";
                } else if (distance >= 2) {
                  opacity = 0.3;
                  textColor = "#8B95A1";
                }
              }

              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => setTempSelectedAge(age)}
                  className={`w-full py-3 text-center text-lg transition-all rounded-xl ${
                    isSelected ? "bg-[#F2F4F6] font-bold" : "font-medium"
                  }`}
                  style={{
                    opacity: isSelected ? 1 : opacity,
                    color: isSelected ? "#191F28" : textColor,
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
            className="w-full h-14 text-base font-semibold rounded-xl bg-[#191F28] hover:bg-gray-800 text-white"
          >
            확인
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
