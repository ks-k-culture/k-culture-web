import { COLORS } from "@/lib/constants";

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ children, className = "" }: FormSectionProps) {
  return (
    <div className={`py-4 border-b ${className}`} style={{ borderColor: COLORS.border.default }}>
      {children}
    </div>
  );
}
