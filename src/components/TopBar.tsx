'use client';
import { Bell, Search as SearchIcon, Command } from 'lucide-react';
import RedDot from './RedDot';

export default function TopBar({ title }: { title: string }) {
  return (
    <header className="h-14 shrink-0 bg-zeus-black/80 backdrop-blur-xl border-b border-white/6 flex items-center justify-between px-5 z-20">
      {/* Left: page title + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-[15px] font-semibold text-zeus-white truncate">{title}</h1>
        <span className="hidden md:inline text-[10px] text-white/30 font-mono uppercase tracking-widest border border-white/10 rounded-md px-1.5 py-0.5">
          ZEUS · Phase 1
        </span>
      </div>

      {/* Right: search · notif · profile */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex relative">
          <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            placeholder="Brza pretraga..."
            className="bg-white/4 border border-white/8 rounded-lg pl-8 pr-12 py-1.5 text-[12px] text-zeus-white placeholder-white/30 focus:outline-none focus:border-zeus-red/40 transition-colors duration-200 w-64"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-white/30 pointer-events-none">
            <Command size={10} /> K
          </span>
        </div>

        <button className="relative w-8 h-8 rounded-lg bg-white/4 hover:bg-white/8 border border-white/8 flex items-center justify-center transition-colors duration-200">
          <Bell size={14} className="text-white/60" />
          <span className="absolute -top-0.5 -right-0.5">
            <RedDot size="sm" pulse={false} />
          </span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-white/8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zeus-red/30 to-zeus-red/10 border border-zeus-red/30 flex items-center justify-center text-[10px] font-bold text-zeus-white">
            MH
          </div>
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold text-zeus-white leading-tight">Marko Horvat</p>
            <p className="text-[9px] text-yellow-400 leading-tight">Elite · 847 pts</p>
          </div>
        </div>
      </div>
    </header>
  );
}
