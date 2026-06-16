'use client';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import { MOCK_DEALS } from '@/lib/mockData';
import clsx from 'clsx';
import { FileText, Download, CheckCircle, AlertCircle, FileSignature, Loader2 } from 'lucide-react';

interface FormState {
  contractType: 'real_estate' | 'material';
  dealId: string;
  buyerName: string;
  buyerOIB: string;
  sellerName: string;
  sellerOIB: string;
  price: string;
  currency: 'EUR' | 'HRK';
  deadline: string;
  paymentTerms: string;
  clauses: string;
  penaltyRate: string;
  notarizationRequired: boolean;
  arbitration: boolean;
}

const INITIAL: FormState = {
  contractType:         'real_estate',
  dealId:               '',
  buyerName:            'Marko Horvat',
  buyerOIB:             '12345678901',
  sellerName:           '',
  sellerOIB:            '',
  price:                '',
  currency:             'EUR',
  deadline:             '',
  paymentTerms:         '30 dana od potpisa',
  clauses:              '',
  penaltyRate:          '0.05',
  notarizationRequired: true,
  arbitration:          false,
};

function Field({ label, required, children, hint, className }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
        {label} {required && <span className="text-zeus-red">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-white/30 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-zeus-white placeholder-white/25 focus:outline-none focus:border-zeus-red/50 transition-colors duration-200';

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-3">
    <span className={clsx('relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200', on ? 'bg-zeus-red' : 'bg-white/12')}>
      <span className={clsx('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200', on ? 'translate-x-5' : 'translate-x-1')} />
    </span>
    <span className="text-[12px] text-white/65">{on ? 'Da' : 'Ne'}</span>
  </button>
);

export default function ContractView() {
  const [form, setForm]         = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const set = (k: keyof FormState, v: any) => setForm(p => ({ ...p, [k]: v }));
  const price = parseFloat(form.price) || 0;
  const commission = price * (form.contractType === 'real_estate' ? 0.015 : 0.005);
  const commRate   = form.contractType === 'real_estate' ? '1.5%' : '0.5%';
  const dealOptions = MOCK_DEALS.filter(d => d.type === form.contractType);
  const today = new Date().toLocaleDateString('hr-HR');

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1400));
    setGenerating(false);
    setSubmitted(true);
  };

  return (
    <PageShell className="h-full min-h-0 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* LEFT: Form */}
        <div className="lg:col-span-3 flex flex-col gap-5 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-zeus-white">Smart Ugovor</h1>
                <RedDot size="md" pulse label="Kreator ugovora" />
              </div>
              <p className="text-[13px] text-white/45 mt-1">Ispuni parametre — generiramo PDF spreman za ovjeru</p>
            </div>
          </div>

          {/* Contract type */}
          <div className="grid grid-cols-2 gap-3">
            {(['real_estate', 'material'] as const).map(t => (
              <button
                key={t}
                onClick={() => set('contractType', t)}
                className={clsx(
                  'py-3 px-4 rounded-xl text-[13px] font-semibold border transition-all duration-200 text-left',
                  form.contractType === t
                    ? 'bg-zeus-red/10 border-zeus-red/50 text-zeus-white shadow-lg shadow-zeus-red/10'
                    : 'bg-white/4 border-white/8 text-white/55 hover:bg-white/8',
                )}
                style={{ transform: form.contractType === t ? 'scale(1.01)' : undefined }}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">
                  {form.contractType === t ? 'ODABRANO' : 'Tip ugovora'}
                </p>
                {t === 'real_estate' ? 'Kupoprodaja nekretnine' : 'Isporuka materijala'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="bg-zeus-black border border-white/8 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <h2 className="col-span-full text-[11px] font-bold text-white/60 uppercase tracking-wider border-b border-white/8 pb-2">Stranke</h2>

            <Field label="Ime kupca" required>
              <input className={inputCls} placeholder="npr. Marko Horvat" value={form.buyerName} onChange={e => set('buyerName', e.target.value)} />
            </Field>
            <Field label="OIB kupca" required>
              <input className={inputCls} placeholder="11 znamenki" maxLength={11} value={form.buyerOIB} onChange={e => set('buyerOIB', e.target.value)} />
            </Field>
            <Field label="Ime prodavača" required>
              <input className={inputCls} placeholder="npr. Ana Kovač" value={form.sellerName} onChange={e => set('sellerName', e.target.value)} />
            </Field>
            <Field label="OIB prodavača" required>
              <input className={inputCls} placeholder="11 znamenki" maxLength={11} value={form.sellerOIB} onChange={e => set('sellerOIB', e.target.value)} />
            </Field>

            <h2 className="col-span-full text-[11px] font-bold text-white/60 uppercase tracking-wider border-b border-white/8 pb-2 mt-2">Financijski uvjeti</h2>

            <Field label="Odaberi postojeći deal" className="col-span-full">
              <select
                className={clsx(inputCls, 'appearance-none cursor-pointer')}
                value={form.dealId}
                onChange={e => {
                  const d = MOCK_DEALS.find(x => x.id === e.target.value);
                  set('dealId', e.target.value);
                  if (d) { set('price', String(d.price)); set('sellerName', d.seller); }
                }}
              >
                <option value="">— Unesi ručno —</option>
                {dealOptions.map(d => (
                  <option key={d.id} value={d.id}>{d.title} ({d.price.toLocaleString('hr-HR')} €)</option>
                ))}
              </select>
            </Field>

            <Field label="Cijena" required hint="Bez točaka, npr. 285000">
              <input className={inputCls} type="number" placeholder="0" value={form.price} onChange={e => set('price', e.target.value)} />
            </Field>

            <Field label="Valuta">
              <select className={clsx(inputCls, 'appearance-none cursor-pointer')} value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option>EUR</option>
                <option>HRK</option>
              </select>
            </Field>

            <Field label="Rok isplate / isporuke" required>
              <input className={inputCls} type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </Field>

            <Field label="Stopa kazne (% dnevno)" hint="Uobičajeno 0.05%">
              <input className={inputCls} type="number" step="0.01" value={form.penaltyRate} onChange={e => set('penaltyRate', e.target.value)} />
            </Field>

            <Field label="Uvjeti plaćanja" className="col-span-full">
              <input className={inputCls} value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} />
            </Field>

            <h2 className="col-span-full text-[11px] font-bold text-white/60 uppercase tracking-wider border-b border-white/8 pb-2 mt-2">Posebne klauzule</h2>

            <Field label="Dodatne klauzule" className="col-span-full">
              <textarea
                className={clsx(inputCls, 'resize-none h-24')}
                placeholder="Upiši specifične uvjete, ograničenja, garancije..."
                value={form.clauses}
                onChange={e => set('clauses', e.target.value)}
              />
            </Field>

            <Field label="Ovjera javnog bilježnika">
              <Toggle on={form.notarizationRequired} onClick={() => set('notarizationRequired', !form.notarizationRequired)} />
            </Field>

            <Field label="Arbitražna klauzula">
              <Toggle on={form.arbitration} onClick={() => set('arbitration', !form.arbitration)} />
            </Field>
          </div>

          {/* Commission preview */}
          {price > 0 && (
            <div
              className="bg-gradient-to-r from-zeus-red/10 to-transparent border border-zeus-red/25 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap"
              style={{ animation: 'fadeIn 0.25s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <div className="min-w-0">
                <p className="text-[10px] text-zeus-red/70 uppercase tracking-wider">Automatski izračun</p>
                <p className="text-[12px] text-white/60 mt-0.5">ZEUS provizija ({commRate}) na ugovorenu cijenu</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono text-zeus-red tabular">
                  {commission.toLocaleString('hr-HR', { maximumFractionDigits: 2 })} {form.currency}
                </p>
              </div>
              <RedDot size="md" pulse />
            </div>
          )}

          {/* Generate button */}
          {!submitted ? (
            <button
              onClick={handleGenerate}
              disabled={generating || price <= 0}
              className={clsx(
                'w-full py-4 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all duration-200',
                generating || price <= 0
                  ? 'bg-zeus-red/40 cursor-not-allowed'
                  : 'bg-zeus-red hover:bg-red-600 active:scale-[0.99] shadow-lg shadow-zeus-red/20',
              )}
            >
              {generating ? (
                <><Loader2 size={16} className="animate-spin" /> Generiranje PDF-a...</>
              ) : (
                <><FileSignature size={16} /> Generiraj ugovor (PDF)</>
              )}
            </button>
          ) : (
            <div className="bg-green-500/8 border border-green-500/30 rounded-2xl p-5 flex flex-col items-center gap-3" style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-zeus-white">Ugovor generiran</p>
                <p className="text-[11px] text-white/45 mt-0.5">Pregled i potpisivanje dostupni za stranke</p>
              </div>
              <div className="flex gap-3 w-full">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/6 hover:bg-white/12 border border-white/10 rounded-xl text-[13px] font-semibold text-white/80 transition-colors duration-200">
                  <Download size={14} /> Preuzmi PDF
                </button>
                <button
                  onClick={() => { setForm(INITIAL); setSubmitted(false); }}
                  className="flex-1 py-3 bg-zeus-red/10 hover:bg-zeus-red/20 border border-zeus-red/30 rounded-xl text-[13px] font-semibold text-zeus-red transition-colors duration-200"
                >
                  Novi ugovor
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 text-[10px] text-white/30">
            <AlertCircle size={12} className="shrink-0 mt-0.5" />
            Generirani dokument je predložak za reviziju ovlaštenog pravnika. ZEUS ne jamči pravnu valjanost bez stručne provjere.
          </div>
        </div>

        {/* RIGHT: Live PDF preview */}
        <div className="lg:col-span-2 lg:sticky lg:top-0 lg:self-start">
          <div className="bg-zeus-black border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between bg-white/3">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-white/60" />
                <span className="text-[12px] font-semibold text-white/80">Pregled ugovora</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-white/35 font-mono">LIVE</span>
            </div>
            <div className="bg-zeus-surface text-zeus-black p-6 max-h-[600px] overflow-y-auto text-[11px] leading-relaxed">
              <p className="text-center font-bold text-[13px] tracking-wider uppercase">
                {form.contractType === 'real_estate' ? 'Ugovor o kupoprodaji nekretnine' : 'Ugovor o isporuci materijala'}
              </p>
              <p className="text-center text-[10px] text-zeus-black/60 mt-1">ZEUS Smart Contract · {today}</p>
              <hr className="my-4 border-zeus-black/20" />

              <p className="font-bold mb-1">1. STRANKE</p>
              <p>Kupac: <strong>{form.buyerName || '_______________'}</strong>, OIB <strong>{form.buyerOIB || '___________'}</strong></p>
              <p>Prodavač: <strong>{form.sellerName || '_______________'}</strong>, OIB <strong>{form.sellerOIB || '___________'}</strong></p>

              <p className="font-bold mb-1 mt-4">2. PREDMET UGOVORA</p>
              <p>
                Prodavač se obvezuje predati Kupcu {form.contractType === 'real_estate' ? 'nekretninu' : 'materijal'} u skladu s odredbama ovog ugovora, a Kupac se obvezuje isplatiti kupoprodajnu cijenu.
              </p>

              <p className="font-bold mb-1 mt-4">3. CIJENA I PLAĆANJE</p>
              <p>
                Ugovorena cijena iznosi <strong>{price > 0 ? price.toLocaleString('hr-HR') : '_______'} {form.currency}</strong>.
                Uvjeti plaćanja: {form.paymentTerms}.
                Rok izvršenja: <strong>{form.deadline || '__________'}</strong>.
              </p>

              <p className="font-bold mb-1 mt-4">4. PROVIZIJA ZEUS PLATFORME</p>
              <p>
                Provizija ZEUS platforme iznosi <strong>{commRate}</strong> ugovorene cijene, odnosno
                <strong> {commission.toLocaleString('hr-HR', { maximumFractionDigits: 2 })} {form.currency}</strong>.
              </p>

              <p className="font-bold mb-1 mt-4">5. KAZNENE ODREDBE</p>
              <p>
                U slučaju kašnjenja, zatezna kamata iznosi <strong>{form.penaltyRate}%</strong> dnevno na neisplaćeni iznos.
              </p>

              {form.clauses && (
                <>
                  <p className="font-bold mb-1 mt-4">6. POSEBNE KLAUZULE</p>
                  <p className="whitespace-pre-wrap">{form.clauses}</p>
                </>
              )}

              <p className="font-bold mb-1 mt-4">7. ZAVRŠNE ODREDBE</p>
              <p>
                Ovaj ugovor {form.notarizationRequired ? 'mora biti ovjeren kod javnog bilježnika' : 'ne zahtjeva ovjeru kod javnog bilježnika'}.
                {form.arbitration && ' Sporovi se rješavaju pred Stalnim arbitražnim sudištem HGK.'}
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-zeus-black/20">
                <div>
                  <p className="text-[10px] text-zeus-black/60 mb-8">Kupac</p>
                  <div className="border-b border-zeus-black/30" />
                  <p className="text-[10px] mt-1">{form.buyerName || '_______________'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zeus-black/60 mb-8">Prodavač</p>
                  <div className="border-b border-zeus-black/30" />
                  <p className="text-[10px] mt-1">{form.sellerName || '_______________'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
