import json, numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import eigsh
from math import comb

OUT = "/home/ayush/Desktop/code/exact_diagonalization/nextjs-viz/public"

def generate_sz0_basis(N):
    basis = []
    for state in range(1 << N):
        if bin(state).count('1') == N // 2:
            basis.append(state)
    return basis

def state_to_spins(state, N):
    return [(1 if (state >> i) & 1 else -1) for i in range(N)]

def build_hamiltonian(N, J, Delta, pbc=True):
    basis = generate_sz0_basis(N)
    dim = len(basis)
    state_to_idx = {s: i for i, s in enumerate(basis)}
    H = lil_matrix((dim, dim))
    for idx, state in enumerate(basis):
        diag = 0.0
        for i in range(N):
            j = (i + 1) % N if pbc else i + 1
            if j >= N: continue
            si, sj = (state >> i) & 1, (state >> j) & 1
            diag += 1.0 if si == sj else -1.0
        H[idx, idx] = J * Delta * diag / 4.0
        for i in range(N):
            j = (i + 1) % N if pbc else i + 1
            if j >= N: continue
            si, sj = (state >> i) & 1, (state >> j) & 1
            if si == 1 and sj == 0:
                ns = state & ~(1 << i); ns |= 1 << j
                H[idx, state_to_idx[ns]] += J / 2.0
            elif si == 0 and sj == 1:
                ns = state | (1 << i); ns &= ~(1 << j)
                H[idx, state_to_idx[ns]] += J / 2.0
    return H.tocsr(), basis

def entanglement_entropy(psi, basis, N, k=None):
    if k is None: k = N // 2
    dimA, dimB = 1 << k, 1 << (N - k)
    M = np.zeros((dimA, dimB))
    for coeff, state in zip(psi, basis):
        a = state & ((1 << k) - 1); b = state >> k
        M[a, b] = coeff
    _, s, _ = np.linalg.svd(M, full_matrices=False)
    ssq = s[s > 1e-15]**2; ssq /= ssq.sum()
    return -np.sum(ssq * np.log(ssq))

def compute_correlations(psi, basis, N):
    n_sites = N
    n_pairs = N * (N - 1) // 2
    sz_sz = np.zeros(N)
    prob = np.abs(psi)**2
    for amp, state in zip(prob, basis):
        spins = state_to_spins(state, N)
        for i in range(N - 1):
            sz_sz[i] += amp * spins[i] * spins[i+1]
    return sz_sz.tolist()

print("=== Exporting ED Data ===")
J = 1.0

# 1. Energy spectrum (N=10, multiple Δ)
N = 10
Delta_range = np.linspace(0.2, 2.0, 37)
n_states = 6
spectrum = []
for Delta in Delta_range:
    H, basis = build_hamiltonian(N, J, Delta)
    evals = eigsh(H, k=n_states, which='SA', return_eigenvectors=False)
    spectrum.append({"Delta": round(Delta, 4), "energies": [round(e, 6) for e in evals.tolist()]})
with open(f"{OUT}/energy_spectrum.json", "w") as f:
    json.dump(spectrum, f)
print(f"  energy_spectrum.json ({len(spectrum)} points)")

# 2. Phase transition (N=10, entropy + gap)
Delta_range_fine = np.linspace(0.2, 2.0, 55)
phase = []
for Delta in Delta_range_fine:
    H, basis = build_hamiltonian(N, J, Delta)
    evals, evecs = eigsh(H, k=3, which='SA')
    psi = evecs[:, 0]
    S = entanglement_entropy(psi, basis, N)
    phase.append({"Delta": round(Delta, 4), "entropy": round(S, 6), "gap": round(evals[1] - evals[0], 6), "E0": round(evals[0], 6)})
with open(f"{OUT}/phase_transition.json", "w") as f:
    json.dump(phase, f)
print(f"  phase_transition.json ({len(phase)} points)")

# 3. Size scaling (N=8,10,12)
sizes = [8, 10, 12]
Delta_coarse = np.linspace(0.2, 2.0, 28)
scaling = []
for Delta in Delta_coarse:
    row = {"Delta": round(Delta, 4)}
    for Nc in sizes:
        H, basis = build_hamiltonian(Nc, J, Delta)
        evals, evecs = eigsh(H, k=2, which='SA')
        S = entanglement_entropy(evecs[:, 0], basis, Nc)
        row[f"S_N{Nc}"] = round(S, 6)
        row[f"dim_N{Nc}"] = comb(Nc, Nc // 2)
    scaling.append(row)
with open(f"{OUT}/size_scaling.json", "w") as f:
    json.dump(scaling, f)
print(f"  size_scaling.json ({len(scaling)} points)")

# 4. Spin chain snapshots (N=10, various Δ)
chain_data = []
for Delta in [0.2, 0.5, 1.0, 1.5, 2.0]:
    H, basis = build_hamiltonian(N, J, Delta)
    evals, evecs = eigsh(H, k=1, which='SA')
    psi = evecs[:, 0]
    prob = np.abs(psi)**2
    top_idx = np.argsort(prob)[-5:][::-1]
    top_configs = []
    for idx in top_idx:
        spins = state_to_spins(basis[idx], N)
        top_configs.append({"spins": spins, "prob": round(float(prob[idx]), 6)})
    corr = compute_correlations(psi, basis, N)
    chain_data.append({"Delta": round(Delta, 4), "E0": round(float(evals[0]), 6), "top_configs": top_configs, "corr": corr})
with open(f"{OUT}/spin_chain.json", "w") as f:
    json.dump(chain_data, f)
print(f"  spin_chain.json ({len(chain_data)} snapshots)")

# 5. Entanglement spectrum (N=10, Δ=1)
Nc = 10
H, basis = build_hamiltonian(Nc, J, 1.0)
evals, evecs = eigsh(H, k=1, which='SA')
psi = evecs[:, 0]
dimA = 1 << (Nc // 2); dimB = 1 << (Nc - Nc // 2)
M = np.zeros((dimA, dimB))
for coeff, state in zip(psi, basis):
    a = state & ((1 << (Nc // 2)) - 1); b = state >> (Nc // 2)
    M[a, b] = coeff
_, s, _ = np.linalg.svd(M, full_matrices=False)
ssq = s[s > 1e-15]**2; ssq = ssq / ssq.sum() if ssq.sum() > 0 else ssq
ent_spec = [round(float(v), 8) for v in sorted(ssq, reverse=True)[:20]]
with open(f"{OUT}/entanglement_spectrum.json", "w") as f:
    json.dump(ent_spec, f)
print(f"  entanglement_spectrum.json (top 20 Schmidt values)")

print("Done!")
