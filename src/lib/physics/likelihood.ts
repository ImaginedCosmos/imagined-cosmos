// Likelihood Engine — statistical comparison of theory vs data
// Pure functions, no state, no side effects

import type { TheoryPredictions } from "./theory";
import type { ObservationalConstraints } from "./data";

export type Residuals = {
  // Individual pulls (in units of sigma)
  pull_w0: number;
  pull_wa: number;
  pull_H0: number;       // vs Planck
  pull_H0_shoes: number; // vs SH0ES
  // Correlated chi-squared in w0-wa plane
  chi2_desi: number;
  // Total chi-squared (w0, wa, H0_planck)
  chi2_total: number;
  // Tension metric (σ from perfect agreement)
  sigma_desi: number;
  // CVC constraint violation
  cvc_residual: number;
};

export type ConvergenceStatus =
  | "running"
  | "converged"
  | "falsified"
  | "needs_revision";

export function computeResiduals(
  pred: TheoryPredictions,
  obs: ObservationalConstraints
): Residuals {
  const pull_w0 = (pred.w0 - obs.w0) / obs.w0_err;
  const pull_wa = (pred.wa - obs.wa) / obs.wa_err;

  // Correlated 2D chi-squared in w0-wa space
  const rho = obs.rho;
  const chi2_desi =
    (1 / (1 - rho * rho)) *
    (pull_w0 * pull_w0 -
      2 * rho * pull_w0 * pull_wa +
      pull_wa * pull_wa);

  // H0 predictions
  const H0_cvc = obs.H0_planck + pred.deltaH0;
  const pull_H0 = (H0_cvc - obs.H0_planck) / 0.5;
  const pull_H0_shoes = (H0_cvc - obs.H0_shoes) / obs.wa_err; // reuse sigma

  const chi2_total = chi2_desi + pull_H0 * pull_H0;

  // σ from perfect agreement: sqrt(chi2_desi) for the 2D case
  const sigma_desi = Math.sqrt(chi2_desi);

  return {
    pull_w0,
    pull_wa,
    pull_H0,
    pull_H0_shoes,
    chi2_desi,
    chi2_total,
    sigma_desi,
    cvc_residual: pred.cvcResidual,
  };
}

// Convergence thresholds
const CONVERGED_CHI2 = 4.0;    // within 2σ of DESI
const FALSIFIED_CHI2 = 25.0;   // beyond 5σ at all ν — theory wrong
const NU_MIN = -2.0;
const NU_MAX = 2.0;

export function convergenceStatus(
  residuals: Residuals,
  nu: number,
  bestNu: number
): ConvergenceStatus {
  if (residuals.chi2_desi <= CONVERGED_CHI2) return "converged";

  // At the analytic best-fit, check if minimum chi2 is still too large
  const atMinimum = Math.abs(nu - bestNu) < 0.01;
  if (atMinimum && residuals.chi2_desi > FALSIFIED_CHI2) return "falsified";
  if (atMinimum && residuals.chi2_desi > CONVERGED_CHI2) return "needs_revision";

  // ν out of physical range
  if (nu < NU_MIN || nu > NU_MAX) return "falsified";

  return "running";
}

export function statusLabel(status: ConvergenceStatus): string {
  switch (status) {
    case "running":       return "ITERATING";
    case "converged":     return "CONVERGED";
    case "falsified":     return "FALSIFIED";
    case "needs_revision": return "NEEDS REVISION";
  }
}

export function statusColor(status: ConvergenceStatus): string {
  switch (status) {
    case "running":        return "text-violet-400";
    case "converged":      return "text-emerald-400";
    case "falsified":      return "text-red-400";
    case "needs_revision": return "text-amber-400";
  }
}
