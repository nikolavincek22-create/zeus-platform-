'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { MapPin, TrendingUp, Package } from 'lucide-react';
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

export default function DealCard({ deal, onClick, highlighted }: DealCardProps) {
  const [pressed, setPressed] = useState(false);
  const commission  = calcCommission(deal.price, deal.type);
  const commRate    = getCommissionRate(deal.type);
  const isRE        = deal.type === 'real_estate';

  return (
    <div
      className={clsx(
        'deal-card relative bg-zeus-black rounded-xl cursor-pointer select-none overflow-hidden border',
        highlighted ? 'border-zeus-red/60' : 'border-white/8',
      )}
      style={{ transform: pressed ? 'scale(0.98)' : 'scale(1)' }}
      onClick={() => onClick?.(deal)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {/* Colour bar */}
      <div
        className="h-1 w-full"
        style={{ background: `hsl(${deal.imageHue}, 55%, 45%)` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {isRE
              ? <TrendingUp size={14} className="text-blue-400 shrink-0" />
              : <Package    size={14} className="text-amber-400 shrink-0" />
            }
            <span className="text-[11px] font-medium uppercase tracking-widest text-white/40">
              {isRE ? 'Nekretnina' : 'Materijal'}
            </span>
          </div>
          <span className={clsx(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
            deal.status === 'active'  ? 'bg-green-500/15 text-green-400' :
            deal.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                                        'bg-white/10 text-white/40',
          )}>
            {STATUS_LABEL[deal.status]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-zeus-white leading-tight mb-1">
          {deal.title}
        </h3>
        <p className="text-[12px] text-white/40 flex items-center gap-1 mb-3">
          <MapPin size={11} /> {deal.location}
        </p>

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[22px] font-bold text-zeus-white leading-none">
              {deal.price.toLocaleString('hr-HR')} €
            </p>
            {isRE && deal.sqm && (
              <p className="text-[11px] text-white/40 mt-0.5">
                {deal.sqm} m² · {Math.round(deal.price / deal.sqm).toLocaleString('hr-HR')} €/m²
              </p>
            )}
            {!isRE && deal.category && (
              <p className="text-[11px] text-white/40 mt-0.5">{deal.category}</p>
            )}
          </div>

          {/* Commission badge */}
          <div className="text-right">
            <p className="text-[10px] text-white/30 mb-0.5">ZEUS provizija ({commRate})</p>
            <p className="text-[13px] font-mono font-semibold text-zeus-red">
              {commission.toLocaleString('hr-HR', { maximumFractionDigits: 0 })} €
            </p>
          </div>
        </div>

        {/* Seller */}
        <div className="mt-3 pt-3 border-t border-white/6 flex items-center justify-between">
          <p className="text-[11px] text-white/35">
            Prodavač: <span className="text-white/60">{deal.seller}</span>
          </p>
          {highlighted && <RedDot size="sm" pulse />}
        </div>
      </div>
    </div>
  );
}
