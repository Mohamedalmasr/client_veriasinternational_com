"use client";

import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface FormError {
  field: string;
  message: string;
  severity?: "error" | "warning" | "info";
}

interface FormErrorsDisplayProps {
  errors: FormError[];
  onClose?: () => void;
  onFieldClick?: (fieldName: string) => void;
}

export function FormErrorsDisplay({
  errors,
  onClose,
  onFieldClick,
}: FormErrorsDisplayProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  const errorCount = errors.filter((e) => e.severity !== "warning").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  const getIcon = (severity?: string) => {
    switch (severity) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600 flex-none" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600 flex-none" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600 flex-none" />;
    }
  };

  const getBackgroundColor = (severity?: string) => {
    switch (severity) {
      case "warning":
        return "bg-amber-50 hover:bg-amber-100";
      case "info":
        return "bg-blue-50 hover:bg-blue-100";
      default:
        return "bg-red-50 hover:bg-red-100";
    }
  };

  const getBorderColor = (severity?: string) => {
    switch (severity) {
      case "warning":
        return "border-amber-200";
      case "info":
        return "border-blue-200";
      default:
        return "border-red-200";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-3 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-none" />
              <div>
                <h3 className="font-semibold text-red-900">Form Errors</h3>
                <p className="text-xs text-red-700">
                  {errorCount} error{errorCount !== 1 ? "s" : ""}
                  {warningCount > 0 &&
                    `, ${warningCount} warning${warningCount !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-red-200 rounded transition-colors"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Errors List */}
        <ScrollArea className="max-h-64">
          <div className="divide-y divide-gray-200">
            {errors.map((error, idx) => (
              <div
                key={idx}
                onClick={() => onFieldClick?.(error.field)}
                className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${getBackgroundColor(
                  error.severity,
                )} ${getBorderColor(error.severity)}`}
              >
                <div className="flex items-start gap-2">
                  {getIcon(error.severity)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">
                      {error.field}
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {error.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        {onClose && (
          <>
            <Separator />
            <div className="px-4 py-2 flex justify-end gap-2 bg-gray-50">
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function FormErrorsSummary({ errors }: { errors: FormError[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-none mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 text-sm mb-2">
            Please fix the following errors:
          </h3>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700">
                <span className="font-medium">{error.field}:</span>{" "}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
