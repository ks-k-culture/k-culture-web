import { type ReactNode, type SelectHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: FormSelectOption[];
  placeholder?: string;
  leftIcon?: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, hint, required, options, placeholder, leftIcon, className, id, ...props }, ref) => {
    const selectId = id || `select-${label?.replace(/\s/g, "-").toLowerCase()}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="text-ivory mb-2 block text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="text-muted-gray pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              {leftIcon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "border-luxury-tertiary bg-luxury-secondary text-ivory",
              "focus:border-gold w-full appearance-none rounded-lg border px-4 py-3 pr-10 transition-colors focus:outline-none",
              leftIcon && "pl-10",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <svg className="text-muted-gray h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-muted-gray mt-1 text-xs">{hint}</p>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
