// Observational constraints — immutable ground truth
// All values from published papers cited in /papers

export const PLANCK_2018 = {
  H0: 67.4,          // km/s/Mpc
  H0_err: 0.5,
  omega_m: 0.315,
  omega_m_err: 0.007,
  omega_lambda: 0.685,
  source: "Planck Collaboration 2020 (arXiv:1807.06209)",
} as const;

export const SHOES_2022 = {
  H0: 73.04,         // km/s/Mpc
  H0_err: 1.04,
  source: "Riess et al. 2022 (arXiv:2112.04510)",
} as const;

export const DESI_2024 = {
  // DESI DR1 + CMB + DES-SN5YR (highest significance combination)
  w0: -0.727,
  w0_err: 0.067,
  wa: -1.05,
  wa_err: 0.27,
  rho: -0.90,        // correlation coefficient (anti-correlated)
  sigma_from_lcdm: 3.9,
  source: "DESI Collaboration 2024 (arXiv:2404.03002)",
} as const;

export const FIDUCIAL = {
  // Baseline cosmological parameters (Planck 2018 flat ΛCDM)
  omega_m0: PLANCK_2018.omega_m,
  omega_lambda0: PLANCK_2018.omega_lambda,
  H0: PLANCK_2018.H0,
  // Ratio used throughout CVC
  alpha: PLANCK_2018.omega_m / PLANCK_2018.omega_lambda, // ≈ 0.4599
} as const;

export type ObservationalConstraints = typeof DESI_2024 & {
  H0_planck: number;
  H0_shoes: number;
};

export const CONSTRAINTS: ObservationalConstraints = {
  ...DESI_2024,
  H0_planck: PLANCK_2018.H0,
  H0_shoes: SHOES_2022.H0,
};
