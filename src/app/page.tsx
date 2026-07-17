"use client";

import { HomeGrid } from "@/components/pages/HomeGrid";
import { useTabsContext } from "@/contexts/TabsContext";

export default function Dashboard() {
  const { openTab } = useTabsContext();

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-4 pb-6 pt-4">
        <div
          className="border border-border rounded-[14px] p-3"
          style={{
            backgroundImage:
              "radial-gradient(130% 130% at 20% 0%, #ffffff 0%, #f7f9fc 60%, #eef2f7 100%)",
          }}
        >
          <header className="px-2 pb-3 pt-1.5">
            <h1 className="m-0 mb-1.5 text-xl font-extrabold text-foreground">
              Welcome
            </h1>
            <p className="m-0 text-sm text-muted-foreground">
              Pick a module to get started.
            </p>
          </header>
          <HomeGrid onModuleClick={openTab} />
        </div>
      </div>
    </div>
  );
}
