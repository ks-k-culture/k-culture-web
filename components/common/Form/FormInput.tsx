import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || `input-${label?.replace(/\s/g, "-").toLowerCase()}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-ivory mb-2 block text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="text-muted-gray pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "border-luxury-tertiary bg-luxury-secondary text-ivory placeholder:text-muted-gray",
              "focus:border-gold w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="text-muted-gray pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-muted-gray mt-1 text-xs">{hint}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
