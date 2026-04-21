// Optimizer — finds the ν that minimises χ²(theory, data)
// Pure algorithm: (params, gradient) → new_params

import { analyticBestNu, analyticBestNu2, computePredictions } from "./theory";
import { computeResiduals } from "./likelihood";
import { FIDUCIAL, type ObservationalConstraints } from "./data";

export type CVC20Step = {
  iteration: number;
  nu1: number;      // fixed ν₁ from CVC-1.0
  nu2: number;      // optimizing ν₂
  w0: number;
  wa: number;
  chi2_desi: number;
  sigma_desi: number;
  gradient: number;
  step_size: number;
};

export type OptimizerStep = {
  iteration: number;
  nu: number;
  nu_prev: number;
  delta_nu: number;
  w0: number;
  wa: number;
  chi2_desi: number;
  sigma_desi: number;
  gradient: number;
  step_size: number;
};

// One step of gradient descent toward best-fit ν
export function gradientStep(
  nu: number,
  obs: ObservationalConstraints,
  learningRate: number = 0.15
): { nu_next: number; gradient: number; step_size: number } {
  const EPSILON = 0.001;
  const pPlus = computePredictions({ nu: nu + EPSILON });
  const pMinus = computePredictions({ nu: nu - EPSILON });
  const rPlus = computeResiduals(pPlus, obs);
  const rMinus = computeResiduals(pMinus, obs);
  const gradient = (rPlus.chi2_desi - rMinus.chi2_desi) / (2 * EPSILON);
  const step_size = -learningRate * gradient;
  const nu_next = nu + step_size;
  return { nu_next, gradient, step_size };
}

// Full iterative optimization trace — returns every step for visualization
export function optimizationTrace(
  obs: ObservationalConstraints,
  nu_start: number = 0,
  maxIter: number = 40
): OptimizerStep[] {
  const steps: OptimizerStep[] = [];

  // Analytic solution (to know where we're heading)
  const nu_star = analyticBestNu(
    obs.w0,
    obs.wa,
    obs.w0_err,
    obs.wa_err,
    obs.rho
  );

  let nu = nu_start;
  let learningRate = 0.20;

  for (let i = 0; i < maxIter; i++) {
    const pred = computePredictions({ nu });
    const resid = computeResiduals(pred, obs);
    const { nu_next, gradient, step_size } = gradientStep(nu, obs, learningRate);

    steps.push({
      iteration: i,
      nu,
      nu_prev: i === 0 ? nu : steps[i - 1].nu,
      delta_nu: step_size,
      w0: pred.w0,
      wa: pred.wa,
      chi2_desi: resid.chi2_desi,
      sigma_desi: resid.sigma_desi,
      gradient,
      step_size,
    });

    // Adaptive learning rate
    if (Math.abs(step_size) < 0.001) {
      learningRate *= 0.5;
    }

    nu = nu_next;

    // Early stop if converged to analytic solution
    if (Math.abs(nu - nu_star) < 0.005 && i > 5) break;
  }

  return steps;
}

// 1σ uncertainty on ν from the curvature of χ²(ν) at the minimum
// d²χ²/dν² = (2/(1-ρ²)) * (a² - 2ρab + b²)  where a=α/σ_w0, b=-3α/σ_wa
// σ_ν = 1 / sqrt(d²χ²/dν²)
export function nuUncertainty(obs: ObservationalConstraints): number {
  const alpha = FIDUCIAL.alpha;
  const a = alpha / obs.w0_err;
  const b = -3 * alpha / obs.wa_err;
  const rho = obs.rho;
  const d2chi2 = (2 / (1 - rho * rho)) * (a * a - 2 * rho * a * b + b * b);
  return 1 / Math.sqrt(d2chi2);
}

// Best-fit ν with its chi2 value and 1σ uncertainty
export function bestFit(obs: ObservationalConstraints): {
  nu: number;
  nu_err: number;
  w0: number;
  wa: number;
  chi2_desi: number;
  sigma_desi: number;
} {
  const nu = analyticBestNu(obs.w0, obs.wa, obs.w0_err, obs.wa_err, obs.rho);
  const nu_err = nuUncertainty(obs);
  const pred = computePredictions({ nu });
  const resid = computeResiduals(pred, obs);
  return {
    nu,
    nu_err,
    w0: pred.w0,
    wa: pred.wa,
    chi2_desi: resid.chi2_desi,
    sigma_desi: resid.sigma_desi,
  };
}

// CVC-2.0: fix ν₁ from CVC-1.0, iterate ν₂ to minimize remaining χ²
export function optimizationTraceCVC2(
  obs: ObservationalConstraints,
  nu1: number,
  maxIter: number = 20
): CVC20Step[] {
  const steps: CVC20Step[] = [];
  const nu2_star = analyticBestNu2(nu1, obs.w0, obs.wa, obs.w0_err, obs.wa_err, obs.rho);

  let nu2 = 0;
  const lr = 0.10;

  for (let i = 0; i < maxIter; i++) {
    const pred = computePredictions({ nu: nu1, nu2 });
    const resid = computeResiduals(pred, obs);

    const eps = 0.001;
    const rPlus = computeResiduals(computePredictions({ nu: nu1, nu2: nu2 + eps }), obs);
    const rMinus = computeResiduals(computePredictions({ nu: nu1, nu2: nu2 - eps }), obs);
    const gradient = (rPlus.chi2_desi - rMinus.chi2_desi) / (2 * eps);
    const step_size = -lr * gradient;

    steps.push({
      iteration: i,
      nu1,
      nu2,
      w0: pred.w0,
      wa: pred.wa,
      chi2_desi: resid.chi2_desi,
      sigma_desi: resid.sigma_desi,
      gradient,
      step_size,
    });

    nu2 += step_size;
    if (Math.abs(nu2 - nu2_star) < 0.005 && i > 3) break;
  }

  return steps;
}

// CVC-2.0 best-fit (ν₁ fixed, ν₂ analytic)
export function bestFitCVC2(
  obs: ObservationalConstraints
): { nu1: number; nu2: number; w0: number; wa: number; chi2_desi: number; sigma_desi: number } {
  const nu1 = analyticBestNu(obs.w0, obs.wa, obs.w0_err, obs.wa_err, obs.rho);
  const nu2 = analyticBestNu2(nu1, obs.w0, obs.wa, obs.w0_err, obs.wa_err, obs.rho);
  const pred = computePredictions({ nu: nu1, nu2 });
  const resid = computeResiduals(pred, obs);
  return { nu1, nu2, w0: pred.w0, wa: pred.wa, chi2_desi: resid.chi2_desi, sigma_desi: resid.sigma_desi };
}
