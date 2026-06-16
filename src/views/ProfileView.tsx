'use client';
import { MOCK_USER, MOCK_DEALS, getReputationTier, calcCommission } from '@/lib/mockData';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import clsx from 'clsx';
import { Shield, Star, TrendingUp, Award, Clock } from 'lucide-react';

export default function ProfileView() {
  const tier       = getReputationTier(MOCK_USER.reputationScore);
  const userDeals  = MOCK_DEALS.slice(0, 3);
  const totalSpent = userDeals.filter(d => d.type === 'real_estate').reduce((a, d) => a + d.price, 0);
  const scorePercent = Math.min((MOCK_USER.reputationScore / 1000) * 100, 100);

  return (
    <PageShell className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 flex flex-col gap-5">

        {/* Hero card */}
        <div className="relative bg-zeus-black border border-white/8 rounded-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-zeus-red via-red-400 to-zeus-red" />
          <div className="p-6">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl font-bold text-zeus-white border border-white/10">
                  {MOCK_USER.avatarInitials}
                </div>
                <RedDot size="sm" className="absolute -top-1 -right-1" label="Online" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-zeus-white">{MOCK_USER.name}</h1>
                  <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/8 border border-white/10', tier.color)}>
                    {tier.label}
                  </span>
                </div>
                <p className="text-[12px] text-white/40 mt-0.5">{MOCK_USER.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-white/40 bg-white/5 px-2 py-1 rounded-lg border border-white/8">
                    {MOCK_USER.role}
                  </span>
                  <span className="text-[11px] text-white/30">ID: {MOCK_USER.id}</span>
                </div>
              </div>
            </div>

            {/* Reputation score */}
            <div className="mt-5">
              <div className="flex items-end justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star size={13} className="text-yellow-400" />
                  <span className="text-[11px] text-white/50 uppercase tracking-wider">Reputation Score</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-zeus-white">{MOCK_USER.reputationScore}</span>
                  <span className="text-[11px] text-white/30 ml-1">/ 1000</span>
                </div>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-zeus-red to-red-400 rounded-full"
                  style={{
                    width: `${scorePercent}%`,
                    transition: 'width 800ms cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                {['Starter', 'Active', 'Verified', 'Elite'].map((t, i) => (
                  <span key={t} className={clsx('text-[9px] uppercase tracking-wider', i * 250 <= MOCK_USER.reputationScore ? 'text-white/50' : 'text-white/20')}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefit tiles */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Shield size={16} className="text-blue-400" />,  label: 'Naknada popust', value: tier.discount },
            { icon: <Award  size={16} className="text-yellow-400" />, label: 'Tier',            value: tier.label   },
            { icon: <TrendingUp size={16} className="text-green-400" />, label: 'Moduli završeni', value: `${MOCK_USER.completedModules.length}/2` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-zeus-black border border-white/8 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {icon}
                <p className="text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-[16px] font-bold text-zeus-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Commission preview */}
        <div className="bg-zeus-black border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zeus-white">Transakcijska naknada</h2>
            <span className={clsx('text-[11px] font-semibold', tier.color)}>{tier.discount}</span>
          </div>
          <div className="space-y-3">
            {[
              { type: 'Nekretnine', rate: '1.5%', discount: tier.label === 'Elite' ? '1.2%' : tier.label === 'Verified' ? '1.35%' : '1.5%', color: 'text-blue-400' },
              { type: 'Materijali', rate: '0.5%', discount: tier.label === 'Elite' ? '0.4%'  : tier.label === 'Verified' ? '0.45%' : '0.5%',  color: 'text-amber-400' },
            ].map(({ type, rate, discount, color }) => (
              <div key={type} className="flex items-center justify-between bg-white/4 rounded-lg px-3 py-2.5">
                <div>
                  <p className="text-[12px] text-white/60">{type}</p>
                  <p className="text-[11px] text-white/30">Standardna: {rate}</p>
                </div>
                <div className="text-right">
                  <p className={clsx('text-[18px] font-bold font-mono', color)}>{discount}</p>
                  {discount !== rate && (
                    <p className="text-[10px] text-zeus-red">Tvoja cijena</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-zeus-black border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-zeus-white mb-3">Nedavna aktivnost</h2>
          <div className="space-y-2.5">
            {userDeals.map(deal => (
              <div key={deal.id} className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <Clock size={13} className="text-white/25 shrink-0" />
                  <div>
                    <p className="text-[12px] text-white/70">{deal.title}</p>
                    <p className="text-[10px] text-white/30">{deal.location}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-zeus-white">{deal.price.toLocaleString('hr-HR')} €</p>
                  <p className="text-[10px] text-zeus-red">{calcCommission(deal.price, deal.type).toLocaleString('hr-HR', {maximumFractionDigits:0})} € ZEUS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
