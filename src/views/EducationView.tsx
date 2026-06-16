'use client';
import { useState } from 'react';
import { EDUCATION_MODULES, MOCK_USER } from '@/lib/mockData';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import clsx from 'clsx';
import { BookOpen, CheckCircle, Clock, ChevronRight, Zap, PlayCircle, Award } from 'lucide-react';

const PLANS = [
  {
    id: 'demo',
    label: 'Demo',
    price: 'Besplatno',
    sub: 'Bez pretplate',
    features: ['Modul A — prve 2 lekcije', 'Pregled cijelog sadržaja', 'Bez certifikata'],
    cta: 'Pokušaj besplatno',
    highlight: false,
  },
  {
    id: 'starter',
    label: 'Starter',
    price: '20€',
    sub: 'prvi mjesec',
    features: ['Puni pristup Modul A', 'Puni pristup Modul B', 'ZEUS certifikat', '+50 Reputation bodova', 'PDF materijali za preuzimanje'],
    cta: 'Pokreni Starter',
    highlight: true,
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '10€',
    sub: 'svaki sljedeći mjesec',
    features: ['Sve iz Startera', 'Novi moduli automatski', 'Prioritetna podrška', 'Ekskluzivni webinari'],
    cta: 'Pretplati se',
    highlight: false,
  },
] as const;

export default function EducationView() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'pricing'>('modules');

  return (
    <PageShell className="h-full min-h-0 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zeus-white">Edukacijski centar</h1>
              <RedDot size="md" pulse label="Edukacija" />
            </div>
            <p className="text-[13px] text-white/45 mt-1">
              Povećaj Reputation Score i smanji transakcijske naknade
            </p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/8 border border-yellow-400/25 rounded-xl px-4 py-2.5">
            <Zap size={14} className="text-yellow-400" />
            <div>
              <p className="text-[10px] text-yellow-400/80 uppercase tracking-wider">Tvoj score</p>
              <p className="text-[14px] font-bold text-yellow-400 tabular">{MOCK_USER.reputationScore} / 1000</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/4 border border-white/8 rounded-xl p-1 w-fit">
          {(['modules', 'pricing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-5 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200',
                activeTab === tab
                  ? 'bg-zeus-black text-zeus-white shadow-md'
                  : 'text-white/40 hover:text-white/80',
              )}
            >
              {tab === 'modules' ? 'Moduli' : 'Pretplata'}
            </button>
          ))}
        </div>

        {activeTab === 'modules' && (
          <div className="flex flex-col gap-4">
            {EDUCATION_MODULES.map(mod => {
              const done   = MOCK_USER.completedModules.includes(mod.code);
              const isOpen = expanded === mod.id;
              const isA    = mod.code === 'A';

              return (
                <div
                  key={mod.id}
                  className={clsx(
                    'bg-zeus-black border rounded-2xl overflow-hidden transition-all duration-200',
                    done ? 'border-green-500/30' : 'border-white/8',
                  )}
                >
                  <button
                    className="w-full p-5 flex items-center gap-4 text-left group hover:bg-white/3"
                    onClick={() => setExpanded(isOpen ? null : mod.id)}
                  >
                    <div className={clsx(
                      'w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border shrink-0',
                      isA ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                    )}>
                      {mod.code}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-[15px] font-semibold text-zeus-white">
                          Modul {mod.code}: {mod.title}
                        </h2>
                        {done
                          ? <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/25"><CheckCircle size={10} /> ZAVRŠENO</span>
                          : <RedDot size="sm" pulse className="shrink-0" />
                        }
                      </div>
                      <p className="text-[12px] text-white/45 mt-0.5">{mod.subtitle}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <BookOpen size={10} /> {mod.lessons} lekcija
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <Clock size={10} /> {mod.duration}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <Award size={10} /> +50 RP
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className={clsx('text-white/30 shrink-0 transition-transform duration-200', isOpen && 'rotate-90')}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className="px-5 pb-5 border-t border-white/6"
                      style={{ animation: 'slideUp 0.22s cubic-bezier(0.4,0,0.2,1)' }}
                    >
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mt-4 mb-3">Sadržaj modula</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mod.topics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-[12px] text-white/65 bg-white/3 rounded-lg px-3 py-2 border border-white/5">
                            <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', isA ? 'bg-blue-400' : 'bg-purple-400')} />
                            {topic}
                          </div>
                        ))}
                      </div>

                      {done ? (
                        <div className="mt-4 flex items-center gap-2 text-green-400 text-[12px] bg-green-500/8 border border-green-500/20 rounded-lg px-3 py-2">
                          <CheckCircle size={14} /> Modul završen · +50 Reputation bodova dodano u tvoj account
                        </div>
                      ) : (
                        <button className="mt-4 bg-zeus-red hover:bg-red-600 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 flex items-center gap-2 active:scale-95">
                          <PlayCircle size={15} /> Pokreni modul
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={clsx(
                  'relative bg-zeus-black border rounded-2xl p-5 flex flex-col transition-all duration-200',
                  plan.highlight
                    ? 'border-zeus-red/50 shadow-2xl shadow-zeus-red/10 md:scale-105'
                    : 'border-white/8 hover:border-white/20',
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-zeus-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Preporučeno
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-[11px] text-white/45 uppercase tracking-wider">{plan.label}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-4xl font-bold text-zeus-white tabular">{plan.price}</p>
                  </div>
                  <p className="text-[11px] text-white/40 mt-1">{plan.sub}</p>
                </div>

                <ul className="flex-1 space-y-2.5 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[12px] text-white/65">
                      <CheckCircle size={12} className="text-green-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={clsx(
                    'w-full text-sm font-semibold rounded-xl py-3 transition-all duration-200 active:scale-95',
                    plan.highlight
                      ? 'bg-zeus-red hover:bg-red-600 text-white shadow-lg shadow-zeus-red/20'
                      : 'bg-white/6 hover:bg-white/12 text-white/80 border border-white/10',
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA banner */}
        <div className="bg-gradient-to-r from-zeus-red/10 via-zeus-red/5 to-transparent border border-zeus-red/20 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <RedDot size="lg" pulse />
          <div className="flex-1 min-w-[200px]">
            <p className="text-[13px] font-semibold text-zeus-white">Edukacija = niže naknade</p>
            <p className="text-[11px] text-white/45 mt-0.5">
              Verified i Elite tier korisnici plaćaju do <span className="text-zeus-red font-semibold">20% manje</span> na svakoj transakciji.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
