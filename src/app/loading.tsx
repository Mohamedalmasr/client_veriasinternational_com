import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b flex items-center px-6 gap-4">
        <Skeleton className="h-8 w-32" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </aside>
        <main className="flex-1 p-6">
          <Skeleton className="h-7 w-2/5 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </main>
      </div>
    </div>
  );
}
