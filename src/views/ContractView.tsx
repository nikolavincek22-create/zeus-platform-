'use client';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import RedDot from '@/components/RedDot';
import { MOCK_DEALS, calcCommission, getCommissionRate } from '@/lib/mockData';
import clsx from 'clsx';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';

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
  contractType:          'real_estate',
  dealId:                '',
  buyerName:             '',
  buyerOIB:              '',
  sellerName:            '',
  sellerOIB:             '',
  price:                 '',
  currency:              'EUR',
  deadline:              '',
  paymentTerms:          '30 dana od potpisa',
  clauses:               '',
  penaltyRate:           '0.05',
  notarizationRequired:  true,
  arbitration:           false,
};

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-white/50 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-zeus-red">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-white/25 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full bg-zeus-black border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-zeus-white placeholder-white/20 focus:outline-none focus:border-zeus-red/50 transition-colors duration-200';
const toggleCls = (on: boolean) => clsx(
  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
  on ? 'bg-zeus-red' : 'bg-white/10',
);

export default function ContractView() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const set = (k: keyof FormState, v: any) => setForm(p => ({ ...p, [k]: v }));
  const price = parseFloat(form.price) || 0;
  const commission = price * (form.contractType === 'real_estate' ? 0.015 : 0.005);
  const commRate   = form.contractType === 'real_estate' ? '1.5%' : '0.5%';

  const dealOptions = MOCK_DEALS.filter(d => d.type === form.contractType);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1400));
    setGenerating(false);
    setSubmitted(true);
  };

  return (
    <PageShell className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-zeus-white">Smart Ugovor</h1>
            <p className="text-[12px] text-white/40 mt-0.5">Ispuni parametre — generiramo PDF ugovor</p>
          </div>
          <RedDot size="md" pulse label="Kreator ugovora" />
        </div>

        {/* Contract type */}
        <div className="flex gap-3">
          {(['real_estate', 'material'] as const).map(t => (
            <button
              key={t}
              onClick={() => set('contractType', t)}
              className={clsx(
                'flex-1 py-3 rounded-xl text-sm font-semibold border transition-all duration-200',
                form.contractType === t
                  ? 'bg-zeus-red/10 border-zeus-red/50 text-zeus-red'
                  : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8',
              )}
              style={{ transform: form.contractType === t ? 'scale(1.02)' : 'scale(1)' }}
            >
              {t === 'real_estate' ? 'Ugovor o kupoprodaji nekretnine' : 'Ugovor o isporuci materijala'}
            </button>
          ))}
        </div>

        {/* Main form */}
        <div className="bg-zeus-black border border-white/8 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full text-[12px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/6 pb-2">
            Stranke
          </h2>

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

          <h2 className="col-span-full text-[12px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/6 pb-2 mt-2">
            Financijski uvjeti
          </h2>

          <Field label="Odaberi deal (opcionalno)">
            <select
              className={clsx(inputCls, 'appearance-none')}
              value={form.dealId}
              onChange={e => {
                const d = MOCK_DEALS.find(x => x.id === e.target.value);
                set('dealId', e.target.value);
                if (d) set('price', String(d.price));
              }}
            >
              <option value="">— Unesi ručno —</option>
              {dealOptions.map(d => (
                <option key={d.id} value={d.id}>{d.title} ({d.price.toLocaleString('hr-HR')} €)</option>
              ))}
            </select>
          </Field>

          <Field label="Valuta">
            <select className={clsx(inputCls, 'appearance-none')} value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option>EUR</option>
              <option>HRK</option>
            </select>
          </Field>

          <Field label="Cijena" required hint="Upiši bez točke, npr. 285000">
            <input className={inputCls} type="number" placeholder="285000" value={form.price} onChange={e => set('price', e.target.value)} />
          </Field>

          <Field label="Rok isplate / isporuke" required>
            <input className={inputCls} type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </Field>

          <Field label="Uvjeti plaćanja" required>
            <input className={inputCls} value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} />
          </Field>

          <Field label="Stopa kazne (% dnevno)" hint="Uobičajeno 0.05%">
            <input className={inputCls} type="number" step="0.01" value={form.penaltyRate} onChange={e => set('penaltyRate', e.target.value)} />
          </Field>

          <h2 className="col-span-full text-[12px] font-semibold text-white/50 uppercase tracking-wider border-b border-white/6 pb-2 mt-2">
            Posebne klauzule
          </h2>

          <Field label="Dodatne klauzule" className="col-span-full">
            <textarea
              className={clsx(inputCls, 'resize-none h-24')}
              placeholder="Upiši specifične uvjete, ograničenja, garancije..."
              value={form.clauses}
              onChange={e => set('clauses', e.target.value)}
            />
          </Field>

          <Field label="Ovjera javnog bilježnika">
            <button
              onClick={() => set('notarizationRequired', !form.notarizationRequired)}
              className="flex items-center gap-3"
            >
              <span className={toggleCls(form.notarizationRequired)}>
                <span className={clsx('inline-block h-3 w-3 rounded-full bg-white transition-transform duration-200', form.notarizationRequired ? 'translate-x-5' : 'translate-x-1')} />
              </span>
              <span className="text-[12px] text-white/60">{form.notarizationRequired ? 'Da' : 'Ne'}</span>
            </button>
          </Field>

          <Field label="Arbitražna klauzula">
            <button
              onClick={() => set('arbitration', !form.arbitration)}
              className="flex items-center gap-3"
            >
              <span className={toggleCls(form.arbitration)}>
                <span className={clsx('inline-block h-3 w-3 rounded-full bg-white transition-transform duration-200', form.arbitration ? 'translate-x-5' : 'translate-x-1')} />
              </span>
              <span className="text-[12px] text-white/60">{form.arbitration ? 'Uključena' : 'Isključena'}</span>
            </button>
          </Field>
        </div>

        {/* Commission preview — live */}
        {price > 0 && (
          <div className="bg-zeus-red/8 border border-zeus-red/25 rounded-2xl p-4 flex items-center justify-between" style={{ animation: 'fadeIn 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
            <div>
              <p className="text-[11px] text-zeus-red/70 uppercase tracking-wider">Automatski izračun — ZEUS provizija ({commRate})</p>
              <p className="text-2xl font-bold font-mono text-zeus-red mt-0.5">
                {commission.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {form.currency}
              </p>
            </div>
            <RedDot size="lg" pulse />
          </div>
        )}

        {/* Generate button */}
        {!submitted ? (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={clsx(
              'w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-200',
              generating ? 'bg-zeus-red/50 cursor-not-allowed' : 'bg-zeus-red hover:bg-red-600',
            )}
            style={{ transform: generating ? 'scale(1)' : undefined }}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generiranje PDF-a...
              </>
            ) : (
              <>
                <FileText size={16} />
                Generiraj ugovor (PDF)
              </>
            )}
          </button>
        ) : (
          <div className="bg-green-500/8 border border-green-500/25 rounded-2xl p-5 flex flex-col items-center gap-3" style={{ animation: 'slideUp 0.28s cubic-bezier(0.4,0,0.2,1)' }}>
            <CheckCircle size={28} className="text-green-400" />
            <div className="text-center">
              <p className="text-sm font-semibold text-zeus-white">Ugovor generiran</p>
              <p className="text-[11px] text-white/40 mt-0.5">Pregled i potpisivanje dostupni za stranke</p>
            </div>
            <div className="flex gap-3 w-full">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/6 hover:bg-white/10 border border-white/10 rounded-xl text-[13px] font-semibold text-white/70 transition-colors duration-200">
                <Download size={14} /> Preuzmi PDF
              </button>
              <button
                onClick={() => { setForm(INITIAL); setSubmitted(false); }}
                className="flex-1 py-2.5 bg-zeus-red/10 hover:bg-zeus-red/20 border border-zeus-red/25 rounded-xl text-[13px] font-semibold text-zeus-red transition-colors duration-200"
              >
                Novi ugovor
              </button>
            </div>
          </div>
        )}

        {/* Legal note */}
        <div className="flex gap-2 text-[10px] text-white/25">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          Generirani dokument je predložak za reviziju ovlaštenog pravnika. ZEUS ne jamči pravnu valjanost bez stručne provjere.
        </div>
      </div>
    </PageShell>
  );
}
