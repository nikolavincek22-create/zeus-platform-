'use client';
import { useState } from 'react';
import { MOCK_DEALS } from '@/lib/mockData';
import type { Deal } from '@/lib/mockData';
import { calcCommission, getCommissionRate } from '@/lib/mockData';
import DealCard from '@/components/DealCard';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import { Filter, TrendingUp, Package } from 'lucide-react';

type Filter = 'all' | 'real_estate' | 'material';

export default function DealsView() {
  const [filter, setFilter]   = useState<Filter>('all');
  const [selected, setSelected] = useState<Deal | null>(null);

  const deals = MOCK_DEALS.filter(d => filter === 'all' || d.type === filter);
  const totalValue = deals.reduce((a, d) => a + d.price, 0);
  const totalComm  = deals.reduce((a, d) => a + calcCommission(d.price, d.type), 0);

  const FILTERS: { id: Filter; label: string; icon: React.ReactNode }[] = [
    { id: 'all',          label: 'Sve',        icon: null },
    { id: 'real_estate',  label: 'Nekretnine', icon: <TrendingUp size={13} /> },
    { id: 'material',     label: 'Materijali', icon: <Package size={13} />    },
  ];

  return (
    <PageShell className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/6 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-zeus-white">Tržište dealova</h1>
            <p className="text-[12px] text-white/40 mt-0.5">{deals.length} aktivnih oglasa</p>
          </div>
          <RedDot size="md" pulse label="Novi dealovi" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Ukupna vrijednost', value: `${(totalValue/1e6).toFixed(2)}M €` },
            { label: 'ZEUS provizija ukupno', value: `${totalComm.toLocaleString('hr-HR', {maximumFractionDigits:0})} €` },
            { label: 'Dealovi', value: deals.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-3">
              <p className="text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
              <p className="text-[18px] font-bold text-zeus-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200',
                filter === f.id
                  ? 'bg-zeus-red text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80',
              ].join(' ')}
              style={{ transform: filter === f.id ? 'scale(1.03)' : 'scale(1)' }}
            >
              {f.icon}{f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {deals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              highlighted={selected?.id === deal.id}
              onClick={d => setSelected(prev => prev?.id === d.id ? null : d)}
            />
          ))}
        </div>
      </div>

      {/* Detail slide-in */}
      {selected && (
        <div className="shrink-0 border-t border-white/8 bg-[#111] p-5" style={{ animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1) forwards' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-0.5">
                {selected.type === 'real_estate' ? `Nekretnina · ${selected.sqm} m²` : `Materijal · ${selected.category}`}
              </p>
              <h2 className="text-lg font-bold text-zeus-white">{selected.title}</h2>
            </div>
            <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/70 text-xl leading-none ml-4">×</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-white/35">Cijena</p>
              <p className="text-xl font-bold text-zeus-white">{selected.price.toLocaleString('hr-HR')} €</p>
            </div>
            <div>
              <p className="text-[11px] text-white/35">ZEUS provizija ({getCommissionRate(selected.type)})</p>
              <p className="text-xl font-bold text-zeus-red font-mono">
                {calcCommission(selected.price, selected.type).toLocaleString('hr-HR', {maximumFractionDigits:0})} €
              </p>
            </div>
            <div>
              <p className="text-[11px] text-white/35">Prodavač</p>
              <p className="text-[15px] font-semibold text-zeus-white">{selected.seller}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-zeus-red hover:bg-red-600 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors duration-200">
              Pokreni transakciju
            </button>
            <button className="flex-1 bg-white/6 hover:bg-white/10 text-white/70 text-sm font-semibold rounded-xl py-2.5 transition-colors duration-200 border border-white/10">
              Izradi ugovor
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
