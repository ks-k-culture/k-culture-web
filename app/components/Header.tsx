"use client";

import { COLORS } from "@/lib/constants";
import { ArrowLeftIcon, SearchIcon } from "@/app/components/Icons";

interface HeaderProps {
  title: string;
  highlightedName?: string;
}

export default function Header({ title, highlightedName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white" style={{ height: "48px" }}>
      <div
        className="max-w-lg mx-auto h-full flex items-center justify-between"
        style={{ padding: "0px 20px", gap: "1px" }}
      >
        <div className="flex items-center gap-3" style={{ width: "24px" }}>
          <button className="w-6 h-6 flex items-center justify-center" aria-label="뒤로가기">
            <ArrowLeftIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
          </button>
        </div>
        <h1
          className="font-semibold flex items-center justify-center"
          style={{
            fontSize: "16px",
            lineHeight: "22px",
            letterSpacing: "-0.02em",
            color: COLORS.text.primary,
          }}
        >
          {highlightedName && <span style={{ color: COLORS.text.muted }}>&apos;</span>}
          {highlightedName && <span style={{ color: COLORS.text.primary }}>{highlightedName}</span>}
          {highlightedName && <span style={{ color: COLORS.text.muted }}>&apos;</span>}
          <span className="ml-1" style={{ color: COLORS.text.primary }}>
            {title}
          </span>
        </h1>
        <div className="flex items-center justify-end gap-3" style={{ width: "24px" }}>
          <button className="w-6 h-6 flex items-center justify-center" aria-label="검색">
            <SearchIcon className="w-6 h-6" style={{ color: COLORS.text.primary }} />
          </button>
        </div>
      </div>
    </header>
  );
}
