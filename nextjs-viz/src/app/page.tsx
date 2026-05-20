'use client';

import { useEffect, useState } from 'react';
import {
  getEnergySpectrum, getPhaseTransition, getSizeScaling, getSpinChain, getEntanglementSpectrum,
  SpectrumPoint, PhasePoint, ScalingPoint, SpinSnapshot,
} from '@/lib/data';
import SpinChain from '@/components/SpinChain';
import EnergySpectrum from '@/components/EnergySpectrum';
import PhaseTransition from '@/components/PhaseTransition';
import EntropyScaling from '@/components/EntropyScaling';
import Explanation from '@/components/Explanation';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'chain', label: 'Spin Chain' },
  { id: 'spectrum', label: 'Energy Spectrum' },
  { id: 'phase', label: 'Phase Transition' },
  { id: 'scaling', label: 'Size Scaling' },
  { id: 'explanation', label: 'Explanation' },
];

export default function Home() {
  const [spectrum, setSpectrum] = useState<SpectrumPoint[]>([]);
  const [phase, setPhase] = useState<PhasePoint[]>([]);
  const [scaling, setScaling] = useState<ScalingPoint[]>([]);
  const [chainData, setChainData] = useState<SpinSnapshot[]>([]);
  const [entSpec, setEntSpec] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnergySpectrum(),
      getPhaseTransition(),
      getSizeScaling(),
      getSpinChain(),
      getEntanglementSpectrum(),
    ]).then(([s, p, sc, ch, es]) => {
      setSpectrum(s);
      setPhase(p);
      setScaling(sc);
      setChainData(ch);
      setEntSpec(es);
      setLoading(false);
    });
  }, []);

  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Diagonalizing Hamiltonians...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-white tracking-tight">
            Exact Diagonalization
          </span>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-20 space-y-16">
        {/* Overview */}
        <section id="overview" className="scroll-mt-20">
          <div className="text-center py-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              1D Heisenberg Spin Chain
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Exact diagonalization of a many-body quantum Hamiltonian. Explore energy levels,
              entanglement entropy, and a quantum phase transition — all in your browser.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-600">
              <span>10 spins</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Sz=0 sector</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>252 × 252 matrix</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Lanczos solver</span>
            </div>
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Hilbert Space', value: '2¹⁰ = 1024', sub: 'before symmetries' },
              { label: 'Sz=0 Sector', value: 'C(10,5) = 252', sub: 'after symmetry reduction' },
              { label: 'Lowest States', value: '6 eigenvalues', sub: 'via sparse Lanczos' },
              { label: 'Parameters', value: 'J = 1.0', sub: 'Δ from 0.2 → 2.0' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 text-center">
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-cyan-400/80 mt-0.5">{stat.label}</div>
                <div className="text-xs text-slate-600 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Spin Chain */}
        <section id="chain" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Spin Chain Visualizer</h2>
            <p className="text-sm text-slate-500 mt-1">
              Click through Δ values to see how the ground state spin configuration changes.
              At Δ=1 (critical point), quantum fluctuations are strongest.
            </p>
          </div>
          <SpinChain snapshots={chainData} />
        </section>

        {/* Energy Spectrum */}
        <section id="spectrum" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Energy Spectrum</h2>
            <p className="text-sm text-slate-500 mt-1">
              The lowest 6 energy eigenvalues as a function of the anisotropy parameter Δ.
              The gap between E₀ and E₁ is a key observable.
            </p>
          </div>
          <EnergySpectrum data={spectrum} />

          {/* Entanglement spectrum inset */}
          <div className="mt-4 bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <h4 className="text-sm font-medium text-white mb-2">Entanglement Spectrum at Δ = 1</h4>
            <p className="text-xs text-slate-500 mb-3">
              The 20 largest Schmidt values λᵢ² of the ground state (half-chain cut).
              The slow decay signals criticality.
            </p>
            <div className="flex items-end gap-1 h-24">
              {entSpec.slice(0, 20).map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${Math.max(3, val / Math.max(...entSpec) * 100)}%` }}
                  title={`λ² = ${val.toExponential(2)}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Phase Transition */}
        <section id="phase" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Quantum Phase Transition</h2>
            <p className="text-sm text-slate-500 mt-1">
              Entanglement entropy peaks at the critical point Δ=1, while the energy gap
              (within the Sz=0 sector) signals the transition to the gapped Ising phase.
            </p>
          </div>
          <PhaseTransition data={phase} />
        </section>

        {/* Size Scaling */}
        <section id="scaling" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Finite-Size Scaling</h2>
            <p className="text-sm text-slate-500 mt-1">
              Comparing entanglement entropy for N = 8, 10, and 12. The peak at Δ=1 sharpens
              as system size increases — converging to the thermodynamic phase transition.
            </p>
          </div>
          <EntropyScaling data={scaling} />
        </section>

        {/* Explanation */}
        <section id="explanation" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">How It Works</h2>
            <p className="text-sm text-slate-500 mt-1">
              Progressive explanations from first principles to state-of-the-art methods.
            </p>
          </div>
          <Explanation />
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 pt-8 text-center">
          <p className="text-xs text-slate-600">
            Built with NumPy · SciPy Sparse · Lanczos Eigensolver · Matplotlib · Next.js · Recharts · Tailwind CSS
          </p>
          <p className="text-xs text-slate-700 mt-1">
            Data pre-computed via Python. Visualization rendered client-side.
          </p>
        </footer>
      </main>
    </div>
  );
}
