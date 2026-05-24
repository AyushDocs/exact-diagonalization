'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SpectrumPoint } from '@/lib/data';

interface Props {
  data: SpectrumPoint[];
}

const COLORS = ['#3185fc', '#e84855', '#f9dc5c', '#efbcd5', '#3185fc', '#e84855'];

export default function EnergySpectrum({ data }: Props) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Energy Spectrum vs Anisotropy</h3>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4d56" />
          <XAxis
            dataKey="Delta"
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            label={{ value: 'Δ (anisotropy)', position: 'insideBottom', offset: -5, fill: '#8a8d96' }}
          />
          <YAxis
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            label={{ value: 'Energy', angle: -90, position: 'insideLeft', fill: '#8a8d96' }}
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
              return [v, String(name)];
            }}
            labelFormatter={(label) => `Δ = ${Number(label).toFixed(2)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#8a8d96' }}
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
      <p className="text-xs text-pastel-petal/50 mt-3 text-center">
        N = 10 spins, periodic boundary conditions, J = 1.0. The gap E₁ − E₀ closes near Δ = 1.
      </p>
    </div>
  );
}
