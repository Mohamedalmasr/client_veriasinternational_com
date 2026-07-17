import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  variant?: "page" | "inline";
}

export function FormSkeleton({ variant = "inline" }: FormSkeletonProps) {
  const container = variant === "page"
    ? "max-w-[1200px] mx-auto w-full p-6"
    : "";

  return (
    <div className={`space-y-6 ${container}`}>
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-1/4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-[230px]" />
            <Skeleton className="h-9 flex-1" />
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-border my-4" />

      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>

      <div className="border-t border-dashed border-border my-4" />

      <div className="space-y-3">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
