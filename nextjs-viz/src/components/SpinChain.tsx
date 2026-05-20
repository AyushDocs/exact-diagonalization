'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { SpinSnapshot } from '@/lib/data';

interface Props {
  snapshots: SpinSnapshot[];
}

const COLORS = ['#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444'];
const SPIN_UP = '#3b82f6';
const SPIN_DOWN = '#ef4444';

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
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-white">Ground State Spin Configurations</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAutoPlay}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              autoPlay
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            }`}
          >
            {autoPlay ? '⏹ Stop' : '▶ Auto-Play'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="text-sm text-slate-400">Δ:</span>
        {snapshots.map((s, i) => (
          <button
            key={s.Delta}
            onClick={() => { setSnapIdx(i); setConfigIdx(0); setAutoPlay(false); }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              i === snapIdx
                ? 'bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-400/50'
                : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
            style={i === snapIdx ? { borderColor: COLORS[i], borderWidth: 1 } : {}}
          >
            {s.Delta.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm text-slate-400">Config:</span>
        {snapshot?.top_configs.map((_, i) => (
          <button
            key={i}
            onClick={() => setConfigIdx(i)}
            className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
              i === configIdx
                ? 'bg-cyan-500/40 text-white ring-1 ring-cyan-400'
                : 'bg-slate-700/50 text-slate-500 hover:text-slate-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
        {config && (
          <span className="text-xs text-slate-500 ml-2">
            P = {(config.prob * 100).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="flex justify-center overflow-x-auto">
        <svg width={totalWidth} height={height} className="overflow-visible">
          <defs>
            <linearGradient id="chain-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
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
                  stroke="#475569"
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
                  fill="#64748b"
                >
                  {i}
                </text>
              </g>
            );
          })}

          {config && (
            <text x={padding} y={170} fill="#64748b" fontSize={11}>
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
                ? 'bg-cyan-500/10 ring-1 ring-cyan-400/30'
                : 'bg-slate-800/40'
            }`}
          >
            <div className="text-slate-400 mb-1">Δ = {s.Delta.toFixed(1)}</div>
            <div className="text-slate-500">
              E₀ = {s.E0.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
