import { COLORS } from "@/lib/constants";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  variant?: "underline" | "box";
  className?: string;
}

export function TextArea({ value, onChange, placeholder, rows = 4, variant = "box", className = "" }: TextAreaProps) {
  const baseStyles = "w-full text-base outline-none resize-none";
  const variantStyles = variant === "box" ? "px-4 py-3 rounded-xl border" : "rounded-lg p-4 border";

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={{
        color: COLORS.text.primary,
        borderColor: COLORS.border.default,
        backgroundColor: variant === "underline" ? COLORS.background.primary : undefined,
      }}
    />
  );
}
