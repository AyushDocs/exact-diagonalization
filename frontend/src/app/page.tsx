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
  { id: 'chain', label: '01. Spin Chain' },
  { id: 'spectrum', label: '02. Energy Spectrum' },
  { id: 'phase', label: '03. Phase Transition' },
  { id: 'scaling', label: '04. Size Scaling' },
  { id: 'explanation', label: '05. How It Works' },
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
          <div className="w-8 h-8 border-2 border-azure-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-white/60">Diagonalizing Hamiltonians...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
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
                    ? 'bg-azure-blue/20 text-azure-blue'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
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
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Exact diagonalization of a many-body quantum Hamiltonian. Explore energy levels,
              entanglement entropy, and a quantum phase transition — all in your browser.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-white/50">
              <span>10 spins</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Sz=0 sector</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>252 × 252 matrix</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Lanczos solver</span>
            </div>
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Hilbert Space', value: '2¹⁰ = 1024', sub: 'before symmetries', color: 'text-azure-blue' },
              { label: 'Sz=0 Sector', value: 'C(10,5) = 252', sub: 'after symmetry reduction', color: 'text-royal-gold' },
              { label: 'Lowest States', value: '6 eigenvalues', sub: 'via sparse Lanczos', color: 'text-watermelon' },
              { label: 'Parameters', value: 'J = 1.0', sub: 'Δ from 0.2 → 2.0', color: 'text-pastel-petal' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className={`text-xs font-semibold mt-0.5 ${stat.color}`}>{stat.label}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Beginner's Guided Tour */}
          <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🗺️</span>
              <h3 className="text-lg font-bold text-white">Beginner's Guided Exploration</h3>
            </div>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Welcome! This dashboard visualizes the physics of a 1D chain of quantum particles (spins). 
              Follow these steps to systematically explore the project:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-azure-blue/20 text-azure-blue text-xs font-bold font-mono">1</span>
                  <h4 className="text-sm font-semibold text-white">Visualize the Spins</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Start at the <strong>01. Spin Chain Visualizer</strong>. Click through the anisotropy values ($\Delta$). 
                  Notice how at small $\Delta$ (e.g. 0.2), spins look random/superposed (quantum fluctuations), but at large $\Delta$ (e.g. 2.0), they lock into a neat, alternating up-down-up-down pattern (Néel order).
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-royal-gold/20 text-royal-gold text-xs font-bold font-mono">2</span>
                  <h4 className="text-sm font-semibold text-white">Find the Energy Gap</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Scroll to the <strong>02. Energy Spectrum</strong>. Watch the lowest two energy lines ($E_0$ and $E_1$) approach each other. 
                  They almost touch right around $\Delta = 1.0$. This "gap closing" indicates the critical point of a quantum phase transition!
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-watermelon/20 text-watermelon text-xs font-bold font-mono">3</span>
                  <h4 className="text-sm font-semibold text-white">Measure Quantum Correlation</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Look at the <strong>03. Quantum Phase Transition</strong> chart. The blue curve (Entanglement Entropy) measures how quantum-connected the two halves of our chain are. 
                  It peaks exactly at the critical point $\Delta = 1.0$.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pastel-petal/20 text-pastel-petal text-xs font-bold font-mono">4</span>
                  <h4 className="text-sm font-semibold text-white">Scale the System Size</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Finally, check <strong>04. Finite-Size Scaling</strong>. Compare entanglement peaks for system sizes $N=8, 10, 12$. 
                  As system size increases, the peak becomes sharper. In infinite systems, it becomes a sharp, mathematical singularity!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spin Chain */}
        <section id="chain" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">01. Spin Chain Visualizer</h2>
            <p className="text-sm text-white/60 mt-1">
              Click through Δ values to see how the ground state spin configuration changes.
              At Δ=1 (critical point), quantum fluctuations are strongest.
            </p>
          </div>
          <SpinChain snapshots={chainData} />
        </section>

        {/* Energy Spectrum */}
        <section id="spectrum" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">02. Energy Spectrum</h2>
            <p className="text-sm text-white/60 mt-1">
              The lowest 6 energy eigenvalues as a function of the anisotropy parameter Δ.
              The gap between E₀ and E₁ is a key observable.
            </p>
          </div>
          <EnergySpectrum data={spectrum} />

          {/* Entanglement spectrum inset */}
          <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-2">Entanglement Spectrum at Δ = 1</h4>
            <p className="text-xs text-white/60 mb-3">
              The 20 largest Schmidt values λᵢ² of the ground state (half-chain cut).
              The slow decay signals criticality.
            </p>
            <div className="flex items-end gap-1 h-24">
              {entSpec.slice(0, 20).map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-azure-blue rounded-t-sm transition-all hover:opacity-80"
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
            <h2 className="text-xl font-bold text-white">03. Quantum Phase Transition</h2>
            <p className="text-sm text-white/60 mt-1">
              Entanglement entropy peaks at the critical point Δ=1, while the energy gap
              (within the Sz=0 sector) signals the transition to the gapped Ising phase.
            </p>
          </div>
          <PhaseTransition data={phase} />
        </section>

        {/* Size Scaling */}
        <section id="scaling" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">04. Finite-Size Scaling</h2>
            <p className="text-sm text-white/60 mt-1">
              Comparing entanglement entropy for N = 8, 10, and 12. The peak at Δ=1 sharpens
              as system size increases — converging to the thermodynamic phase transition.
            </p>
          </div>
          <EntropyScaling data={scaling} />
        </section>

        {/* Explanation */}
        <section id="explanation" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">05. How It Works</h2>
            <p className="text-sm text-white/60 mt-1">
              Progressive explanations from first principles to state-of-the-art methods.
            </p>
          </div>
          <Explanation />
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">
            Built with NumPy · SciPy Sparse · Lanczos Eigensolver · Matplotlib · Next.js · Recharts · Tailwind CSS
          </p>
          <p className="text-xs text-white/30 mt-1">
            Data pre-computed via Python. Visualization rendered client-side.
          </p>
        </footer>
      </main>
    </div>
  );
}
