"use client";

interface FilterOption {
  id: string;
  label: string;
  value?: string;
}

interface FilterBarProps {
  filters: FilterOption[];
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="#B0B8C1" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="sticky top-12 z-40 bg-white">
      <div className="max-w-lg mx-auto px-5 py-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className="flex items-center justify-center gap-1 px-3 h-10 min-w-10 bg-white border border-[#E5E8EB] rounded-full text-sm font-medium text-[#4E5968] hover:border-gray-300 transition-all whitespace-nowrap shrink-0"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span>{filter.label}</span>
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
