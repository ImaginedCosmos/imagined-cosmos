# Imagined Cosmos

**A dependency-free TypeScript reference implementation of the Running Vacuum
Model (RVM) of dark energy, fit to public DESI / Planck / SH0ES data.**

> **This is a reproduction, not a discovery.** The cosmology implemented here —
> a "running" cosmological constant whose value evolves with the Hubble rate —
> is **established, peer-reviewed physics** developed over more than a decade by
> Basilakos, Polarski, Solà Peracaula, and collaborators. This repository
> contributes **no new theory and no new measurement.** It re-derives the
> published RVM expressions, re-implements them in self-contained TypeScript
> with **zero numerical dependencies**, and reproduces the literature's
> best-fit running coefficient by a transparent χ² fit against published
> observational constraints. It exists as an educational, auditable reference —
> a way to *run the equations yourself* — and is framed accordingly throughout.
>
> In the code and UI the model is labelled **"CVC"** (a self-contained
> packaging of the running-vacuum equations of state). CVC is **not** a separate
> or rival theory; it is this project's implementation of the published RVM. All
> physical content traces to the citations below.

## What this is

- A small Next.js site that walks through the cosmological-constant problem and
  the running-vacuum response, with interactive, in-browser simulations.
- A pure-functions physics engine (`src/lib/physics/`) with **no external math
  libraries** — Friedmann integration, the RVM equation-of-state mapping, a
  correlated-Gaussian χ² likelihood, and a gradient-descent + analytic optimizer.
- A closed-loop "solver" that fits the single running coefficient **ν** to the
  DESI DR1 (w₀, wₐ) constraint and reports whether the model converges, needs
  revision, or is falsified — purely as a teaching/visualization device.
- A CI eval harness (`eval/`) that verifies the implementation against itself
  and against the literature (see **Reproducibility / eval harness** below).

## What this is NOT

- It is **not** a claim of new physics or a "solution" to the cosmological
  constant problem.
- It is **not** a substitute for a Boltzmann code (CLASS/CAMB) or a real MCMC
  cosmology pipeline. The χ² fit uses **compressed, published summary statistics**
  (the DESI w₀–wₐ posterior, Planck H₀, SH0ES H₀), not raw likelihoods.
- It contains **no model weights, no training data, and no machine-learning
  components.** "Generative AI" in the UI refers only to the optional, offline
  generation of decorative SVG/raster hero art (see `docs/`).

## The physics, in one paragraph

The Running Vacuum Model treats the vacuum energy density as a function of the
Hubble rate, ρ_Λ(H) = ρ_Λ₀ + (3ν/8π) M_P² (H² − H₀²) (plus an optional H⁴
term). A single dimensionless coefficient **ν** controls the running; ν = 0
recovers ΛCDM. Linearising near today maps ν onto the Chevallier–Polarski–Linder
(CPL) parameters via w₀ = −1 + ν·α and wₐ = +3ν·α, with α = Ω_m0/Ω_Λ0 (so wₐ > 0
for ν > 0). The
modified Friedmann equation has the closed analytic form
E²(z) = [Ω_m0(1+z)³ + Ω_Λ0 − ν] / (1 − ν) in the H²-only case, which this
project reproduces and cross-checks numerically.

## Primary citations (the physics this reproduces)

- **Basilakos, S., Polarski, D., Solà, J. (2013)** — *"Generalizing the running
  vacuum energy model and comparing with the entropic-force models."*
  Phys. Rev. D 86, 043010 / arXiv:1206.4711. The running-vacuum equation-of-state
  mapping and dynamical-DE phenomenology reproduced here.
- **Solà Peracaula, J. (2026 / forthcoming review)** — *running-vacuum
  phenomenology in light of DESI-era data*; together with
  **Solà Peracaula, J. & de Cruz Pérez, J. (2022, 2024)** *"Running Vacuum in the
  Universe"* (Universe; arXiv updates), which set the observational baseline and
  the best-fit ν used as the reproduction target.

Observational inputs (all public):

- **Planck Collaboration (2020)** — Planck 2018 results VI, arXiv:1807.06209.
- **Riess et al. / SH0ES (2022)** — arXiv:2112.04510.
- **DESI Collaboration (2024)** — DESI 2024 VI, arXiv:2404.03002.

The in-app `/papers` page carries the full annotated bibliography.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build (Next.js standalone)
npm run lint         # eslint
npm run eval         # run the reproduction eval harness (see below)
```

The physics engine is decoupled from React and can be imported directly:

```ts
import { computePredictions } from "./src/lib/physics/theory";
import { bestFit } from "./src/lib/physics/optimizer";
import { CONSTRAINTS } from "./src/lib/physics/data";

const fit = bestFit(CONSTRAINTS);   // best-fit ν vs DESI DR1
const pred = computePredictions({ nu: fit.nu });
console.log(pred.Ez(1.0));          // E(z=1) = H(z)/H0
```

## Reproducibility / eval harness

`npm run eval` runs `eval/eval.mjs`, a zero-dependency Node script that asserts:

1. **Friedmann self-consistency** — the analytic E(z) closed form agrees with an
   independent high-resolution numerical Friedmann integration to **< 0.1%**
   across **0 < z < 4.2** (the DESI redshift range).
2. **Literature recovery** — the χ² fit recovers a best-fit running coefficient
   **ν** consistent with the published RVM/DESI value, within a stated tolerance,
   and recovers w₀ ≈ −0.73, wₐ ≈ −1.05 at that ν.
3. **ΛCDM limit** — ν = 0 reproduces standard ΛCDM (w₀ = −1, wₐ = 0, E(z) the
   flat-ΛCDM form) exactly.

The harness is wired into CI (`.github/workflows/ci.yml`) and gates every PR.

## Repository layout

```
src/lib/physics/   pure physics engine (no deps): theory, data, likelihood, optimizer
src/components/     interactive canvas simulations + solver UI
src/app/            Next.js routes: chapters + /solve solver + /papers bibliography
eval/               reproduction eval harness (run in CI)
whitepaper/         reproduction note (re-derivation, cited)
docs/               asset/visual generation workflow
```

## License

- **Code** (TypeScript, physics engine, eval harness, config): Apache License 2.0
  — see [`LICENSE`](./LICENSE).
- **Prose, figures, and explanatory content** (whitepaper, narrative copy, SVG
  visuals, docs): Creative Commons Attribution 4.0 International (CC BY 4.0) —
  see [`LICENSE-CC-BY-4.0.txt`](./LICENSE-CC-BY-4.0.txt).

## Contributing

Issues and PRs welcome. Because this is a *reproduction*, contributions that
sharpen agreement with the published literature, add citations, or improve the
numerical cross-checks are especially valued. Please reference public issues
only and keep claims faithful to the cited papers.
