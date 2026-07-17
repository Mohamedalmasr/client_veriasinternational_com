"use client";

import { createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TabItem } from "@/types/tabs";
import { getTabConfig, TAB_MAP } from "@/lib/tab-config";

const STORAGE_KEY = "oneklient-tabs";

const HOME_TAB: TabItem = { key: "home", title: "Home", href: "/", isActive: true, isPinned: true };

function pathnameToKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/real-estate/")) {
    const slug = pathname.split("/")[2] ?? "";
    const entry = Object.entries(TAB_MAP).find(
      ([, v]) => v.href === `/real-estate/${slug}`,
    );
    if (entry) return entry[0];
  }
  if (pathname === "/real-estate") return "realestate";
  if (pathname.startsWith("/crm")) return "crm";
  if (pathname.startsWith("/accounting")) return "accounting";
  if (pathname.startsWith("/documents")) return "documents";
  return "home";
}

function computeInitialTabs(activeKey: string): TabItem[] {
  if (activeKey === "home") return [HOME_TAB];
  const config = getTabConfig(activeKey);
  return [
    HOME_TAB,
    { key: activeKey, title: config.title, href: config.href, isActive: true },
  ];
}

function loadTabs(): TabItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: TabItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

function persistTabs(tabs: TabItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  } catch {}
}

type TabsAction =
  | { type: "LOAD"; tabs: TabItem[] }
  | { type: "OPEN"; key: string; config: { title: string; href: string } }
  | { type: "CLOSE"; key: string }
  | { type: "SYNC"; activeKey: string };

function tabsReducer(prev: TabItem[], action: TabsAction): TabItem[] {
  let next: TabItem[];
  switch (action.type) {
    case "LOAD": {
      next = action.tabs;
      break;
    }
    case "OPEN": {
      const exists = prev.find((t) => t.key === action.key);
      next = exists
        ? prev.map((t) => ({ ...t, isActive: t.key === action.key }))
        : [...prev.map((t) => ({ ...t, isActive: false })), { key: action.key, title: action.config.title, href: action.config.href, isActive: true }];
      break;
    }
    case "CLOSE": {
      if (action.key === "home") return prev;
      next = prev.filter((t) => t.key !== action.key);
      break;
    }
    case "SYNC": {
      const exists = prev.find((t) => t.key === action.activeKey);
      if (exists) {
        next = prev.map((t) => ({ ...t, isActive: t.key === action.activeKey }));
      } else {
        const config = getTabConfig(action.activeKey);
        next = [...prev.map((t) => ({ ...t, isActive: false })), { key: action.activeKey, title: config.title, href: config.href, isActive: true }];
      }
      break;
    }
    default:
      return prev;
  }
  persistTabs(next);
  return next;
}

interface TabsContextValue {
  tabs: TabItem[];
  activeKey: string;
  openTab: (key: string) => void;
  closeTab: (key: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  tabs: [HOME_TAB],
  activeKey: "home",
  openTab: () => {},
  closeTab: () => {},
});

export function useTabsContext() {
  return useContext(TabsContext);
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeKey = useMemo(() => pathnameToKey(pathname), [pathname]);
  const hydratedRef = useRef(false);

  const [tabs, dispatch] = useReducer(
    tabsReducer,
    activeKey,
    (initActiveKey: string) => computeInitialTabs(initActiveKey),
  );

  useEffect(() => {
    const saved = loadTabs();
    const config = getTabConfig(activeKey);
    const exists = saved.find((t) => t.key === activeKey);
    const synced = exists
      ? saved.map((t) => ({ ...t, isActive: t.key === activeKey }))
      : [...saved.map((t) => ({ ...t, isActive: false })), { key: activeKey, title: config.title, href: config.href, isActive: true }];
    persistTabs(synced);
    dispatch({ type: "LOAD", tabs: synced });
    hydratedRef.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    dispatch({ type: "SYNC", activeKey });
  }, [activeKey]);

  const openTab = useCallback(
    (key: string) => {
      const config = getTabConfig(key);
      dispatch({ type: "OPEN", key, config: { title: config.title, href: config.href } });
      if (config.href && config.href !== "/") {
        router.push(config.href);
      } else if (key === "home") {
        router.push("/");
      }
    },
    [router],
  );

  const closeTab = useCallback(
    (key: string) => {
      const tab = tabs.find((t) => t.key === key);
      dispatch({ type: "CLOSE", key });
      if (tab?.isActive) {
        const remaining = tabs.filter((t) => t.key !== key);
        if (remaining.length > 0) {
          const last = remaining[remaining.length - 1];
          router.push(last.href === "/" ? "/" : last.href);
        }
      }
    },
    [router, tabs],
  );

  return (
    <TabsContext.Provider value={{ tabs, activeKey, openTab, closeTab }}>
      {children}
    </TabsContext.Provider>
  );
}
