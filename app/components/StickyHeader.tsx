"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/app/components/Icons";
import { COLORS } from "@/lib/constants";

interface StickyHeaderProps {
  title: string;
  showBorder?: boolean;
  onBack?: () => void;
}

export function StickyHeader({ title, showBorder = false, onBack }: StickyHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className={`sticky top-0 z-20 bg-white ${showBorder ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
        </button>
        <h1 className="text-lg font-semibold" style={{ color: COLORS.text.primary }}>
          {title}
        </h1>
      </div>
    </header>
  );
}
