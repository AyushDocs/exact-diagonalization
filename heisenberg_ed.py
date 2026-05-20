import numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import eigsh
import matplotlib.pyplot as plt
from matplotlib import rcParams

rcParams.update({'font.size': 11, 'figure.dpi': 120})


def generate_sz0_basis(N):
    basis = []
    for state in range(1 << N):
        if bin(state).count('1') == N // 2:
            basis.append(state)
    return np.array(basis)


def build_hamiltonian(N, J, Delta, pbc=True):
    basis = generate_sz0_basis(N)
    dim = len(basis)
    state_to_idx = {s: i for i, s in enumerate(basis)}

    H = lil_matrix((dim, dim))

    for idx, state in enumerate(basis):
        diag = 0.0
        for i in range(N):
            j = (i + 1) % N if pbc else i + 1
            if j >= N:
                continue
            si = (state >> i) & 1
            sj = (state >> j) & 1
            diag += 1.0 if si == sj else -1.0
        H[idx, idx] = J * Delta * diag / 4.0

        for i in range(N):
            j = (i + 1) % N if pbc else i + 1
            if j >= N:
                continue
            si = (state >> i) & 1
            sj = (state >> j) & 1
            if si == 1 and sj == 0:
                new_state = state & ~(1 << i)
                new_state |= 1 << j
                H[idx, state_to_idx[new_state]] += J / 2.0
            elif si == 0 and sj == 1:
                new_state = state | (1 << i)
                new_state &= ~(1 << j)
                H[idx, state_to_idx[new_state]] += J / 2.0

    return H.tocsr(), basis


def entanglement_entropy(psi, basis, N, k=None):
    if k is None:
        k = N // 2

    dim_A = 1 << k
    dim_B = 1 << (N - k)
    M = np.zeros((dim_A, dim_B))

    for coeff, state in zip(psi, basis):
        a = state & ((1 << k) - 1)
        b = state >> k
        M[a, b] = coeff

    _, s, _ = np.linalg.svd(M, full_matrices=False)
    s_sq = s[s > 1e-15] ** 2
    s_sq /= s_sq.sum()
    return -np.sum(s_sq * np.log(s_sq))


def compute_spectrum(N, J, Delta, pbc=True, k=5):
    H, basis = build_hamiltonian(N, J, Delta, pbc)
    evals, evecs = eigsh(H, k=k, which='SA')
    return evals, evecs, basis


def fig_energy_spectrum(Delta_values, energies_all, N):
    fig, (ax0, ax1) = plt.subplots(1, 2, figsize=(12, 4.5))
    n_states = energies_all.shape[1]
    for level in range(n_states):
        ax0.plot(Delta_values, energies_all[:, level], 'o-', lw=1.2, ms=3,
                 label=f'E_{level}')
    ax0.set_xlabel(r'$\Delta$')
    ax0.set_ylabel('Energy')
    ax0.set_title(f'{N}-spin Heisenberg chain — energy levels')
    ax0.legend(fontsize=8, ncol=2)
    ax0.grid(True, alpha=0.25)

    gap = energies_all[:, 1] - energies_all[:, 0]
    ax1.plot(Delta_values, gap, 'r-', lw=2)
    ax1.axvline(x=1.0, color='k', ls='--', alpha=0.4, label=r'$\Delta=1$')
    ax1.set_xlabel(r'$\Delta$')
    ax1.set_ylabel('$E_1 - E_0$')
    ax1.set_title('Energy gap')
    ax1.legend()
    ax1.grid(True, alpha=0.25)
    fig.tight_layout()
    return fig


def fig_phase_transition(Delta_values, entropies, gaps, N):
    fig, ax1 = plt.subplots(figsize=(8, 4.5))
    ax1.plot(Delta_values, entropies, 'o-', color='tab:blue', lw=2, ms=4,
             label='Entanglement entropy S')
    ax1.set_xlabel(r'$\Delta$')
    ax1.set_ylabel('Entanglement entropy $S$', color='tab:blue')
    ax1.tick_params(axis='y', labelcolor='tab:blue')
    ax1.axvline(x=1.0, color='gray', ls='--', alpha=0.5)

    ax2 = ax1.twinx()
    ax2.plot(Delta_values, gaps, 's--', color='tab:red', lw=2, ms=3,
             label='Energy gap')
    ax2.set_ylabel(r'Energy gap $\Delta E$', color='tab:red')
    ax2.tick_params(axis='y', labelcolor='tab:red')

    lines = ax1.get_lines() + ax2.get_lines()
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc='upper left')

    ax1.set_title(f'Quantum phase transition — {N}-spin XXZ chain')
    fig.tight_layout()
    return fig


def fig_size_scaling(sizes, entropies_by_size, Delta_values):
    fig, ax = plt.subplots(figsize=(8, 4.5))
    for i, N in enumerate(sizes):
        ax.plot(Delta_values, entropies_by_size[i], 'o-', lw=1.5, ms=3,
                label=f'N={N}')
    ax.set_xlabel(r'$\Delta$')
    ax.set_ylabel('Entanglement entropy $S$')
    ax.set_title('Entanglement entropy vs system size')
    ax.axvline(x=1.0, color='gray', ls='--', alpha=0.4, label=r'$\Delta=1$')
    ax.legend()
    ax.grid(True, alpha=0.25)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
#  Main
# ---------------------------------------------------------------------------
def main():
    N = 10
    J = 1.0
    np.random.seed(0)

    # 1.  Energy spectrum vs anisotropy
    print("=== 1. Energy spectrum ===")
    Delta_values = np.linspace(0.3, 2.0, 36)
    n_states = 6
    energies_all = np.zeros((len(Delta_values), n_states))

    for i, Delta in enumerate(Delta_values):
        evals, *_ = compute_spectrum(N, J, Delta, k=n_states)
        energies_all[i] = evals
        if i % 10 == 0:
            print(f"  Δ = {Delta:.2f}   E0 = {evals[0]:.6f}")

    fig_energy_spectrum(Delta_values, energies_all, N)
    plt.savefig('energy_spectrum.png')
    plt.close()
    print("  Saved energy_spectrum.png\n")

    # 2.  Entanglement entropy + gap → phase transition
    print("=== 2. Phase transition scan ===")
    Delta_values_fine = np.linspace(0.2, 2.0, 46)
    entropies, gaps = [], []

    for i, Delta in enumerate(Delta_values_fine):
        evals, evecs, basis = compute_spectrum(N, J, Delta, k=3)
        psi_gs = evecs[:, 0]
        S = entanglement_entropy(psi_gs, basis, N)
        entropies.append(S)
        gaps.append(evals[1] - evals[0])
        if i % 10 == 0:
            print(f"  Δ = {Delta:.2f}   E0 = {evals[0]:.6f}   gap = {gaps[-1]:.4f}   S = {S:.4f}")

    fig_phase_transition(Delta_values_fine, entropies, gaps, N)
    plt.savefig('phase_transition.png')
    plt.close()
    print("  Saved phase_transition.png\n")

    # 3.  System-size scaling (quick version)
    print("=== 3. Size scaling ===")
    sizes = [8, 10, 12]
    Delta_coarse = np.linspace(0.2, 2.0, 26)
    entropies_by_size = []

    for Nc in sizes:
        from math import comb
        print(f"  N = {Nc}  (dim = {comb(Nc, Nc//2)})")
        S_list = []
        for Delta in Delta_coarse:
            evals, evecs, basis = compute_spectrum(Nc, J, Delta, k=2)
            psi_gs = evecs[:, 0]
            S_list.append(entanglement_entropy(psi_gs, basis, Nc))
        entropies_by_size.append(S_list)

    fig_size_scaling(sizes, entropies_by_size, Delta_coarse)
    plt.savefig('size_scaling.png')
    plt.close()
    print("  Saved size_scaling.png\n")

    # 4.  Summary
    print("=" * 50)
    print("Summary")
    print("=" * 50)
    print("The 1D XXZ Heisenberg chain has a quantum phase transition")
    print("at Δ = 1 (the isotropic XXX point):")
    print("  • Δ < 1  : XY phase — gapless, quasi-long-range order")
    print("  • Δ = 1  : XXX point — SU(2) symmetric, gapless (Bethe ansatz)")
    print("  • Δ > 1  : Ising phase — gapped, Néel order")
    print()
    print("The entanglement entropy peaks at the critical point (Δ=1),")
    print("while the energy gap opens for Δ > 1.")
    plt.close('all')


if __name__ == '__main__':
    main()
