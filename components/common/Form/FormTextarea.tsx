import { type TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${label?.replace(/\s/g, "-").toLowerCase()}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="text-ivory mb-2 block text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "border-luxury-tertiary bg-luxury-secondary text-ivory placeholder:text-muted-gray",
            "focus:border-gold w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:outline-none",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-muted-gray mt-1 text-xs">{hint}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
