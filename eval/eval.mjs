#!/usr/bin/env node
// Reproduction eval harness — zero dependencies, runs under plain `node`.
//
// This re-derives the H^2-only running-vacuum relations (CVC-1.0 = Type-G RVM:
// running gravitational coupling, matter conserved) INDEPENDENTLY of
// src/lib/physics so the harness is a genuine cross-check, not a tautology.
// Crucially, it derives the CPL slope wa by NUMERICALLY differentiating the
// effective dark-energy EoS obtained from E(z) — which is what catches a sign
// error in the closed-form (w0, wa) mapping. It asserts:
//
//   1. Friedmann constraint: the closed-form E^2(z) solves its own running-vacuum
//      Friedmann equation  E^2 = Om(1+z)^3 + OL + nu*(E^2 - 1)  to machine precision.
//   2. CPL sign self-consistency: wa derived numerically from E(z) is POSITIVE for
//      nu>0 and equals the closed-form wa = +3*nu*alpha. (A previous version coded
//      wa = -3*nu*alpha; this test now rejects that sign.)
//   3. DESI confrontation (honest): on its consistency line wa = +3(1+w0), the
//      H^2-line model is DISFAVOURED by DESI DR1 — best-fit nu collapses toward
//      LCDM and chi^2_min ~ 16 (~4 sigma). DESI prefers wa < 0, but Type-G RVM with
//      nu>0 (quintessence, w0>-1) gives wa > 0. Reaching DESI's wa<0 needs the
//      off-line H^4 / CVC-2.0 extension. The earlier "fits within 2 sigma (nu~0.5,
//      chi^2~3.4)" result was an artifact of the wa sign error.
//   4. LCDM limit: nu = 0 reproduces standard flat-LCDM exactly.
//
// Physics references (reproduction, not discovery):
//   Basilakos, Polarski, Sola (2012), PRD 86 043010 / arXiv:1204.4806 (H^2 RVM)
//   Sola Peracaula, Gomez-Valent, de Cruz Perez, Moreno-Pulido (2023),
//     Universe 9(6) 262 / arXiv:2304.11157 (running-vacuum phenomenology, w(z))
//   Sola Peracaula (2024), arXiv:2410.20382 (composite running vacuum, DESI-era)
//   Planck 2018 (arXiv:1807.06209); SH0ES Riess+ 2022 (arXiv:2112.04510);
//   DESI 2024 VI (arXiv:2404.03002)

// ---- Published observational constraints (public summary statistics) --------
const PLANCK = { omega_m: 0.315, omega_lambda: 0.685, H0: 67.4 };
const DESI = { w0: -0.727, w0_err: 0.067, wa: -1.05, wa_err: 0.27, rho: -0.90 };
const ALPHA = PLANCK.omega_m / PLANCK.omega_lambda; // ~= 0.4599

// ---- RVM relations (re-derived inline) --------------------------------------

// CPL mapping (Type-G CVC-1.0): w0 = -1 + nu*alpha, wa = +3*nu*alpha.
// wa is POSITIVE for nu>0 (quintessence-like: w rises toward the past).
function cplFromNu(nu, alpha = ALPHA) {
  return { w0: -1 + nu * alpha, wa: 3 * nu * alpha };
}

// Analytic closed-form modified Friedmann (Type-G H^2 RVM, matter ~(1+z)^3):
//   E^2(z) = [Om*(1+z)^3 + OL - nu] / (1 - nu)
function E2Analytic(z, nu, Om = PLANCK.omega_m, OL = PLANCK.omega_lambda) {
  return (Om * Math.pow(1 + z, 3) + OL - nu) / (1 - nu);
}

// Effective dark-energy EoS derived FROM E(z), independent of the closed-form wa:
//   rho_DE(z)/rho_c0 = E^2 - Om(1+z)^3 ;  1 + w_eff = (1+z)/(3 rho_DE) d(rho_DE)/dz
function wEffFromE(z, nu) {
  const h = 1e-6;
  const rhoDE = (zz) => E2Analytic(zz, nu) - PLANCK.omega_m * Math.pow(1 + zz, 3);
  const dr = (rhoDE(z + h) - rhoDE(z - h)) / (2 * h);
  return -1 + ((1 + z) / (3 * rhoDE(z))) * dr;
}

// Analytic chi^2 minimum of the correlated 2D Gaussian over (w0, wa) vs nu.
// theory (corrected): w0(nu) = -1 + nu*alpha, wa(nu) = +3*nu*alpha
function analyticBestNu(o = DESI, alpha = ALPHA) {
  const a = alpha / o.w0_err;        // (dw0/dnu)/sigma_w0
  const b = 3 * alpha / o.wa_err;    // (dwa/dnu)/sigma_wa  (+3, was -3)
  const c0 = (-1 - o.w0) / o.w0_err;
  const ca = -o.wa / o.wa_err;
  const rho = o.rho;
  const numerator = -a * c0 + rho * (a * ca + b * c0) - b * ca;
  const denominator = a * a - 2 * rho * a * b + b * b;
  return numerator / (denominator || 1e-10);
}

function chi2(nu, o = DESI) {
  const { w0, wa } = cplFromNu(nu);
  const pw0 = (w0 - o.w0) / o.w0_err;
  const pwa = (wa - o.wa) / o.wa_err;
  const rho = o.rho;
  return (1 / (1 - rho * rho)) * (pw0 * pw0 - 2 * rho * pw0 * pwa + pwa * pwa);
}

// ---- test runner ------------------------------------------------------------
let failures = 0;
function check(name, cond, detail) {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

console.log("Imagined Cosmos — reproduction eval harness\n");

// --- Test 1: closed-form E^2(z) solves the running-vacuum Friedmann constraint ---
{
  const nuTest = 0.05;
  let maxAbs = 0, worstZ = 0;
  for (let z = 0; z <= 4.2 + 1e-9; z += 0.02) {
    const E2 = E2Analytic(z, nuTest);
    // Friedmann + running vacuum (matter conserved):
    //   E^2 = Om(1+z)^3 + [ OL + nu(E^2 - 1) ]
    const residual = E2 - (PLANCK.omega_m * Math.pow(1 + z, 3) + PLANCK.omega_lambda + nuTest * (E2 - 1));
    if (Math.abs(residual) > maxAbs) { maxAbs = Math.abs(residual); worstZ = z; }
  }
  check(
    "closed-form E^2(z) solves E^2 = Om(1+z)^3 + OL + nu(E^2-1) (Type-G Friedmann)",
    maxAbs < 1e-12,
    `max |residual| = ${maxAbs.toExponential(2)} at z=${worstZ.toFixed(2)}`
  );
}

// --- Test 2: CPL sign self-consistency — wa from E(z) equals +3*nu*alpha ------
{
  const nuTest = 0.01;
  const hz = 1e-4;
  const waNumerical = (wEffFromE(hz, nuTest) - wEffFromE(-hz, nuTest)) / (2 * hz); // dw/dz|0 = wa
  const waClosed = cplFromNu(nuTest).wa; // = +3*nu*alpha
  check(
    "CPL slope is POSITIVE for nu>0 (wa = +3*nu*alpha), derived independently from E(z)",
    waNumerical > 0,
    `wa(numerical dw/dz|0 from E(z)) = ${waNumerical.toFixed(5)} (> 0)`
  );
  check(
    "closed-form wa matches the E(z)-derived slope (consistency of theory.ts mapping)",
    Math.abs(waNumerical - waClosed) < 0.02 * Math.abs(waClosed),
    `closed-form +3*nu*alpha = ${waClosed.toFixed(5)} vs derived ${waNumerical.toFixed(5)}`
  );
}

// --- Test 3: DESI confrontation (honest) — the H^2-line model is DISFAVOURED --
{
  const nuStar = analyticBestNu();
  const { w0, wa } = cplFromNu(nuStar);
  const chi2min = chi2(nuStar);

  check(
    "H^2-line is DESI-DISFAVOURED, not a fit: chi^2_min > 9 (>3 sigma)",
    chi2min > 9,
    `chi^2_min = ${chi2min.toFixed(2)} (~${Math.sqrt(chi2min).toFixed(1)} sigma off DESI)`
  );
  check(
    "best-fit nu collapses toward LCDM (|nu*| < 0.1), not the spurious ~0.5",
    Math.abs(nuStar) < 0.1,
    `nu* = ${nuStar.toFixed(4)}, at which w0 = ${w0.toFixed(3)}, wa = ${wa.toFixed(3)}`
  );
  check(
    "for any w0 > -1 (nu>0) the model gives wa > 0, opposite to DESI's wa = -1.05 < 0",
    cplFromNu(0.5).wa > 0 && DESI.wa < 0,
    `wa(nu=0.5) = +${cplFromNu(0.5).wa.toFixed(3)} vs DESI wa = ${DESI.wa}`
  );

  // Cross-check: brute-force scan minimum matches the analytic solution.
  let scanBestNu = 0, scanBest = Infinity;
  for (let nu = -2; nu <= 2; nu += 0.0005) {
    const c = chi2(nu);
    if (c < scanBest) { scanBest = c; scanBestNu = nu; }
  }
  check(
    "analytic nu* matches brute-force chi^2 scan minimum",
    Math.abs(scanBestNu - nuStar) < 0.01,
    `scan nu = ${scanBestNu.toFixed(4)}, analytic = ${nuStar.toFixed(4)}`
  );
}

// --- Test 4: LCDM limit at nu = 0 --------------------------------------------
{
  const { w0, wa } = cplFromNu(0);
  check("LCDM limit: w0(nu=0) = -1", Math.abs(w0 + 1) < 1e-12, `w0 = ${w0}`);
  check("LCDM limit: wa(nu=0) = 0", Math.abs(wa) < 1e-12, `wa = ${wa}`);
  let maxRel = 0;
  for (let z = 0; z <= 4.2; z += 0.05) {
    const e = Math.sqrt(E2Analytic(z, 0));
    const lcdm = Math.sqrt(PLANCK.omega_m * Math.pow(1 + z, 3) + PLANCK.omega_lambda);
    maxRel = Math.max(maxRel, Math.abs(e - lcdm) / lcdm);
  }
  check("LCDM limit: E(z) equals flat-LCDM form", maxRel < 1e-12,
    `max rel.err = ${maxRel.toExponential(2)}`);
}

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("All reproduction checks passed.");
