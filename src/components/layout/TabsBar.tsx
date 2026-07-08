import { X } from 'lucide-react';
import { TabItem } from '@/types/tabs';

interface TabsBarProps {
  tabs: TabItem[];
  activeKey?: string;
  onTabClick: (key: string) => void;
  onTabClose: (key: string) => void;
}

export function TabsBar({ tabs, activeKey, onTabClick, onTabClose }: TabsBarProps) {
  return (
    <div className="bg-card border-b border-border px-4 flex items-center gap-2 h-11 overflow-x-auto scrollbar-thin sticky top-14 z-40">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabClick(tab.key)}
          className={`flex items-center gap-2 px-3 h-8 rounded-t-md text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeKey === tab.key 
              ? 'bg-[#0b2e6f] text-white border-[#0b2e6f]' 
              : 'bg-transparent text-foreground border-transparent hover:bg-primary/10'
          }`}
        >
          <span>{tab.title}</span>
          {!tab.isPinned && (
            <span 
              onClick={(e) => { e.stopPropagation(); onTabClose(tab.key); }}
              className="ml-1 p-0.5 rounded hover:bg-white/20 text-current transition-colors"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
