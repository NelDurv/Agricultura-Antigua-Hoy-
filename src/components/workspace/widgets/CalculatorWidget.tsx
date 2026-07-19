import React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import type { Widget } from '../../../core/engine';

export default function CalculatorWidget({ widget }: { widget: Widget }) {
  const [carbon, setCarbon] = React.useState('');
  const [nitrogen, setNitrogen] = React.useState('');
  const [result, setResult] = React.useState<{ ratio: number; verdict: string } | null>(null);

  const handleCalculate = () => {
    const c = parseFloat(carbon);
    const n = parseFloat(nitrogen);
    if (isNaN(c) || isNaN(n) || n === 0) return;
    const ratio = c / n;
    let verdict: string;
    if (ratio < 20) verdict = '🔵 Bajo en C — riesgo de pérdida de N';
    else if (ratio <= 35) verdict = '🟢 Rango óptimo para compostaje';
    else verdict = '🟡 Alto en C — descomposición lenta';
    setResult({ ratio: Math.round(ratio * 10) / 10, verdict });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <Calculator className="h-3 w-3 text-emerald-600" />
        <span className="text-[9px] font-bold font-mono text-stone-700 uppercase tracking-wider">Calculadora C/N</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="space-y-1.5">
          <div>
            <label className="block text-[8px] font-mono text-stone-500 mb-0.5">Carbono (C)</label>
            <input
              type="number"
              value={carbon}
              onChange={e => setCarbon(e.target.value)}
              placeholder="Ej: 30"
              className="w-full px-2 py-1 text-[10px] border border-stone-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-[8px] font-mono text-stone-500 mb-0.5">Nitrógeno (N)</label>
            <input
              type="number"
              value={nitrogen}
              onChange={e => setNitrogen(e.target.value)}
              placeholder="Ej: 1"
              className="w-full px-2 py-1 text-[10px] border border-stone-200 rounded-lg focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 outline-none"
            />
          </div>
          <button
            onClick={handleCalculate}
            disabled={!carbon || !nitrogen}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white text-[9px] font-semibold rounded-lg transition-colors"
          >
            Calcular relación C/N
          </button>
        </div>

        {result && (
          <div className="p-2 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-stone-500">Relación C/N</span>
              <span className="text-sm font-bold font-mono text-emerald-700">{result.ratio}:1</span>
            </div>
            <p className="text-[9px] text-stone-600">{result.verdict}</p>
            <button
              onClick={() => { setResult(null); setCarbon(''); setNitrogen(''); }}
              className="text-[8px] font-mono text-stone-400 hover:text-stone-600 inline-flex items-center gap-1"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Limpiar
            </button>
          </div>
        )}

        <p className="text-[7px] text-stone-400 font-mono text-center">
          Rango óptimo compostaje: 20:1 a 35:1
        </p>
      </div>
    </div>
  );
}
