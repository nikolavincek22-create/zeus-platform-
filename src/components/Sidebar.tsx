'use client';
import { useState } from 'react';
import clsx from 'clsx';
import RedDot from './RedDot';
import { MapPin, LayoutList, User, BookOpen, FileText, Zap } from 'lucide-react';

export type View = 'map' | 'deals' | 'profile' | 'education' | 'contract';

interface SidebarProps {
  active: View;
  onChange: (v: View) => void;
  notifCount?: number;
}

const NAV: { id: View; icon: React.ReactNode; label: string }[] = [
  { id: 'map',       icon: <MapPin size={20} />,      label: 'Mapa'      },
  { id: 'deals',     icon: <LayoutList size={20} />,  label: 'Dealovi'   },
  { id: 'profile',   icon: <User size={20} />,        label: 'Profil'    },
  { id: 'education', icon: <BookOpen size={20} />,    label: 'Edukacija' },
  { id: 'contract',  icon: <FileText size={20} />,    label: 'Ugovor'    },
];

export default function Sidebar({ active, onChange, notifCount = 2 }: SidebarProps) {
  const [hovered, setHovered] = useState<View | null>(null);

  return (
    <aside className="flex flex-col h-full w-16 bg-zeus-black border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-white/5">
        <Zap size={22} className="text-zeus-red" strokeWidth={2.5} />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center py-4 gap-1">
        {NAV.map(({ id, icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              title={label}
              onClick={() => onChange(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className={clsx(
                'relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-zeus-red/50',
                isActive
                  ? 'bg-white/10 text-zeus-white'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5',
              )}
              style={{
                transform: hovered === id && !isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1), background 200ms',
              }}
            >
              {icon}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-zeus-red rounded-r-full" />
              )}
              {id === 'deals' && notifCount > 0 && (
                <span className="absolute top-1 right-1">
                  <RedDot size="sm" pulse={false} />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User avatar stub */}
      <div className="h-14 flex items-center justify-center border-t border-white/5">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-semibold text-white/60">
          MH
        </div>
      </div>
    </aside>
  );
}
