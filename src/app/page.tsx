'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { TabsBar } from '@/components/layout/TabsBar';
import { HomeGrid } from '@/components/pages/HomeGrid';
import RealEstateBrokerageGrid from '@/components/pages/RealEstateBrokerageGrid';
import { useTabs } from '@/hooks/use-tabs';
import { Toaster } from 'sonner';
import { User } from '@/types/backend';

const mockUser: User = {
  id: '1',
  name: 'Lenzi Aziz',
  phone: '813786944',
  unreadMessages: 1,
};

export default function Dashboard() {
  const { tabs, activeTab, openTab, closeTab } = useTabs();

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      <AppHeader user={mockUser} onNavClick={openTab} activeKey={activeTab?.key} />
      <TabsBar
        tabs={tabs}
        activeKey={activeTab?.key}
        onTabClick={openTab}
        onTabClose={closeTab}
      />
      <main className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeTab?.key === 'home' || !activeTab ? (
          <div className="flex-1 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 pb-6 pt-4">
              <div
                className="border border-border rounded-[14px] p-3"
                style={{
                  backgroundImage:
                    'radial-gradient(130% 130% at 20% 0%, #ffffff 0%, #f7f9fc 60%, #eef2f7 100%)',
                }}
              >
                <header className="px-2 pb-3 pt-1.5">
                  <h1 className="m-0 mb-1.5 text-xl font-extrabold text-foreground">Welcome</h1>
                  <p className="m-0 text-sm text-muted-foreground">Pick a module to get started.</p>
                </header>
                <HomeGrid onModuleClick={(key) => openTab(key)} />
              </div>
            </div>
          </div>
        ) : activeTab?.key === 'realestate' ? (
          <RealEstateBrokerageGrid onFormClick={openTab} />
        ) : (
          <div className="flex-1 p-4 overflow-hidden max-w-[1200px] mx-auto w-full min-h-0">
            <iframe
              src={activeTab?.href}
              className="w-full h-full border border-border rounded-xl bg-white shadow-sm"
              title={activeTab?.title}
            />
          </div>
        )}
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
