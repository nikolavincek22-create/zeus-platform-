'use client';
import { useState } from 'react';
import { MOCK_DEALS } from '@/lib/mockData';
import type { Deal } from '@/lib/mockData';
import { calcCommission, getCommissionRate } from '@/lib/mockData';
import DealCard from '@/components/DealCard';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import { TrendingUp, Package, Sparkles, ArrowUpRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Filter = 'all' | 'real_estate' | 'material';
type Sort   = 'new' | 'priceAsc' | 'priceDesc';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'new',       label: 'Najnoviji'      },
  { id: 'priceAsc',  label: 'Cijena ↑'       },
  { id: 'priceDesc', label: 'Cijena ↓'       },
];

export default function DealsView() {
  const [filter, setFilter]     = useState<Filter>('all');
  const [sort, setSort]         = useState<Sort>('new');
  const [selected, setSelected] = useState<Deal | null>(null);

  const filtered = MOCK_DEALS.filter(d => filter === 'all' || d.type === filter);
  const deals = [...filtered].sort((a, b) => {
    if (sort === 'priceAsc')  return a.price - b.price;
    if (sort === 'priceDesc') return b.price - a.price;
    return 0;
  });

  const totalValue = deals.reduce((a, d) => a + d.price, 0);
  const totalComm  = deals.reduce((a, d) => a + calcCommission(d.price, d.type), 0);
  const avgPrice   = deals.length ? totalValue / deals.length : 0;

  const FILTERS: { id: Filter; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all',          label: 'Sve',        icon: <Sparkles size={13} />,    count: MOCK_DEALS.length },
    { id: 'real_estate',  label: 'Nekretnine', icon: <TrendingUp size={13} />,  count: MOCK_DEALS.filter(d => d.type === 'real_estate').length },
    { id: 'material',     label: 'Materijali', icon: <Package size={13} />,     count: MOCK_DEALS.filter(d => d.type === 'material').length },
  ];

  return (
    <PageShell className="flex flex-col h-full min-h-0 overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/6 shrink-0 bg-gradient-to-b from-zeus-black/40 to-transparent">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zeus-white">Tržište dealova</h1>
              <RedDot size="md" pulse label="Novi dealovi" />
            </div>
            <p className="text-[13px] text-white/45 mt-1">
              {deals.length} aktivnih oglasa · azurirano u stvarnom vremenu
            </p>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as Sort)}
              className="appearance-none bg-zeus-black border border-white/10 rounded-lg pl-3 pr-8 py-2 text-[12px] text-white/70 cursor-pointer hover:border-white/20 focus:outline-none focus:border-zeus-red/40 transition-colors duration-200"
            >
              {SORTS.map(s => <option key={s.id} value={s.id}>Sortiraj: {s.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Ukupna vrijednost', value: `${(totalValue / 1e6).toFixed(2)}M €`, tone: 'text-zeus-white',  trend: '+12.4%' },
            { label: 'ZEUS provizija',     value: `${totalComm.toLocaleString('hr-HR', { maximumFractionDigits: 0 })} €`, tone: 'text-zeus-red',   trend: '+8.1%'  },
            { label: 'Prosječna cijena',   value: `${avgPrice.toLocaleString('hr-HR', { maximumFractionDigits: 0 })} €`, tone: 'text-zeus-white', trend: '−2.3%' },
            { label: 'Aktivnih dealova',   value: deals.length, tone: 'text-green-400',  trend: '+3' },
          ].map(stat => (
            <div key={stat.label} className="bg-zeus-black border border-white/8 rounded-xl p-3.5 hover:border-white/16 transition-colors duration-200 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-white/35 uppercase tracking-wider truncate">{stat.label}</p>
                <span className={clsx(
                  'text-[10px] font-semibold tabular',
                  stat.trend.startsWith('+') ? 'text-green-400' : 'text-zeus-red',
                )}>{stat.trend}</span>
              </div>
              <p className={clsx('text-[20px] font-bold tabular truncate', stat.tone)}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 select-none',
                filter === f.id
                  ? 'bg-zeus-red text-white shadow-lg shadow-zeus-red/20'
                  : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/90 border border-white/8',
              )}
              style={{ transform: filter === f.id ? 'scale(1.02)' : 'scale(1)' }}
            >
              {f.icon}
              {f.label}
              <span className={clsx(
                'text-[10px] font-bold tabular px-1.5 py-0.5 rounded-md',
                filter === f.id ? 'bg-white/20' : 'bg-white/10 text-white/40',
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Package size={32} className="text-white/20 mb-3" />
            <p className="text-sm text-white/50">Nema dealova za odabrani filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {deals.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                highlighted={selected?.id === deal.id}
                onClick={d => setSelected(prev => prev?.id === d.id ? null : d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div
          className="shrink-0 border-t border-white/8 bg-gradient-to-b from-zeus-black to-[#0a0a0a] px-6 py-5"
          style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1) forwards' }}
        >
          <div className="flex items-start justify-between mb-4 gap-4">
            <div className="min-w-0">
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-0.5 flex items-center gap-2">
                {selected.type === 'real_estate' ? (
                  <><TrendingUp size={11} /> Nekretnina · {selected.sqm} m²</>
                ) : (
                  <><Package size={11} /> Materijal · {selected.category}</>
                )}
              </p>
              <h2 className="text-lg font-bold text-zeus-white truncate">{selected.title}</h2>
              <p className="text-[12px] text-white/40 mt-0.5">{selected.location} · {selected.seller}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-white/30 hover:text-white/80 text-2xl leading-none shrink-0"
            >×</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white/4 border border-white/8 rounded-xl p-3">
              <p className="text-[10px] text-white/35 uppercase tracking-wider">Cijena</p>
              <p className="text-xl font-bold text-zeus-white tabular mt-1">{selected.price.toLocaleString('hr-HR')} €</p>
            </div>
            <div className="bg-zeus-red/8 border border-zeus-red/25 rounded-xl p-3">
              <p className="text-[10px] text-zeus-red/70 uppercase tracking-wider">ZEUS provizija ({getCommissionRate(selected.type)})</p>
              <p className="text-xl font-bold text-zeus-red font-mono mt-1 tabular">
                {calcCommission(selected.price, selected.type).toLocaleString('hr-HR', { maximumFractionDigits: 0 })} €
              </p>
            </div>
            <div className="bg-white/4 border border-white/8 rounded-xl p-3">
              <p className="text-[10px] text-white/35 uppercase tracking-wider">Status</p>
              <p className="text-xl font-bold text-green-400 mt-1 capitalize">{selected.status}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-zeus-red hover:bg-red-600 text-white text-[13px] font-semibold rounded-xl py-3 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]">
              Pokreni transakciju <ArrowUpRight size={14} />
            </button>
            <button className="flex-1 bg-white/6 hover:bg-white/12 text-white/80 text-[13px] font-semibold rounded-xl py-3 transition-colors duration-200 border border-white/10">
              Izradi ugovor
            </button>
            <button className="px-5 bg-white/4 hover:bg-white/8 text-white/60 text-[13px] font-semibold rounded-xl py-3 transition-colors duration-200 border border-white/10">
              Spremi
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
