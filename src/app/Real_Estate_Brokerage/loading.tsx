import { Skeleton } from "@/components/ui/skeleton";

export default function RealEstateLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-auto w-full">
        <div className="max-w-[1200px] mx-auto w-full p-6 space-y-6">
          <Skeleton className="h-4 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
