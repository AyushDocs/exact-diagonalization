'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { SpinSnapshot } from '@/lib/data';

interface Props {
  snapshots: SpinSnapshot[];
}

const COLORS = ['#3185fc', '#e84855', '#f9dc5c', '#efbcd5', '#3185fc'];
const SPIN_UP = '#3185fc';
const SPIN_DOWN = '#e84855';

export default function SpinChain({ snapshots }: Props) {
  const [snapIdx, setSnapIdx] = useState(2);
  const [configIdx, setConfigIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const snapshot = snapshots[snapIdx];
  const config = snapshot?.top_configs[configIdx];
  const N = config?.spins.length ?? 10;

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => !prev);
  }, []);

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        setSnapIdx((prev) => (prev + 1) % snapshots.length);
        setConfigIdx(0);
      }, 2000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, snapshots.length]);

  const siteWidth = 56;
  const arrowWidth = 32;
  const padding = 40;
  const totalWidth = N * siteWidth + padding * 2;
  const height = 200;

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white">Ground State Spin Configurations</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAutoPlay}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              autoPlay
                ? 'bg-watermelon/20 text-watermelon hover:bg-watermelon/30'
                : 'bg-azure-blue/20 text-azure-blue hover:bg-azure-blue/30'
            }`}
          >
            {autoPlay ? '⏹ Stop' : '▶ Auto-Play'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="text-sm text-pastel-petal/60">Δ:</span>
        {snapshots.map((s, i) => (
          <button
            key={s.Delta}
            onClick={() => { setSnapIdx(i); setConfigIdx(0); setAutoPlay(false); }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              i === snapIdx
                ? 'bg-azure-blue/30 text-azure-blue ring-1 ring-azure-blue/50'
                : 'bg-white/5 text-pastel-petal/60 hover:text-pastel-petal hover:bg-white/10'
            }`}
            style={i === snapIdx ? { borderColor: COLORS[i], borderWidth: 1 } : {}}
          >
            {s.Delta.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm text-pastel-petal/60">Config:</span>
        {snapshot?.top_configs.map((_, i) => (
          <button
            key={i}
            onClick={() => setConfigIdx(i)}
            className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
              i === configIdx
                ? 'bg-azure-blue/40 text-white ring-1 ring-azure-blue'
                : 'bg-white/5 text-pastel-petal/50 hover:text-pastel-petal'
            }`}
          >
            {i + 1}
          </button>
        ))}
        {config && (
          <span className="text-xs text-pastel-petal/50 ml-2">
            P = {(config.prob * 100).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg width={totalWidth} height={height} className="overflow-visible">
          <defs>
            <linearGradient id="chain-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2a2d36" />
              <stop offset="50%" stopColor="#4a4d56" />
              <stop offset="100%" stopColor="#2a2d36" />
            </linearGradient>
          </defs>

          {config?.spins.map((spin, i) => {
            const cx = padding + i * siteWidth + siteWidth / 2;
            const isUp = spin === 1;

            return (
              <g key={i}>
                <line
                  x1={padding + i * siteWidth + siteWidth / 2 + arrowWidth / 2 + 2}
                  y1={height / 2}
                  x2={padding + (i + 1) * siteWidth + siteWidth / 2 - arrowWidth / 2 - 2}
                  y2={height / 2}
                  stroke="#5a5d66"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
                <circle
                  cx={cx}
                  cy={height / 2}
                  r={22}
                  fill={isUp ? `${SPIN_UP}20` : `${SPIN_DOWN}20`}
                  stroke={isUp ? SPIN_UP : SPIN_DOWN}
                  strokeWidth={2}
                />
                <text
                  x={cx}
                  y={height / 2 - (isUp ? 14 : 12)}
                  textAnchor="middle"
                  fontSize={22}
                  fill={isUp ? SPIN_UP : SPIN_DOWN}
                  dominantBaseline="middle"
                >
                  {isUp ? '↑' : '↓'}
                </text>
                <text
                  x={cx}
                  y={height / 2 + 32}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#8a8d96"
                >
                  {i}
                </text>
              </g>
            );
          })}

          {config && (
            <text x={padding} y={170} fill="#8a8d96" fontSize={11}>
              E₀ = {snapshot.E0.toFixed(4)}&nbsp;&nbsp;|&nbsp;&nbsp;N = {N}
            </text>
          )}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {snapshots.map((s, i) => (
          <div
            key={s.Delta}
            className={`p-2 rounded-lg text-center text-xs transition-all ${
              i === snapIdx
                ? 'bg-azure-blue/10 ring-1 ring-azure-blue/30'
                : 'bg-white/5'
            }`}
          >
            <div className="text-pastel-petal/60 mb-1">Δ = {s.Delta.toFixed(1)}</div>
            <div className="text-pastel-petal/50">
              E₀ = {s.E0.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
