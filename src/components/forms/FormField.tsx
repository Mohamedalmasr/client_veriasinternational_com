"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      containerClassName = "",
      labelClassName = "w-[230px] text-[0.8rem] font-semibold flex-none",
      helperText,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        <div className="flex items-start gap-2">
          <label className={labelClassName}>{label}</label>
          <div className="flex-1 min-w-0">
            <Input
              ref={ref}
              className={`flex-1 min-w-0 rounded border transition-all duration-200 text-[0.88rem] bg-[#f9fafb] shadow-none placeholder:text-gray-400 leading-[1.4]
                ${
                  error
                    ? "border-red-500 focus:border-red-600 focus:outline-red-500 focus:bg-red-50"
                    : "border-[#d1d5db] focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px]"
                }
                ${className}`}
              {...props}
            />
            {error && (
              <div className="mt-1 flex items-center gap-1.5 text-red-600 text-[0.75rem] font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-3.5 h-3.5 flex-none" />
                <span>{error}</span>
              </div>
            )}
            {helperText && !error && (
              <p className="mt-1 text-[0.75rem] text-gray-500">{helperText}</p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

FormField.displayName = "FormField";
