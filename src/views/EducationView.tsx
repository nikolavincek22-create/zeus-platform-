'use client';
import { useState } from 'react';
import { EDUCATION_MODULES, MOCK_USER } from '@/lib/mockData';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import clsx from 'clsx';
import { BookOpen, CheckCircle, Lock, Clock, ChevronRight, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'demo',
    label: 'Demo',
    price: 'Besplatno',
    sub: null,
    features: ['Modul A – prva 2 lekcija', 'Pregled sadržaja', 'Bez certifikata'],
    cta: 'Pokušaj besplatno',
    highlight: false,
  },
  {
    id: 'starter',
    label: 'Starter',
    price: '20 €',
    sub: 'prvi mjesec',
    features: ['Puni pristup Modul A', 'Puni pristup Modul B', 'ZEUS certifikat', '+50 Reputation bodova', 'PDF materijali'],
    cta: 'Počni za 20 €',
    highlight: true,
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '10 €',
    sub: 'svaki sljedeći mj.',
    features: ['Sve iz Startera', 'Novi moduli automatski', 'Prioritetna podrška', 'Ekskluzivni webinari'],
    cta: 'Pretplati se',
    highlight: false,
  },
] as const;

export default function EducationView() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'pricing'>('modules');

  return (
    <PageShell className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-zeus-white">Edukacijski centar</h1>
            <p className="text-[12px] text-white/40 mt-0.5">
              Povećaj Reputation Score i smanji transakcijske naknade
            </p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-400/20 rounded-xl px-3 py-2">
            <Zap size={13} className="text-yellow-400" />
            <p className="text-[11px] font-semibold text-yellow-400">847 / 1000 pts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/4 rounded-xl p-1 w-fit">
          {(['modules', 'pricing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200',
                activeTab === tab ? 'bg-zeus-black text-zeus-white shadow-sm' : 'text-white/40 hover:text-white/70',
              )}
            >
              {tab === 'modules' ? 'Moduli' : 'Pretplata'}
            </button>
          ))}
        </div>

        {activeTab === 'modules' && (
          <>
            {EDUCATION_MODULES.map(mod => {
              const done    = MOCK_USER.completedModules.includes(mod.code);
              const isOpen  = expanded === mod.id;
              const isA     = mod.code === 'A';

              return (
                <div
                  key={mod.id}
                  className={clsx(
                    'bg-zeus-black border rounded-2xl overflow-hidden transition-all duration-200',
                    done ? 'border-green-500/30' : 'border-white/8',
                  )}
                >
                  <button
                    className="w-full p-5 flex items-center gap-4 text-left group"
                    onClick={() => setExpanded(isOpen ? null : mod.id)}
                    style={{ transition: 'background 200ms' }}
                  >
                    {/* Icon */}
                    <div className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border shrink-0',
                      isA ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                    )}>
                      {mod.code}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[15px] font-semibold text-zeus-white">
                          Modul {mod.code}: {mod.title}
                        </h2>
                        {done
                          ? <CheckCircle size={14} className="text-green-400 shrink-0" />
                          : <RedDot size="sm" pulse className="shrink-0" />
                        }
                      </div>
                      <p className="text-[12px] text-white/40 mt-0.5">{mod.subtitle}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-white/30">
                          <BookOpen size={10} /> {mod.lessons} lekcija
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/30">
                          <Clock size={10} /> {mod.duration}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className={clsx('text-white/25 shrink-0 transition-transform duration-200', isOpen && 'rotate-90')}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/6" style={{ animation: 'slideUp 0.22s cubic-bezier(0.4,0,0.2,1)' }}>
                      <p className="text-[11px] text-white/35 uppercase tracking-wider mt-4 mb-2">Sadržaj</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {mod.topics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 text-[12px] text-white/60">
                            <div className={clsx('w-1 h-1 rounded-full shrink-0', isA ? 'bg-blue-400' : 'bg-purple-400')} />
                            {topic}
                          </div>
                        ))}
                      </div>

                      {done ? (
                        <div className="mt-4 flex items-center gap-2 text-green-400 text-[12px]">
                          <CheckCircle size={14} /> Završeno · +50 Reputation bodova dodano
                        </div>
                      ) : (
                        <button className="mt-4 bg-zeus-red hover:bg-red-600 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors duration-200">
                          Počni modul
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={clsx(
                  'relative bg-zeus-black border rounded-2xl p-5 flex flex-col',
                  plan.highlight
                    ? 'border-zeus-red/50 shadow-lg shadow-zeus-red/10'
                    : 'border-white/8',
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-zeus-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Preporučeno
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-[11px] text-white/40 uppercase tracking-wider">{plan.label}</p>
                  <p className="text-3xl font-bold text-zeus-white mt-1">{plan.price}</p>
                  {plan.sub && <p className="text-[11px] text-white/35">{plan.sub}</p>}
                </div>

                <ul className="flex-1 space-y-2 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[12px] text-white/60">
                      <CheckCircle size={12} className="text-green-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={clsx(
                    'w-full text-sm font-semibold rounded-xl py-2.5 transition-all duration-200',
                    plan.highlight
                      ? 'bg-zeus-red hover:bg-red-600 text-white'
                      : 'bg-white/6 hover:bg-white/12 text-white/70 border border-white/10',
                  )}
                  style={{ ':hover': { transform: 'scale(1.02)' } } as any}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reputation benefit callout */}
        <div className="bg-gradient-to-r from-zeus-red/10 to-transparent border border-zeus-red/20 rounded-2xl p-4 flex items-center gap-4">
          <RedDot size="lg" pulse />
          <div>
            <p className="text-[13px] font-semibold text-zeus-white">Završi Modul B i uštedi na naknadama</p>
            <p className="text-[11px] text-white/40 mt-0.5">
              Korisnici koji završe oba modula ulaze u Verified tier i plaćaju −10% transakcijsku naknadu na svakoj transakciji.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
