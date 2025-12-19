"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface FilterModalOption {
  value: string;
  label: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterModalOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const ITEM_HEIGHT = 56;

export default function FilterModal({ isOpen, onClose, title, options, selectedValue, onSelect }: FilterModalProps) {
  const [localSelected, setLocalSelected] = useState(selectedValue || "");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isClosingRef = useRef(false);

  const selectedIndex = options.findIndex((opt) => opt.value === localSelected);

  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        isClosingRef.current = false;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSelected(selectedValue || "");
  }, [selectedValue, isOpen]);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current && options.length > 0) {
      const timer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const targetIndex = selectedIndex >= 0 ? selectedIndex : 0;
        const targetScroll = targetIndex * ITEM_HEIGHT;
        container.scrollTop = targetScroll;

        if (!localSelected && options.length > 0) {
          setLocalSelected(options[0].value);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedIndex, options, localSelected]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || options.length === 0 || isClosingRef.current) return;

    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container || isClosingRef.current) return;

      const scrollTop = container.scrollTop;
      const centerIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(centerIndex, options.length - 1));

      const targetScroll = clampedIndex * ITEM_HEIGHT;
      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      if (options[clampedIndex] && !isClosingRef.current) {
        setLocalSelected(options[clampedIndex].value);
      }

      isScrollingRef.current = false;
    }, 100);
  }, [options]);

  const handleItemClick = (index: number) => {
    if (!scrollContainerRef.current) return;

    const targetScroll = index * ITEM_HEIGHT;
    scrollContainerRef.current.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });

    setLocalSelected(options[index].value);
  };

  const handleConfirm = () => {
    isClosingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    if (localSelected) {
      onSelect(localSelected);
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  const paddingItems = 2;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[15px]"
        style={{ transition: "opacity 300ms" }}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-lg bg-white rounded-t-3xl transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
        </div>

        <div className="px-5 pb-4">
          <h2 className="text-xl font-bold text-[#191F28]" style={{ letterSpacing: "-0.02em" }}>
            {title}
          </h2>
        </div>

        <div className="relative" style={{ height: `${ITEM_HEIGHT * 5}px` }}>
          <div
            className="absolute left-5 right-5 bg-[#F2F4F6] rounded-lg pointer-events-none z-0"
            style={{
              top: `${ITEM_HEIGHT * 2}px`,
              height: `${ITEM_HEIGHT}px`,
            }}
          />

          <div
            className="absolute top-0 left-0 right-0 pointer-events-none z-10"
            style={{
              height: `${ITEM_HEIGHT * 2}px`,
              background: "linear-gradient(to bottom, white 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
            style={{
              height: `${ITEM_HEIGHT * 2}px`,
              background: "linear-gradient(to top, white 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
            }}
          />

          <div
            ref={scrollContainerRef}
            className="absolute inset-0 overflow-y-auto hide-scrollbar"
            onScroll={handleScroll}
            style={{
              scrollSnapType: "y mandatory",
            }}
          >
            {Array.from({ length: paddingItems }).map((_, i) => (
              <div key={`top-${i}`} style={{ height: `${ITEM_HEIGHT}px` }} />
            ))}

            {options.map((option, index) => {
              const isOptionSelected = localSelected === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleItemClick(index)}
                  className="w-full flex items-center justify-center transition-colors"
                  style={{
                    height: `${ITEM_HEIGHT}px`,
                    scrollSnapAlign: "center",
                  }}
                >
                  <span
                    className={`text-lg font-medium transition-colors ${
                      isOptionSelected ? "text-[#191F28]" : "text-[#8B95A1]"
                    }`}
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}

            {Array.from({ length: paddingItems }).map((_, i) => (
              <div key={`bottom-${i}`} style={{ height: `${ITEM_HEIGHT}px` }} />
            ))}
          </div>
        </div>

        <div className="p-5 bg-white">
          <button
            onClick={handleConfirm}
            disabled={!localSelected}
            className={`w-full h-12 rounded-lg font-medium text-base transition-colors ${
              localSelected ? "bg-[#191F28] text-white" : "bg-[#F2F4F6] text-[#D1D6DB]"
            }`}
            style={{ letterSpacing: "-0.02em" }}
          >
            배우 선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}
