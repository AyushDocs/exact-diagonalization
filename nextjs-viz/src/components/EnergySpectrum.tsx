'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SpectrumPoint } from '@/lib/data';

interface Props {
  data: SpectrumPoint[];
}

const COLORS = ['#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444', '#a855f7'];

export default function EnergySpectrum({ data }: Props) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Energy Spectrum vs Anisotropy</h3>
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
            label={{ value: 'Energy', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
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
          {Array.from({ length: 6 }, (_, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={`energies[${i}]`}
              name={`E${i}`}
              stroke={COLORS[i]}
              strokeWidth={1.8}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500 mt-3 text-center">
        N = 10 spins, periodic boundary conditions, J = 1.0. The gap E₁ − E₀ closes near Δ = 1.
      </p>
    </div>
  );
}
