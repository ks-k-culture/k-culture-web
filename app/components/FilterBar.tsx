"use client";

export interface FilterOption {
  id: string;
  label: string;
  value?: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilters?: Record<string, string>;
  onFilterClick?: (filterId: string) => void;
}

function ChevronDownIcon({ className, isSelected }: { className?: string; isSelected?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={isSelected ? "#E50815" : "#B0B8C1"}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FilterBar({ filters, selectedFilters = {}, onFilterClick }: FilterBarProps) {
  return (
    <div className="sticky top-12 z-40 bg-white">
      <div className="max-w-lg mx-auto px-5 py-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => {
            const isSelected = !!selectedFilters[filter.id];
            const displayLabel = selectedFilters[filter.id] || filter.label;

            return (
              <button
                key={filter.id}
                onClick={() => onFilterClick?.(filter.id)}
                className={`flex items-center justify-center gap-1 px-3 h-10 min-w-10 bg-white border rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "border-[#E50815] text-[#E50815]"
                    : "border-[#E5E8EB] text-[#4E5968] hover:border-gray-300"
                }`}
                style={{ letterSpacing: "-0.02em" }}
              >
                <span>{displayLabel}</span>
                <ChevronDownIcon className="w-5 h-5" isSelected={isSelected} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
