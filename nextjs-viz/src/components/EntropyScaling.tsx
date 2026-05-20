'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScalingPoint } from '@/lib/data';

interface Props {
  data: ScalingPoint[];
}

export default function EntropyScaling({ data }: Props) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Finite-Size Scaling</h3>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="Delta"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Δ (anisotropy)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            label={{ value: 'Entanglement Entropy S', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
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
              return [v, String(name)];
            }}
            labelFormatter={(label) => `Δ = ${Number(label).toFixed(2)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
          />
          <Line type="monotone" dataKey="S_N8" name="N = 8" stroke="#06b6d4" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="S_N10" name="N = 10" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="S_N12" name="N = 12" stroke="#eab308" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-slate-500 text-center">
        Hilbert space dimensions: dim(N=8) = 70, dim(N=10) = 252, dim(N=12) = 924 (Sz=0 sector).
        The entropy peak sharpens as N increases.
      </div>
    </div>
  );
}
