"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@/app/components/Icons";
import { COLORS } from "@/lib/constants";

interface StickyHeaderProps {
  title: string;
  showBorder?: boolean;
  centered?: boolean;
  href?: string;
  onBack?: () => void;
}

export function StickyHeader({ title, showBorder = false, centered = false, href, onBack }: StickyHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const BackButton = href ? (
    <Link
      href={href}
      className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
    </Link>
  ) : (
    <button
      onClick={handleBack}
      className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ChevronLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
    </button>
  );

  return (
    <header className={`sticky top-0 z-20 bg-white ${showBorder ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-4">
        {BackButton}
        <h1
          className={centered ? "flex-1 text-center text-lg font-semibold -ml-10" : "text-lg font-semibold"}
          style={{ color: COLORS.text.primary }}
        >
          {title}
        </h1>
      </div>
    </header>
  );
}
