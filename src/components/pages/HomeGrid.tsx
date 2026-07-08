import { Module } from '@/types/backend';

const modules: Module[] = [
  { id: 'crm', title: 'CRM', description: 'Open CRM module', href: '/crm', tabKey: 'crm' },
  { id: 'accounting', title: 'Accounting', description: 'Go to Accounting', href: '/accounting', tabKey: 'accounting' },
  { id: 'documents', title: 'Documents', description: 'Open Documents center', href: '/documents', tabKey: 'documents' },
  { id: 'teams', title: 'Teams', description: 'Manage members & roles', href: '/teams', tabKey: 'teams' },
  { id: 'services', title: 'Real Estate Brokerage', href: '/services', tabKey: 'realestate', isAccent: true },
  { id: 'project-mgmt', title: 'Project Management', href: '/project', tabKey: 'project', isAccent: true },
  { id: 'property-mgmt', title: 'Property Management', href: '/property', tabKey: 'property', isAccent: true },
];

interface HomeGridProps {
  onModuleClick: (tabKey: string) => void;
}

export function HomeGrid({ onModuleClick }: HomeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-3">
      {modules.map(mod => (
          <button
            key={mod.id}
            data-id={mod.id}
            onClick={() => onModuleClick(mod.tabKey)}
            className={`
              flex flex-col items-center justify-center gap-1.5
              min-h-[90px] px-3 py-2.5 w-full h-full
              rounded-xl border
              transition-all duration-100 ease
              hover:-translate-y-0.5
              focus-visible:outline-3 focus-visible:outline-[#0b2e6f]/30 focus-visible:outline-offset-2
              cursor-pointer font-bold
              ${mod.isAccent
                ? 'bg-[#fef9c3] border-[#facc15] text-[#854d0e] shadow-[0_3px_12px_rgba(133,77,14,0.18)] hover:bg-[#fef3c7] hover:border-[#fbbf24] hover:shadow-[0_10px_26px_rgba(133,77,14,0.26)]'
                : 'bg-white border-primary/20 text-foreground shadow-[0_3px_10px_rgba(11,46,111,0.08)] hover:border-primary hover:bg-[#f7fbff] hover:shadow-[0_10px_24px_rgba(11,46,111,0.15)]'
              }
              ${mod.id === 'services' ? 'lg:col-start-2' : ''}
              ${mod.id === 'project-mgmt' ? 'lg:col-start-3' : ''}
              ${mod.id === 'property-mgmt' ? 'lg:col-start-4' : ''}
            `}
          >
            <div className="text-sm text-center leading-snug">{mod.title}</div>
            {mod.description && (
              <div className="text-xs text-muted-foreground font-semibold text-center leading-snug">{mod.description}</div>
            )}
          </button>
      ))}
    </div>
  );
}
