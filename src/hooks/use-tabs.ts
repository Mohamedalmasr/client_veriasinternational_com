'use client';

import { useState, useCallback } from 'react';
import { TabItem } from '@/types/tabs';
import { getTabConfig } from '@/lib/tab-config';

export function useTabs() {
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: 'home', title: 'Home', href: '/', isActive: true, isPinned: true }
  ]);

  const openTab = useCallback((key: string) => {
    setTabs(prev => {
      const exists = prev.find(t => t.key === key);
      if (exists) {
        return prev.map(t => ({ ...t, isActive: t.key === key }));
      }
      const config = getTabConfig(key);
      return [
        ...prev.map(t => ({ ...t, isActive: false })),
        { key, title: config.title, href: config.href, isActive: true }
      ];
    });
  }, []);

  const closeTab = useCallback((key: string) => {
    if (key === 'home') return;
    setTabs(prev => {
      const filtered = prev.filter(t => t.key !== key);
      const wasActive = prev.find(t => t.key === key)?.isActive;
      if (wasActive && filtered.length > 0) {
        filtered[filtered.length - 1].isActive = true;
      }
      return filtered;
    });
  }, []);

  const activeTab = tabs.find(t => t.isActive);

  return { tabs, activeTab, openTab, closeTab };
}
