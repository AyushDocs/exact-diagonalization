'use client';

import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { PhasePoint } from '@/lib/data';

interface Props {
  data: PhasePoint[];
}

export default function PhaseTransition({ data }: Props) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Quantum Phase Transition</h3>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="Delta"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Δ (anisotropy)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis
            yAxisId="entropy"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Entanglement Entropy S', angle: -90, position: 'insideLeft', fill: '#06b6d4' }}
            stroke="#06b6d4"
          />
          <YAxis
            yAxisId="gap"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Energy Gap ΔE', angle: 90, position: 'insideRight', fill: '#ef4444' }}
            stroke="#ef4444"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const v = typeof value === 'number' ? value.toFixed(4) : String(value);
              const label = name === 'entropy' ? 'Entropy S' : 'Gap ΔE';
              return [v, label];
            }}
            labelFormatter={(label) => `Δ = ${Number(label).toFixed(2)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
          />
          <Line
            yAxisId="entropy"
            type="monotone"
            dataKey="entropy"
            name="Entropy"
            stroke="#06b6d4"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            yAxisId="gap"
            type="monotone"
            dataKey="gap"
            name="Gap"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-slate-700/40 rounded-lg p-3 border-l-2 border-cyan-500">
          <div className="text-cyan-400 font-medium mb-1">XY Phase (Δ &lt; 1)</div>
          <div className="text-slate-400 text-xs">Gapless, quasi-long-range order. Entropy is finite.</div>
        </div>
        <div className="bg-slate-700/40 rounded-lg p-3 border-l-2 border-yellow-500">
          <div className="text-yellow-400 font-medium mb-1">Critical Point (Δ = 1)</div>
          <div className="text-slate-400 text-xs">XXX point — SU(2) symmetric. Entropy peaks here.</div>
        </div>
        <div className="bg-slate-700/40 rounded-lg p-3 border-l-2 border-red-500">
          <div className="text-red-400 font-medium mb-1">Ising Phase (Δ &gt; 1)</div>
          <div className="text-slate-400 text-xs">Gapped, Néel ordered. Entropy decreases.</div>
        </div>
      </div>
    </div>
  );
}
