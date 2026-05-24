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
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Quantum Phase Transition</h3>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4d56" />
          <XAxis
            dataKey="Delta"
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            height={45}
            label={{ value: 'Δ (anisotropy)', position: 'insideBottom', offset: 0, fill: '#8a8d96' }}
          />
          <YAxis
            yAxisId="entropy"
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            label={{ value: 'Entanglement Entropy S', angle: -90, position: 'insideLeft', fill: '#3185fc' }}
            stroke="#3185fc"
          />
          <YAxis
            yAxisId="gap"
            orientation="right"
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            label={{ value: 'Energy Gap ΔE', angle: 90, position: 'insideRight', fill: '#e84855' }}
            stroke="#e84855"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2a2d36',
              border: '1px solid #4a4d56',
              borderRadius: '8px',
              color: '#efbcd5',
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
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 11, color: '#8a8d96', paddingBottom: '10px' }}
          />
          <Line
            yAxisId="entropy"
            type="monotone"
            dataKey="entropy"
            name="Entropy"
            stroke="#3185fc"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            yAxisId="gap"
            type="monotone"
            dataKey="gap"
            name="Gap"
            stroke="#e84855"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-white/5 rounded-lg p-3 border-l-2 border-azure-blue">
          <div className="text-azure-blue font-semibold mb-1">XY Phase (Δ &lt; 1)</div>
          <div className="text-white/60 text-xs">Gapless, quasi-long-range order. Entropy is finite.</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border-l-2 border-royal-gold">
          <div className="text-royal-gold font-semibold mb-1">Critical Point (Δ = 1)</div>
          <div className="text-white/60 text-xs">XXX point — SU(2) symmetric. Entropy peaks here.</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 border-l-2 border-watermelon">
          <div className="text-watermelon font-semibold mb-1">Ising Phase (Δ &gt; 1)</div>
          <div className="text-white/60 text-xs">Gapped, Néel ordered. Entropy decreases.</div>
        </div>
      </div>
    </div>
  );
}
