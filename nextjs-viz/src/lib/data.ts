export interface SpectrumPoint {
  Delta: number;
  energies: number[];
}

export interface PhasePoint {
  Delta: number;
  entropy: number;
  gap: number;
  E0: number;
}

export interface ScalingPoint {
  Delta: number;
  S_N8: number;
  S_N10: number;
  S_N12: number;
  dim_N8: number;
  dim_N10: number;
  dim_N12: number;
}

export interface SpinSnapshot {
  Delta: number;
  E0: number;
  top_configs: { spins: number[]; prob: number }[];
  corr: number[];
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export async function getEnergySpectrum(): Promise<SpectrumPoint[]> {
  return fetchJSON('/energy_spectrum.json');
}

export async function getPhaseTransition(): Promise<PhasePoint[]> {
  return fetchJSON('/phase_transition.json');
}

export async function getSizeScaling(): Promise<ScalingPoint[]> {
  return fetchJSON('/size_scaling.json');
}

export async function getSpinChain(): Promise<SpinSnapshot[]> {
  return fetchJSON('/spin_chain.json');
}

export async function getEntanglementSpectrum(): Promise<number[]> {
  return fetchJSON('/entanglement_spectrum.json');
}
