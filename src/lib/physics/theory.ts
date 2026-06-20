// CVC Theory Engine — pure functions, zero side effects, zero React coupling
// Input: ν (running vacuum coefficient) + cosmological parameters
// Output: predictions for all observables

import { FIDUCIAL } from "./data";

export type TheoryVersion = "CVC-1.0" | "CVC-2.0";

export type TheoryParams = {
  nu: number;                 // ν₁ — H² running coefficient (one free parameter in CVC-1.0)
  nu2?: number;               // ν₂ — H⁴ correction coefficient (CVC-2.0 only, default 0)
  version?: TheoryVersion;    // defaults to CVC-1.0
  omega_m0?: number;          // defaults to FIDUCIAL
  omega_lambda0?: number;
  H0?: number;
};

export type TheoryPredictions = {
  nu: number;
  nu2: number;
  version: TheoryVersion;
  w0: number;                 // CPL equation of state today
  wa: number;                 // CPL time evolution
  // Modified Hubble rate E(z) = H(z)/H0
  Ez: (z: number) => number;
  // Comoving distance (Mpc, for H0 = 67.4)
  comovingDistance: (z: number) => number;
  // Running vacuum density (relative to critical density today)
  omegaLambdaEff: (z: number) => number;
  // Predicted H0 shift from early-universe running
  deltaH0: number;
  // Constraint line check: wa + 3(1+w0) — 0 for pure CVC-1.0
  cvcResidual: number;
};

export function computePredictions(params: TheoryParams): TheoryPredictions {
  const {
    nu,
    nu2 = 0,
    version = nu2 !== 0 ? "CVC-2.0" : "CVC-1.0",
    omega_m0 = FIDUCIAL.omega_m0,
    omega_lambda0 = FIDUCIAL.omega_lambda0,
  } = params;

  const alpha = omega_m0 / omega_lambda0; // ≈ 0.4599

  // CVC-1.0 CPL parameters (conserved-matter H²-RVM background): w₀ = -1 + να, wₐ = +3να.
  // wₐ is POSITIVE for ν>0: the effective DE density ρ_DE = E² − Ω_m(1+z)³ carries a
  // +ν·Ω_m(1+z)³ term, so w_eff rises with z (quintessence-like). Verified by
  // differentiating w_eff(z) numerically from Ez (eval/eval.mjs). [Was −3να — a sign
  // error that spuriously placed the model in DESI's preferred wₐ<0 quadrant.]
  // CVC-2.0 H⁴ correction: ρ_Λ += ν₂·M_P²·(H⁴-H₀⁴)/H₀²; leading CPL shift Δw₀ = +2ν₂α (exact
  // under flatness), Δwₐ = +6(1+Ω_m0)ν₂α — the exact 6·Ω_m0·(Ω_Λ0+2Ω_m0)/Ω_Λ0 = 7.89α at
  // Ω_m0=0.315, NOT 8α (8α is only the Ω_m0→1/3 limit). Derived analytically + numerically
  // against the exact H⁴ Friedmann fixed-point; locked in eval/eval.mjs (Test 5).
  const w0 = -1 + (nu + 2 * nu2) * alpha;
  const wa = (3 * nu + 6 * (1 + omega_m0) * nu2) * alpha;

  // Modified Friedmann for CVC-1.0: E²(z) = [Ω_m0(1+z)³ + Ω_Λ0 - ν] / (1-ν)
  // CVC-2.0 adds H⁴ term — E² solved iteratively at each z
  const Ez = (z: number): number => {
    if (nu2 === 0) {
      // CVC-1.0: analytic solution
      const numerator = omega_m0 * Math.pow(1 + z, 3) + omega_lambda0 - nu;
      const denominator = 1 - nu;
      return Math.sqrt(Math.max(numerator / denominator, 0));
    }
    // CVC-2.0: E² = Ω_m(1+z)³ + Ω_Λ₀ + ν(E²-1) + ν₂(E⁴-1)
    // (consistent with ρ_Λ/ρ_c = Ω_Λ0 + ν(E²-1) + ν₂(E⁴-1); reduces to the CVC-1.0
    //  analytic form above when ν₂=0. [Was −ν(E²-1)−ν₂(E⁴-1): wrong sign.])
    let E2 = omega_m0 * Math.pow(1 + z, 3) + omega_lambda0; // initial guess
    for (let iter = 0; iter < 20; iter++) {
      const next = omega_m0 * Math.pow(1 + z, 3) + omega_lambda0
        + nu * (E2 - 1) + nu2 * (E2 * E2 - 1);
      if (Math.abs(next - E2) < 1e-10) { E2 = next; break; }
      E2 = next;
    }
    return Math.sqrt(Math.max(E2, 0));
  };

  // Comoving distance: χ(z) = c/H0 × ∫₀ᶻ dz'/E(z')  (numerical integration)
  const comovingDistance = (z: number): number => {
    const c_over_H0 = 299792.458 / (params.H0 ?? FIDUCIAL.H0); // Mpc
    const N = 200;
    let integral = 0;
    const dz = z / N;
    for (let i = 0; i < N; i++) {
      const zi = (i + 0.5) * dz;
      integral += dz / Ez(zi);
    }
    return c_over_H0 * integral;
  };

  // Effective dark energy density fraction
  const omegaLambdaEff = (z: number): number => {
    const E2 = Ez(z) ** 2;
    const rhoLambda_over_rho_crit = omega_lambda0 + nu * (E2 - 1) + nu2 * (E2 * E2 - 1);
    return rhoLambda_over_rho_crit / E2;
  };

  // H0 shift from running vacuum at early times (BBN / recombination)
  // CVC-2.0: H⁴ term is negligible at early times (H²>>H₀² dominates), same shift
  const deltaH0 = (params.H0 ?? FIDUCIAL.H0) * nu * 0.03;

  // CVC residual: 0 for CVC-1.0 (which lives on the line wₐ = +3(1+w₀)),
  // non-zero offset for CVC-2.0 (H⁴ moves off the line)
  const cvcResidual = wa - 3 * (1 + w0);

  return {
    nu,
    nu2,
    version,
    w0,
    wa,
    Ez,
    comovingDistance,
    omegaLambdaEff,
    deltaH0,
    cvcResidual,
  };
}

// Analytical best-fit ν given observational w0, wa constraints
// Minimises χ²(ν) over the correlated (w0, wa) plane
export function analyticBestNu(
  w0_obs: number,
  wa_obs: number,
  w0_err: number,
  wa_err: number,
  rho: number,
  alpha: number = FIDUCIAL.alpha
): number {
  // Theory (conserved-matter CVC-1.0): w0 = -1 + ν α,  wa = +3ν α
  // Define: a = α/σ_w0,  b = +3α/σ_wa  (∂w0/∂ν / σ and ∂wa/∂ν / σ)
  // c0 = (-1 - w0_obs)/σ_w0,  ca = (-wa_obs)/σ_wa  (residuals at ν=0)
  const a = alpha / w0_err;
  const b = 3 * alpha / wa_err;
  const c0 = (-1 - w0_obs) / w0_err;
  const ca = -wa_obs / wa_err;

  // dχ²/dν = 0 → ν_best = numerator / denominator
  const numerator = -a * c0 + rho * (a * ca + b * c0) - b * ca;
  const denominator = a * a - 2 * rho * a * b + b * b;
  return numerator / (denominator || 1e-10);
}

// CVC-2.0: Analytic best-fit ν₂ given fixed ν₁
// Minimises χ²(ν₁, ν₂) with ν₁ fixed at CVC-1.0 optimum
// w₀(ν₁,ν₂) = -1 + (ν₁+2ν₂)α,  wₐ(ν₁,ν₂) = +(3ν₁ + 6(1+Ω_m0)ν₂)α
export function analyticBestNu2(
  nu1: number,
  w0_obs: number,
  wa_obs: number,
  w0_err: number,
  wa_err: number,
  rho: number,
  alpha: number = FIDUCIAL.alpha
): number {
  const pred1 = computePredictions({ nu: nu1 });
  // Residuals at ν₂=0 (CVC-1.0 best)
  const dw0_0 = pred1.w0 - w0_obs;
  const dwa_0 = pred1.wa - wa_obs;
  // Derivatives of (w₀, wₐ) w.r.t. ν₂ (leading order): dw₀/dν₂ = 2α, dwₐ/dν₂ = 6(1+Ω_m0)α
  const dw0_dnu2 = 2 * alpha;
  const dwa_dnu2 = 6 * (1 + FIDUCIAL.omega_m0) * alpha;
  // Analytic minimization of 2D correlated χ²
  const s00 = w0_err * w0_err;
  const saa = wa_err * wa_err;
  const det = s00 * saa * (1 - rho * rho);
  const num = -(
    (saa * dw0_dnu2 - rho * Math.sqrt(s00 * saa) * dwa_dnu2) * dw0_0 +
    (s00 * dwa_dnu2 - rho * Math.sqrt(s00 * saa) * dw0_dnu2) * dwa_0
  ) / det;
  const denom = (
    saa * dw0_dnu2 * dw0_dnu2 - 2 * rho * Math.sqrt(s00 * saa) * dw0_dnu2 * dwa_dnu2 + s00 * dwa_dnu2 * dwa_dnu2
  ) / det;
  return denom !== 0 ? num / denom : 0;
}

// Gradient of χ² with respect to ν (for iterative optimization)
export function chi2Gradient(
  nu: number,
  w0_obs: number,
  wa_obs: number,
  w0_err: number,
  wa_err: number,
  rho: number,
  alpha: number = FIDUCIAL.alpha
): number {
  const predictions = computePredictions({ nu });
  const dw0_dnu = alpha;
  const dwa_dnu = 3 * alpha;
  const delta_w0 = (predictions.w0 - w0_obs) / (w0_err * w0_err);
  const delta_wa = (predictions.wa - wa_obs) / (wa_err * wa_err);
  const cross = rho / (w0_err * wa_err);
  return 2 * (
    delta_w0 * dw0_dnu
    + delta_wa * dwa_dnu
    - cross * (dw0_dnu * (predictions.wa - wa_obs) + dwa_dnu * (predictions.w0 - w0_obs))
  );
}
