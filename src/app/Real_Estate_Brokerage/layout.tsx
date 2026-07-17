"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RealEstateBrokerageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isIndex = segments.length <= 1;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-auto">
      {!isIndex && (
        <div className="px-6 pt-3 flex-none">
          <Link
            href="/real-estate"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#1f4f8f] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Real Estate Forms
          </Link>
        </div>
      )}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
