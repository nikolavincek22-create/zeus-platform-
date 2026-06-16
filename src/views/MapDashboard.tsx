'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MOCK_DEALS } from '@/lib/mockData';
import type { Deal } from '@/lib/mockData';
import DealCard from '@/components/DealCard';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import { Search } from 'lucide-react';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function MapDashboard() {
  const [selected, setSelected] = useState<Deal | null>(null);
  const [query, setQuery]       = useState('');

  const filtered = MOCK_DEALS.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.location.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageShell className="flex h-full overflow-hidden">
      {/* Map (main) */}
      <div className="flex-1 relative">
        <MapView
          deals={MOCK_DEALS}
          selectedId={selected?.id}
          onSelectDeal={setSelected}
        />

        {/* Top search bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-full max-w-sm px-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className="w-full bg-zeus-black/90 backdrop-blur-sm border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zeus-white placeholder-white/30 focus:outline-none focus:border-zeus-red/50 transition-colors duration-200"
              placeholder="Traži nekretninu, materijal..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
          {[
            { label: 'Aktivnih dealova', value: MOCK_DEALS.filter(d=>d.status==='active').length },
            { label: 'Ukupna vrijednost', value: `${(MOCK_DEALS.reduce((a,d)=>a+d.price,0)/1e6).toFixed(1)}M €` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zeus-black/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-right">
              <p className="text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
              <p className="text-[18px] font-bold text-zeus-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-80 flex flex-col bg-[#111] border-l border-white/6 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-white/6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zeus-white">
            Dealovi {query && <span className="text-white/30 font-normal">({filtered.length})</span>}
          </h2>
          <RedDot size="sm" pulse label="Novi dealovi" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {filtered.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              highlighted={selected?.id === deal.id}
              onClick={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Selected deal overlay */}
      {selected && (
        <div
          className="absolute bottom-6 left-6 z-[500] bg-zeus-black border border-white/12 rounded-2xl p-4 w-72 shadow-2xl"
          style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1) forwards' }}
        >
          <div className="flex justify-between items-start mb-1">
            <p className="text-[11px] text-white/40 uppercase tracking-wider">
              {selected.type === 'real_estate' ? 'Nekretnina' : 'Materijal'}
            </p>
            <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/70 text-lg leading-none">×</button>
          </div>
          <p className="text-[15px] font-semibold text-zeus-white mb-0.5">{selected.title}</p>
          <p className="text-[22px] font-bold text-zeus-white">{selected.price.toLocaleString('hr-HR')} €</p>
          <p className="text-[11px] text-zeus-red font-mono mt-1">
            Provizija: {(selected.type === 'real_estate' ? selected.price*0.015 : selected.price*0.005).toLocaleString('hr-HR', {maximumFractionDigits:0})} €
          </p>
          <button className="mt-3 w-full bg-zeus-red hover:bg-red-600 text-white text-sm font-semibold rounded-lg py-2.5 transition-colors duration-200">
            Otvori deal
          </button>
        </div>
      )}
    </PageShell>
  );
}
