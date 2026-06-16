'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { MapPin, TrendingUp, Package, ArrowUpRight } from 'lucide-react';
import type { Deal } from '@/lib/mockData';
import { calcCommission, getCommissionRate } from '@/lib/mockData';
import RedDot from './RedDot';

interface DealCardProps {
  deal: Deal;
  onClick?: (deal: Deal) => void;
  highlighted?: boolean;
}

const STATUS_LABEL: Record<Deal['status'], string> = {
  active:  'Aktivan',
  pending: 'Na čekanju',
  closed:  'Zatvoren',
};

const STATUS_CLASS: Record<Deal['status'], string> = {
  active:  'bg-green-500/15 text-green-400 border-green-500/25',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  closed:  'bg-white/10 text-white/40 border-white/15',
};

export default function DealCard({ deal, onClick, highlighted }: DealCardProps) {
  const [pressed, setPressed] = useState(false);
  const commission  = calcCommission(deal.price, deal.type);
  const commRate    = getCommissionRate(deal.type);
  const isRE        = deal.type === 'real_estate';

  return (
    <div
      className={clsx(
        'deal-card relative bg-gradient-to-br from-zeus-black via-[#101010] to-zeus-black rounded-xl cursor-pointer select-none overflow-hidden border min-w-0',
        highlighted ? 'border-zeus-red/60 shadow-lg shadow-zeus-red/10' : 'border-white/8',
      )}
      style={{ transform: pressed ? 'scale(0.98)' : undefined }}
      onClick={() => onClick?.(deal)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {/* Top color stripe + visual badge */}
      <div className="relative h-20 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${deal.imageHue}, 55%, 25%), hsl(${(deal.imageHue + 40) % 360}, 45%, 15%))` }}>
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 70% 30%, hsl(${deal.imageHue}, 75%, 60%), transparent 60%)` }} />
        {/* Type icon centered */}
        <div className="absolute top-3 left-3">
          <div className={clsx(
            'flex items-center gap-1.5 px-2 py-1 rounded-md backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider',
            isRE ? 'bg-blue-500/30 text-blue-100 border border-blue-300/30' : 'bg-amber-500/30 text-amber-100 border border-amber-300/30',
          )}>
            {isRE ? <TrendingUp size={11} /> : <Package size={11} />}
            {isRE ? 'Nekretnina' : 'Materijal'}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className={clsx('text-[9px] font-bold px-2 py-1 rounded-md border backdrop-blur-md uppercase tracking-wider', STATUS_CLASS[deal.status])}>
            {STATUS_LABEL[deal.status]}
          </span>
        </div>
        {highlighted && (
          <div className="absolute bottom-3 right-3">
            <RedDot size="md" pulse />
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-zeus-white leading-tight mb-1 truncate">
          {deal.title}
        </h3>
        <p className="text-[11px] text-white/40 flex items-center gap-1 mb-3 truncate">
          <MapPin size={10} className="shrink-0" /> {deal.location}
        </p>

        {/* Price row */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[22px] font-bold text-zeus-white leading-none tabular">
              {deal.price.toLocaleString('hr-HR')} €
            </p>
            {isRE && deal.sqm && (
              <p className="text-[10px] text-white/40 mt-1 tabular">
                {deal.sqm} m² · {Math.round(deal.price / deal.sqm).toLocaleString('hr-HR')} €/m²
              </p>
            )}
            {!isRE && deal.category && (
              <p className="text-[10px] text-white/40 mt-1">{deal.category}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">ZEUS {commRate}</p>
            <p className="text-[13px] font-mono font-bold text-zeus-red tabular">
              {commission.toLocaleString('hr-HR', { maximumFractionDigits: 0 })} €
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-white/6 flex items-center justify-between gap-2">
          <p className="text-[11px] text-white/40 truncate">
            <span className="text-white/30">Prodavač: </span>
            <span className="text-white/70">{deal.seller}</span>
          </p>
          <ArrowUpRight size={13} className="text-white/30 shrink-0" />
        </div>
      </div>
    </div>
  );
}
