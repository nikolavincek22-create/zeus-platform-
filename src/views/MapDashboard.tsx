'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MOCK_DEALS, calcCommission, getCommissionRate } from '@/lib/mockData';
import type { Deal } from '@/lib/mockData';
import DealCard from '@/components/DealCard';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import { Search, ArrowUpRight, X, TrendingUp, Package } from 'lucide-react';
import clsx from 'clsx';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function MapDashboard() {
  const [selected, setSelected] = useState<Deal | null>(null);
  const [query, setQuery]       = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'real_estate' | 'material'>('all');

  const filtered = MOCK_DEALS.filter(d => {
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    const matchQ    = !query || d.title.toLowerCase().includes(query.toLowerCase()) || d.location.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQ;
  });

  return (
    <PageShell className="flex h-full min-h-0 overflow-hidden">
      {/* Map (main) */}
      <div className="flex-1 min-w-0 relative">
        <MapView
          deals={filtered}
          selectedId={selected?.id}
          onSelectDeal={setSelected}
        />

        {/* Top floating: search + filter chips */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 w-full max-w-2xl px-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              className="w-full bg-zeus-black/90 backdrop-blur-xl border border-white/12 rounded-xl pl-10 pr-10 py-2.5 text-[13px] text-zeus-white placeholder-white/35 focus:outline-none focus:border-zeus-red/50 transition-colors duration-200"
              placeholder="Traži po lokaciji, tipu, nazivu..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-1 bg-zeus-black/90 backdrop-blur-xl border border-white/12 rounded-xl p-1">
            {([
              { id: 'all',         icon: null,                          label: 'Sve' },
              { id: 'real_estate', icon: <TrendingUp size={11} />,      label: 'NK' },
              { id: 'material',    icon: <Package size={11} />,          label: 'MAT' },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={clsx(
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200',
                  typeFilter === t.id ? 'bg-zeus-red text-white' : 'text-white/40 hover:text-white/80',
                )}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top-right stat strip */}
        <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2 w-44">
          {[
            { label: 'Vidljivi dealovi',  value: filtered.length },
            { label: 'Vrijednost',         value: `${(filtered.reduce((a, d) => a + d.price, 0) / 1e6).toFixed(1)}M €` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zeus-black/90 backdrop-blur-xl border border-white/12 rounded-xl px-3.5 py-2.5">
              <p className="text-[9px] text-white/35 uppercase tracking-wider">{label}</p>
              <p className="text-[17px] font-bold text-zeus-white tabular leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Selected detail overlay (floating) */}
        {selected && (
          <div
            className="absolute bottom-6 left-6 z-[500] bg-zeus-black/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 w-80 shadow-2xl"
            style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1) forwards' }}
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  {selected.type === 'real_estate'
                    ? <><TrendingUp size={10} className="text-blue-400" /> Nekretnina</>
                    : <><Package size={10} className="text-amber-400" /> Materijal</>
                  }
                </p>
                <p className="text-[14px] font-semibold text-zeus-white truncate">{selected.title}</p>
                <p className="text-[11px] text-white/40 truncate">{selected.location}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/80 text-xl leading-none shrink-0">×</button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-[9px] text-white/35 uppercase">Cijena</p>
                <p className="text-[16px] font-bold text-zeus-white tabular">{selected.price.toLocaleString('hr-HR')} €</p>
              </div>
              <div className="bg-zeus-red/10 rounded-lg p-2 border border-zeus-red/20">
                <p className="text-[9px] text-zeus-red/70 uppercase">ZEUS ({getCommissionRate(selected.type)})</p>
                <p className="text-[16px] font-bold text-zeus-red tabular font-mono">
                  {calcCommission(selected.price, selected.type).toLocaleString('hr-HR', { maximumFractionDigits: 0 })} €
                </p>
              </div>
            </div>

            <button className="w-full bg-zeus-red hover:bg-red-600 text-white text-[13px] font-semibold rounded-lg py-2.5 transition-colors duration-200 flex items-center justify-center gap-1.5 active:scale-[0.98]">
              Otvori deal <ArrowUpRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Right list panel */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col bg-[#0f0f0f] border-l border-white/6 overflow-hidden shrink-0">
        <div className="px-4 pt-4 pb-3 border-b border-white/6 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-zeus-white">Dealovi</h2>
            <p className="text-[10px] text-white/35 mt-0.5">
              {filtered.length} {query && `od ${MOCK_DEALS.length}`}
            </p>
          </div>
          <RedDot size="sm" pulse label="Novi dealovi" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-[12px] text-white/40 text-center mt-8">Nema rezultata za zadane filtere</p>
          ) : (
            filtered.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                highlighted={selected?.id === deal.id}
                onClick={setSelected}
              />
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
