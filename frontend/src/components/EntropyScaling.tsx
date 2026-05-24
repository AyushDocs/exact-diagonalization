'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScalingPoint } from '@/lib/data';

interface Props {
  data: ScalingPoint[];
}

export default function EntropyScaling({ data }: Props) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Finite-Size Scaling</h3>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4d56" />
          <XAxis
            dataKey="Delta"
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            height={45}
            label={{ value: 'Δ (anisotropy)', position: 'insideBottom', offset: 0, fill: '#8a8d96' }}
          />
          <YAxis
            tick={{ fill: '#8a8d96', fontSize: 12 }}
            label={{ value: 'Entanglement Entropy S', angle: -90, position: 'insideLeft', fill: '#8a8d96' }}
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
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 11, color: '#8a8d96', paddingBottom: '10px' }}
          />
          <Line type="monotone" dataKey="S_N8" name="N = 8" stroke="#3185fc" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="S_N10" name="N = 10" stroke="#e84855" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="S_N12" name="N = 12" stroke="#f9dc5c" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-white/50 text-center">
        Hilbert space dimensions: dim(N=8) = 70, dim(N=10) = 252, dim(N=12) = 924 (Sz=0 sector).
        The entropy peak sharpens as N increases.
      </div>
    </div>
  );
}
