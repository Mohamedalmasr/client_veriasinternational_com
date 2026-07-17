import { useMemo } from "react";
import type { FieldErrors } from "react-hook-form";

export interface FormError {
  field: string;
  message: string;
  severity?: "error" | "warning" | "info";
}

export function useFormErrors(errors: FieldErrors) {
  return useMemo(() => {
    const errorList: FormError[] = [];
    Object.entries(errors).forEach(([key, error]) => {
      if (error && typeof error === "object" && "message" in error) {
        errorList.push({
          field: key.charAt(0).toUpperCase() + key.slice(1),
          message: String(error.message),
          severity: "error",
        });
      }
    });
    return errorList;
  }, [errors]);
}
