import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { User } from '@/types/backend';

interface AppHeaderProps {
  user: User;
  onNavClick: (key: string) => void;
  activeKey?: string;
}

export function AppHeader({ user, onNavClick, activeKey }: AppHeaderProps) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'crm', label: 'CRM' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'documents', label: 'Documents' },
  ];

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 font-bold text-xl text-primary">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white text-xs">OK</div>
        <span>ONEklient</span>
      </div>
      
      <nav className="hidden md:flex gap-6">
        {navItems.map(item => (
          <button 
            key={item.key}
            onClick={() => onNavClick(item.key)}
            className={`text-sm font-semibold transition-colors ${
              activeKey === item.key
                ? 'text-[#0b2e6f]'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium hidden sm:block">
          {user.name}: <b>{user.phone}</b>
        </span>
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <Mail className="h-4 w-4" />
          {user.unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-card">
              {user.unreadMessages}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
