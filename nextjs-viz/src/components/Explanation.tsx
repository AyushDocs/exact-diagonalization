'use client';

import { useState } from 'react';

const SECTIONS = [
  {
    id: 'beginner',
    label: '🌱 Beginner',
    color: 'green',
    content: [
      {
        title: "What's a Spin Chain?",
        body: `Imagine a line of tiny magnets (spins) that can point either up (↑) or down (↓). 
        In a quantum spin chain, these spins are not just classical arrows — they exist in a 
        superposition of up and down simultaneously. The Heisenberg model describes how neighboring 
        spins interact: they want to anti-align (one up, one down) when the coupling is 
        antiferromagnetic (J > 0).`,
      },
      {
        title: 'What Does "Exact Diagonalization" Mean?',
        body: `Exact Diagonalization (ED) means we write down the complete Hamiltonian matrix 
        for the system and diagonalize it to find all energy eigenvalues and eigenstates. 
        For N spins, the matrix is 2ᴺ × 2ᴺ — enormous! But by using symmetries (like fixing 
        the total magnetization to zero), we reduce the size dramatically.`,
      },
      {
        title: 'What Are We Looking For?',
        body: `The ground state (lowest energy) tells us how the spins arrange at zero temperature. 
        The energy gap (difference between ground and first excited state) tells us whether the 
        system is "gapped" (hard to excite) or "gapless" (easy to excite). The entanglement 
        entropy measures how quantum-correlated the spins are.`,
      },
    ],
  },
  {
    id: 'intermediate',
    label: '🌿 Intermediate',
    color: 'cyan',
    content: [
      {
        title: 'The XXZ Hamiltonian',
        body: `H = J Σᵢ [ SᵢˣSᵢ₊₁ˣ + SᵢʸSᵢ₊₁ʸ + Δ SᵢᶻSᵢ₊₁ᶻ ]

The first two terms (XX + YY) are "flip-flop" terms — they swap neighboring ↑↓ pairs. 
The last term (ZZ) is an Ising interaction — it costs energy when neighboring spins 
are aligned. The parameter Δ controls the relative strength.

In the computational basis (σᶻ eigenstates), each basis state is a bitstring like |↑↓↑↑↓...⟩.
The Hamiltonian connects states that differ by a single nearest-neighbor swap.`,
      },
      {
        title: 'Symmetries & Hilbert Space Reduction',
        body: `The Hamiltonian conserves total Sᶻ = Σ Sᵢᶻ, so the matrix block-diagonalizes 
into sectors labeled by magnetization. The ground state lives in the Sᶻ = 0 sector 
(N/2 up, N/2 down). This reduces the dimension from 2ᴺ to C(N, N/2) — for N=12, 
from 4096 to 924. Still large enough to be interesting, but manageable!`,
      },
      {
        title: 'Entanglement Entropy',
        body: `To compute entanglement, we split the chain into two halves (A and B). 
The ground state |ψ⟩ can be written as a sum of product states via Schmidt decomposition:
|ψ⟩ = Σᵢ λᵢ |aᵢ⟩ ⊗ |bᵢ⟩

The von Neumann entropy S = -Σᵢ λᵢ² log(λᵢ²) measures how entangled A and B are. 
At a quantum phase transition, entanglement peaks because the system is maximally 
quantum-correlated across all length scales.`,
      },
    ],
  },
  {
    id: 'advanced',
    label: '🌳 Advanced',
    color: 'purple',
    content: [
      {
        title: 'Bethe Ansatz Connection',
        body: `The 1D Heisenberg XXX model (Δ=1) is integrable via the Bethe ansatz. 
The exact ground state energy in the thermodynamic limit is E₀/N = ¼ - ln 2 ≈ -0.4431.
For our N=10 system, the finite-size energy E₀/N ≈ -0.4515 matches well.

The Bethe ansatz constructs eigenstates as superpositions of spin waves with 
scattering described by two-body S-matrices satisfying the Yang-Baxter equation.`,
      },
      {
        title: 'Conformal Field Theory at Criticality',
        body: `At Δ=1, the XXZ chain is described by SU(2)₁ Wess-Zumino-Witten CFT with 
central charge c = 1. The entanglement entropy of a block of length L scales as:
S(L) = (c/3) log(L) + const

This logarithmic scaling is the smoking gun of a critical (gapless) phase. In the 
gapped phase (Δ>1), entanglement saturates — the area law. Our finite-size data 
shows the peak at Δ=1 (maximal entanglement), consistent with CFT predictions.`,
      },
      {
        title: 'Finite-Size Scaling & Critical Exponents',
        body: `For Δ > 1, the energy gap scales as ΔE ~ exp(-αN) for finite systems 
(tunneling between Néel states) but in the thermodynamic limit it opens as:
ΔE ~ J (Δ - 1)ᶻʷ     where zν = 1 for the XXZ model

The correlation length diverges as ξ ~ |Δ - 1|⁻¹ as we approach the critical point.
The entanglement entropy at criticality scales as S ~ (c/3) log₂(N) for a half-chain 
bipartition, with central charge c = 1.`,
      },
      {
        title: 'Going Further',
        body: `• DMRG: Density Matrix Renormalization Group handles up to ~1000 spins
• MPS: Matrix Product States are the modern language for 1D quantum systems
• Tensor Networks: PEPS for 2D, MERA for critical systems
• Quantum Computers: Variational quantum eigensolvers (VQE) on real hardware
• Experimental realization: Quantum simulators with Rydberg atoms or trapped ions`,
      },
    ],
  },
];

export default function Explanation() {
  const [openSection, setOpenSection] = useState<string | null>('beginner');

  return (
    <div className="space-y-4">
      {SECTIONS.map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div
            key={section.id}
            className={`rounded-xl border transition-all ${
              isOpen
                ? 'bg-slate-800/80 border-slate-600/50'
                : 'bg-slate-800/40 border-slate-700/30 hover:border-slate-600/40'
            }`}
          >
            <button
              onClick={() => setOpenSection(isOpen ? null : section.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="text-base font-semibold text-white">{section.label}</span>
              <svg
                className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-4">
                {section.content.map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <h4 className="text-sm font-medium text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
