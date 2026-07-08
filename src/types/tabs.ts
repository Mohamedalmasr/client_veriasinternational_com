export interface TabConfig {
  title: string;
  href: string;
  navHref?: string | null;
}

export interface TabItem {
  key: string;
  title: string;
  href: string;
  isActive: boolean;
  isPinned?: boolean;
}

export type TabMap = Record<string, TabConfig>;
