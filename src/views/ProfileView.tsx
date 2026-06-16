'use client';
import { MOCK_USER, MOCK_DEALS, getReputationTier, calcCommission } from '@/lib/mockData';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import clsx from 'clsx';
import { Shield, Star, TrendingUp, Award, Clock, CheckCircle, Zap } from 'lucide-react';

export default function ProfileView() {
  const tier         = getReputationTier(MOCK_USER.reputationScore);
  const userDeals    = MOCK_DEALS.slice(0, 4);
  const scorePct     = Math.min((MOCK_USER.reputationScore / 1000) * 100, 100);
  const nextTierAt   = MOCK_USER.reputationScore >= 800 ? 1000 : MOCK_USER.reputationScore >= 600 ? 800 : MOCK_USER.reputationScore >= 400 ? 600 : 400;
  const pointsToNext = nextTierAt - MOCK_USER.reputationScore;

  return (
    <PageShell className="h-full min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 flex flex-col gap-5">

        {/* Hero card */}
        <div className="relative bg-gradient-to-br from-zeus-black via-[#101010] to-zeus-black border border-white/8 rounded-2xl overflow-hidden">
          {/* Top gradient accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-zeus-red via-yellow-400 to-zeus-red" />
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-zeus-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-6">
            <div className="flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zeus-red/40 via-white/10 to-white/5 flex items-center justify-center text-2xl font-bold text-zeus-white border border-white/15 shadow-xl">
                  {MOCK_USER.avatarInitials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-zeus-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-zeus-white">{MOCK_USER.name}</h1>
                  <span className={clsx('text-[11px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-1', tier.color)}>
                    <Award size={10} />{tier.label}
                  </span>
                </div>
                <p className="text-[12px] text-white/40 mt-1">{MOCK_USER.email}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-[11px] text-white/60 bg-white/6 px-2.5 py-1 rounded-lg border border-white/10">
                    {MOCK_USER.role}
                  </span>
                  <span className="text-[11px] text-white/40 font-mono">ID: {MOCK_USER.id}</span>
                  <span className="text-[11px] text-white/40">· Član od {new Date(MOCK_USER.joinedDate).toLocaleDateString('hr-HR')}</span>
                </div>
              </div>

              {/* Reputation score panel */}
              <div className="bg-white/4 border border-white/10 rounded-xl p-4 min-w-[180px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star size={11} className="text-yellow-400" />
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">Reputation</span>
                </div>
                <p className="text-3xl font-bold text-zeus-white tabular leading-none">{MOCK_USER.reputationScore}</p>
                <p className="text-[10px] text-white/35 mt-1">/ 1000 bodova</p>
              </div>
            </div>

            {/* Reputation progress */}
            <div className="mt-5">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Napredak prema sljedećem tieru</span>
                {pointsToNext > 0 && <span className="text-[11px] text-zeus-red tabular">+{pointsToNext} bodova</span>}
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-zeus-red via-yellow-400 to-zeus-red rounded-full relative"
                  style={{ width: `${scorePct}%`, transition: 'width 800ms cubic-bezier(0.4,0,0.2,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
                </div>
              </div>
              <div className="flex justify-between mt-2 tabular">
                {[
                  { label: 'Starter',  at: 0   },
                  { label: 'Active',   at: 400 },
                  { label: 'Verified', at: 600 },
                  { label: 'Elite',    at: 800 },
                ].map(t => (
                  <span key={t.label} className={clsx('text-[9px] uppercase tracking-wider', t.at <= MOCK_USER.reputationScore ? 'text-white/60' : 'text-white/20')}>
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefit tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: <Shield     size={14} className="text-blue-400"   />, label: 'Naknada popust', value: tier.discount },
            { icon: <Award      size={14} className="text-yellow-400" />, label: 'Tier',           value: tier.label    },
            { icon: <TrendingUp size={14} className="text-green-400"  />, label: 'Moduli',         value: `${MOCK_USER.completedModules.length}/2` },
            { icon: <Zap        size={14} className="text-zeus-red"   />, label: 'Aktivni dealovi',value: '3'           },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-zeus-black border border-white/8 rounded-xl p-3.5 flex flex-col gap-2 hover:border-white/16 transition-colors duration-200">
              <div className="flex items-center gap-2">
                {icon}
                <p className="text-[10px] text-white/35 uppercase tracking-wider truncate">{label}</p>
              </div>
              <p className="text-[16px] font-bold text-zeus-white truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Commission preview */}
        <div className="bg-zeus-black border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-zeus-white">Transakcijska naknada</h2>
              <p className="text-[11px] text-white/40 mt-0.5">Stopa popusta ovisi o tvom Reputation Tieru</p>
            </div>
            <span className={clsx('text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/8 border border-white/15', tier.color)}>
              {tier.discount}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { type: 'Nekretnine', rate: '1.5%', discount: tier.label === 'Elite' ? '1.2%' : tier.label === 'Verified' ? '1.35%' : tier.label === 'Active' ? '1.43%' : '1.5%', color: 'text-blue-400' },
              { type: 'Materijali', rate: '0.5%', discount: tier.label === 'Elite' ? '0.4%' : tier.label === 'Verified' ? '0.45%' : tier.label === 'Active' ? '0.48%' : '0.5%', color: 'text-amber-400' },
            ].map(({ type, rate, discount, color }) => (
              <div key={type} className="flex items-center justify-between bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                <div>
                  <p className="text-[13px] text-white/70 font-semibold">{type}</p>
                  <p className="text-[10px] text-white/35 line-through">{rate}</p>
                </div>
                <div className="text-right">
                  <p className={clsx('text-[20px] font-bold font-mono tabular', color)}>{discount}</p>
                  {discount !== rate && (
                    <p className="text-[9px] text-zeus-red uppercase tracking-wider">Tvoja cijena</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-zeus-black border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-zeus-white mb-3">Nedavna aktivnost</h2>
          <div className="space-y-1">
            {userDeals.map(deal => (
              <div key={deal.id} className="flex items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 -mx-2 px-2 rounded-lg transition-colors duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `hsl(${deal.imageHue}, 45%, 25%)` }}>
                    <Clock size={13} className="text-white/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-white/80 truncate">{deal.title}</p>
                    <p className="text-[10px] text-white/35">{deal.location} · {deal.type === 'real_estate' ? 'Nekretnina' : 'Materijal'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-zeus-white tabular">{deal.price.toLocaleString('hr-HR')} €</p>
                  <p className="text-[10px] text-zeus-red tabular">+{calcCommission(deal.price, deal.type).toLocaleString('hr-HR', { maximumFractionDigits: 0 })} € ZEUS</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-zeus-red/8 to-transparent border border-zeus-red/20 rounded-2xl p-5 flex items-center gap-4 flex-wrap">
          <RedDot size="lg" pulse />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-zeus-white">Završi Modul B i otključaj Verified tier</p>
            <p className="text-[11px] text-white/45 mt-1">
              Trebaš još <span className="text-zeus-red font-semibold">+{pointsToNext} bodova</span> za sljedeći tier. Modul B donosi +50 Reputation bodova i niže naknade.
            </p>
          </div>
          <button className="bg-zeus-red hover:bg-red-600 text-white text-[12px] font-semibold rounded-lg px-4 py-2 transition-colors duration-200 active:scale-95">
            Završi modul
          </button>
        </div>
      </div>
    </PageShell>
  );
}
