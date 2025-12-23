"use client";

import { COLORS } from "@/lib/constants";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  className = "",
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full py-4 rounded-xl font-medium transition-colors disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: isDisabled ? COLORS.border.default : COLORS.text.primary,
        color: isDisabled ? COLORS.text.disabled : COLORS.background.primary,
      }}
    >
      {children}
    </button>
  );
}
