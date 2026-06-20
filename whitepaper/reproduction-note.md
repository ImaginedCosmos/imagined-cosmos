# Imagined Cosmos — Reproduction Note

**A dependency-free reference implementation of the Running Vacuum Model and its
fit to DESI DR1 / Planck 2018 / SH0ES 2022**

> **Status: reproduction note, not original research.** This document re-derives
> and re-implements established, peer-reviewed results. It claims no new theory,
> no new measurement, and no priority. Every physical statement below traces to
> the cited literature. The purpose is pedagogical and engineering: to show that
> the published Running Vacuum Model (RVM) phenomenology can be reproduced
> end-to-end in a few hundred lines of dependency-free code, and to make the
> calculation auditable and runnable by anyone.

---

## 1. Scope and disclaimer

The cosmological model implemented in this repository — a cosmological "constant"
whose value runs with the Hubble rate `H` — is the **Running Vacuum Model**, a
research program developed over more than a decade by Solà Peracaula, Basilakos,
Polarski, de Cruz Pérez, and collaborators. We reproduce three things:

1. the RVM modified-Friedmann equation and its linearised mapping onto the
   Chevallier–Polarski–Linder (CPL) equation-of-state parameters `(w0, wa)`;
2. a transparent χ² fit of the single running coefficient `ν` to the published
   DESI DR1 + CMB + SN compressed `(w0, wa)` posterior; and
3. the result that — with the **corrected** CPL slope (`wa = +3να`, see §3.3) —
   the H²-line model is **disfavoured** by the DESI DR1 `(w0, wa)` posterior: the
   best fit collapses toward ΛCDM (`ν* ≈ 0.02`) with `χ²_min ≈ 16.6` (~4σ from the
   DESI central point). Only the *sign* (`ν > 0`) is the literature-supported
   feature — the data prefer `wa < 0` while the model gives `wa > 0`. (An earlier
   version reported a spurious `ν ≈ 0.5` "fit within ~2σ", an artifact of a sign
   error now corrected. See §3.3, §6 and §8.)

Within the repository and UI the implementation is packaged under the label
"CVC." **CVC is not a distinct or competing theory.** It is shorthand for this
project's self-contained encoding of the published RVM equations of state; the
name carries no physical claim beyond what the citations support.

What we **do not** do: solve the cosmological-constant problem, run a Boltzmann
code, use raw likelihoods, perform a full MCMC, or marginalise over the complete
parameter set. The fit uses compressed summary statistics only.

## 2. The cosmological-constant problem (background, cited)

Quantum field theory estimates of the vacuum energy density exceed the observed
dark-energy density by ~120 orders of magnitude — "the worst prediction in
physics" (Weinberg 1989; Carroll 2001). The observed late-time acceleration
(Riess et al. 1998; Perlmutter et al. 1999) is well described by a constant `Λ`
in the six-parameter ΛCDM model (Spergel et al. 2003; Planck 2018), but ΛCDM
leaves both the magnitude and the dynamical status of `Λ` unexplained. Two
empirical pressures motivate exploring a *dynamical* dark energy:

- the **Hubble tension**: CMB-inferred `H0 = 67.4 ± 0.5` (Planck 2018) vs the
  local distance-ladder `H0 = 73.04 ± 1.04` (SH0ES, Riess et al. 2022), a ~5σ
  discrepancy; and
- the **DESI DR1 result** (DESI Collaboration 2024): combined with CMB and SN,
  the CPL fit prefers `w0 ≈ −0.73, wa ≈ −1.05`, deviating from `(w0, wa) = (−1, 0)`
  at 2.5–3.9σ.

## 3. The Running Vacuum Model (re-derivation)

### 3.1 Vacuum density running

The RVM posits a renormalisation-group-style running of the vacuum density with
the cosmic expansion scale:

```
ρ_Λ(H) = ρ_Λ0 + (3 ν / 8π) M_P² (H² − H0²)   [ + (ν2 / ...) M_P²(H⁴ − H0⁴)/H0² ]
```

where `ν` is a small dimensionless coefficient (`ν = 0` ⇒ ΛCDM) and `ν2`
governs an optional higher-order `H⁴` term relevant only in the early universe.
This is the form studied in Basilakos, Polarski & Solà (2013) and in the
Solà Peracaula & de Cruz Pérez (2022, 2024) phenomenology papers.

### 3.2 Modified Friedmann equation (H²-only case)

This project reproduces the **H²-running-vacuum effective background** with
**conserved matter** (`ρ_m ∝ (1+z)³`): substituting `ρ_Λ/ρ_c0 = Ω_Λ0 + ν(E²−1)`
into the Friedmann constraint `E² = Ω_m0(1+z)³ + ρ_Λ/ρ_c0` gives, for the
`H²`-only model, the closed form

```
E²(z) = H²(z)/H0² = [ Ω_m0 (1+z)³ + Ω_Λ0 − ν ] / (1 − ν).
```

`ν = 0` recovers flat-ΛCDM. We keep the matter exponent at **3** (conserved
matter) and treat the running term as an effective dark-energy component with the
equation of state of §3.3. The microphysical mechanism that reconciles a running
vacuum with conserved matter — e.g. a running gravitational coupling, or a
matter–vacuum interaction — is a modelling choice we do not commit to here, and
the exact correspondence to a specific *named* RVM variant in the literature is
left to the cited references (this nomenclature is flagged for expert review).
This conserved-matter form is distinct from the **matter-exchange** variant, in
which matter dilutes anomalously as `(1+z)^{3(1−ν)}` (Basilakos–Polarski–Solà
2012, arXiv:1204.4806; Gómez-Valent–Solà–Basilakos 2015, arXiv:1501.03749). The
relation is implemented in `src/lib/physics/theory.ts`; `eval/eval.mjs` verifies
the closed form solves its own Friedmann constraint and checks the CPL sign.

### 3.3 Linearised CPL mapping

Expanding the effective dark-energy equation of state near `z = 0` gives, to
first order in `ν`, the compact mapping used throughout:

```
w0 = −1 + ν α,    wa = +3 ν α,    α ≡ Ω_m0 / Ω_Λ0 ≈ 0.4599 (Planck 2018).
```

For `ν > 0` (quintessence, `w0 > −1`) the slope `wa` is **positive**: the
effective DE density `ρ_DE = E² − Ω_m0(1+z)³` carries a `+ν Ω_m0(1+z)³` term, so
`w_eff` rises toward the past. Eliminating `ν` gives the consistency relation
`wa = +3(1 + w0)` — the model lives on a line in the `(w0, wa)` plane, a strong,
falsifiable prediction. (An earlier version of this note and the code carried
`wa = −3να`; that sign error — corrected here, with an independent sign check
added to `eval/eval.mjs` — spuriously placed the model in DESI's preferred
`wa < 0` quadrant. See §6.) The `H⁴` extension shifts the model off this line; see §6.

## 4. Data (public summary statistics)

| Quantity | Value | Source |
|---|---|---|
| `Ω_m, Ω_Λ, H0` | 0.315, 0.685, 67.4 | Planck 2018 (arXiv:1807.06209) |
| `H0` (local) | 73.04 ± 1.04 | SH0ES, Riess+ 2022 (arXiv:2112.04510) |
| `w0` | −0.727 ± 0.067 | DESI 2024 VI (arXiv:2404.03002) |
| `wa` | −1.05 ± 0.27 | DESI 2024 VI |
| `ρ(w0, wa)` | −0.90 | DESI 2024 VI |

These are encoded immutably in `src/lib/physics/data.ts`.

## 5. Likelihood and fit (re-implementation)

We use the correlated 2D Gaussian χ² in the `(w0, wa)` plane:

```
χ²(ν) = 1/(1−ρ²) · [ p_w0² − 2 ρ p_w0 p_wa + p_wa² ],
        p_w0 = (w0(ν) − w0_obs)/σ_w0,   p_wa = (wa(ν) − wa_obs)/σ_wa.
```

Because `w0(ν)` and `wa(ν)` are linear in `ν`, `χ²(ν)` is quadratic and the
minimum is available in closed form (`analyticBestNu` in `optimizer.ts`); the UI
solver also reaches it by gradient descent for illustration. The 1σ error on `ν`
follows from the curvature `d²χ²/dν²` at the minimum.

## 6. Results (reproduction)

Running the harness (`npm run eval`) on the compressed DESI DR1 posterior yields:

- **The H²-line model is *disfavoured* by DESI.** With the correct slope
  `wa = +3να`, positive `ν` (quintessence, `w0 > −1`) forces `wa > 0`, but DESI
  DR1 prefers `wa = −1.05 < 0`. The correlated χ² drives the best fit toward
  `ν* ≈ 0.02` (essentially ΛCDM), at `w0 ≈ −0.99, wa ≈ +0.03`, with
  **χ²_min ≈ 16.6 (~4σ from the DESI central point)**.
- **The canonical H²-line RVM does not sit near DESI's `(w0, wa)`.** This is
  consistent with recent running-vacuum work in the DESI era, which examines
  threshold and off-line RVM variants (beyond the simple H²-line) against
  DESI-DR2-era data (de Cruz Pérez, Gómez-Valent & Solà Peracaula 2025,
  arXiv:2512.20616).
- **ΛCDM limit** at `ν = 0` is reproduced exactly.

> **Correction note.** An earlier version reported `ν* ≈ 0.50`, `χ²_min ≈ 3.4`,
> "within ~2σ of DESI." That apparent agreement was an artifact of a **sign error**
> in the CPL slope (`wa = −3να` instead of `+3να`), which flipped the model into
> DESI's preferred `wa < 0` quadrant. `eval/eval.mjs` now derives the slope's sign
> independently from `E(z)` and asserts `wa > 0`, so the regression cannot recur.

The `H⁴` extension ("CVC-2.0") is the optional second coefficient `ν2` that moves
the prediction *off* the `wa = +3(1+w0)` line; it is the route by which the
running-vacuum family can approach DESI's off-line point, presented here as a
*what-if* knob rather than a fitted result.

## 7. Numerical cross-checks (the eval harness)

`eval/eval.mjs` re-implements the relations above independently of the app code
(`src/lib/physics`) and asserts:

1. the closed-form `E²(z)` solves its own running-vacuum Friedmann constraint
   `E² = Ω_m0(1+z)³ + Ω_Λ0 + ν(E²−1)` to machine precision;
2. **CPL sign self-consistency** — `wa` obtained by numerically differentiating
   the effective EoS `w_eff(z)` derived from `E(z)` is **positive** for `ν > 0`
   and matches the closed-form `wa = +3να` (so a regression to `−3να` fails);
3. **DESI confrontation** — the χ² minimum is `χ²_min ≈ 16.6` (~4σ) at
   `ν* ≈ 0.02`, i.e. the H²-line is disfavoured, not a fit;
4. the `ν = 0` ΛCDM limit is exact.

These run in CI on every PR.

## 8. Limitations

- Compressed summary statistics, not full likelihoods; no marginalisation over
  `Ω_m`, `H0`, nuisance parameters.
- The `(w0, wa)` linearisation is first-order in `ν`; large-`ν` behaviour uses
  the exact `E(z)` but the CPL mapping is approximate.
- No Boltzmann/CMB computation; the Hubble-tension treatment is schematic.
- Best-fit `ν` is illustrative of the method, not a publication-grade constraint.

## 9. References

1. Einstein, A. (1917). *Kosmologische Betrachtungen zur allgemeinen
   Relativitätstheorie.* Sitzungsber. Preuss. Akad. Wiss.
2. Friedmann, A. (1922). *Über die Krümmung des Raumes.* Z. Phys.
3. Hubble, E. (1929). PNAS 15, 168. doi:10.1073/pnas.15.3.168
4. Riess, A. G. et al. (1998). AJ 116, 1009. arXiv:astro-ph/9805201
5. Perlmutter, S. et al. (1999). ApJ 517, 565. arXiv:astro-ph/9812133
6. Weinberg, S. (1989). Rev. Mod. Phys. 61, 1.
7. Carroll, S. M. (2001). Living Rev. Rel. 4, 1. arXiv:astro-ph/0004075
8. Spergel, D. N. et al. (2003). ApJS 148, 175. arXiv:astro-ph/0302209
9. **Basilakos, S., Polarski, D., Solà, J. (2012).** *Generalizing the running
   vacuum energy model and comparing with the entropic-force models.*
   Phys. Rev. D 86, 043010. arXiv:1204.4806
10. Planck Collaboration (2020). A&A 641, A6. arXiv:1807.06209
11. Riess, A. G. et al. / SH0ES (2022). ApJL 934, L7. arXiv:2112.04510
12. **Solà Peracaula, J., Gómez-Valent, A., de Cruz Pérez, J., Moreno-Pulido, C.
    (2023).** *Running Vacuum in the Universe: Phenomenological Status in Light of
    the Latest Observations, and Its Impact on the σ₈ and H₀ Tensions.* Universe
    9(6), 262. arXiv:2304.11157. doi:10.3390/universe9060262
13. **Solà Peracaula, J. (2024).** *Composite running vacuum in the Universe:
    implications on the cosmological tensions.* arXiv:2410.20382
14. DESI Collaboration (2024). *DESI 2024 VI: Cosmological Constraints from BAO.*
    arXiv:2404.03002
15. Cohen, A. G., Kaplan, D. B., Nelson, A. E. (1999). PRL 82, 4971.
    arXiv:hep-th/9810169
16. Gibbons, G. W., Hawking, S. W. (1977). Phys. Rev. D 15, 2738.

---

*Prose and figures: CC BY 4.0. Code: Apache-2.0. See repository LICENSE files.*
