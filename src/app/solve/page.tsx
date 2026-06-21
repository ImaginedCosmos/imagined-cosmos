import type { Metadata } from "next";
import ChapterNav from "@/components/ChapterNav";
import SolverLoop from "@/components/solver/SolverLoop";
import Chi2Landscape from "@/components/solver/Chi2Landscape";
import { bestFit } from "@/lib/physics/optimizer";
import { CONSTRAINTS, DESI_2024, PLANCK_2018 } from "@/lib/physics/data";

export const metadata: Metadata = {
  title: "The Solver — Imagined Cosmos",
  description:
    "Closed-loop iterative optimization of the CVC dark energy theory against DESI 2024, Planck, and SH0ES observational constraints.",
  openGraph: {
    title: "The Solver — Imagined Cosmos",
    description:
      "Closed-loop iterative optimization of the CVC dark energy theory against DESI 2024, Planck, and SH0ES observational constraints.",
    url: "https://imagined-cosmos.example.com/solve",
  },
};

function chi2LCDM(): number {
  const rho = CONSTRAINTS.rho;
  const pW0 = (-1 - CONSTRAINTS.w0) / CONSTRAINTS.w0_err;
  const pWa = (0 - CONSTRAINTS.wa) / CONSTRAINTS.wa_err;
  return (1 / (1 - rho * rho)) * (pW0 * pW0 - 2 * rho * pW0 * pWa + pWa * pWa);
}

export default function SolvePage() {
  const best = bestFit(CONSTRAINTS);
  const lcdmChi2 = chi2LCDM();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ChapterNav current="solve" />

      <div className="max-w-4xl mx-auto w-full px-6 py-16">
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Closed-Loop Solver
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Iterating Toward the Solution
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            The CVC theory has one free parameter: ν, the running vacuum
            coefficient. This loop finds the ν that minimises the distance
            between theory and data — and reports whether the theory converges,
            needs revision, or is falsified.
          </p>
        </header>

        {/* Architecture overview */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">Architecture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                name: "Theory Engine",
                role: "Given ν, computes w₀, wₐ, H(z), Ω_Λ(z)",
                file: "lib/physics/theory.ts",
                color: "violet",
              },
              {
                name: "Data Engine",
                role: "Immutable observational constraints (DESI, Planck, SH0ES)",
                file: "lib/physics/data.ts",
                color: "blue",
              },
              {
                name: "Likelihood Engine",
                role: "Computes χ², Mahalanobis σ, convergence status",
                file: "lib/physics/likelihood.ts",
                color: "amber",
              },
              {
                name: "Optimizer",
                role: "Gradient descent + analytic closed-form best-fit ν",
                file: "lib/physics/optimizer.ts",
                color: "emerald",
              },
              {
                name: "Loop Controller",
                role: "State machine: RUNNING → CONVERGED / FALSIFIED",
                file: "components/solver/SolverLoop.tsx",
                color: "slate",
              },
              {
                name: "Revision Trigger",
                role: "When χ² > threshold at best ν, demands new theory input",
                file: "→ agents / human",
                color: "red",
              },
            ].map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-surface-light bg-surface p-5"
              >
                <p className={`text-xs font-mono text-${c.color}-400 uppercase tracking-wider mb-2`}>
                  {c.name}
                </p>
                <p className="text-sm text-muted leading-relaxed mb-3">{c.role}</p>
                <p className="text-xs font-mono text-muted/40">{c.file}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-surface-light bg-surface/50 p-5">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              Loop invariant
            </p>
            <pre className="text-xs font-mono text-muted leading-relaxed overflow-x-auto">
{`while (!converged && !falsified) {
  predictions  = theoryEngine.compute(ν)
  residuals    = likelihood.compare(predictions, observations)
  status       = likelihood.check(residuals)
  if (status === 'converged' || status === 'falsified') break
  ν            = optimizer.step(ν, residuals)
  iteration++
}
// If needs_revision: → agent team proposes new mechanism`}
            </pre>
          </div>
        </section>

        {/* Data inputs */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">Observational Targets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-surface-light bg-surface p-5">
              <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                DESI 2024 DR1
              </p>
              <div className="space-y-1.5 text-sm font-mono">
                <p>
                  <span className="text-muted/60">w₀ = </span>
                  <span className="text-foreground">{DESI_2024.w0} ± {DESI_2024.w0_err}</span>
                </p>
                <p>
                  <span className="text-muted/60">wₐ = </span>
                  <span className="text-foreground">{DESI_2024.wa} ± {DESI_2024.wa_err}</span>
                </p>
                <p>
                  <span className="text-muted/60">ρ  = </span>
                  <span className="text-foreground">{DESI_2024.rho}</span>
                </p>
                <p className="text-muted/40 text-xs mt-2">{DESI_2024.source}</p>
              </div>
            </div>
            <div className="rounded-xl border border-surface-light bg-surface p-5">
              <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                Planck 2018
              </p>
              <div className="space-y-1.5 text-sm font-mono">
                <p>
                  <span className="text-muted/60">H₀ = </span>
                  <span className="text-foreground">{PLANCK_2018.H0} ± {PLANCK_2018.H0_err}</span>
                </p>
                <p>
                  <span className="text-muted/60">Ωm = </span>
                  <span className="text-foreground">{PLANCK_2018.omega_m} ± {PLANCK_2018.omega_m_err}</span>
                </p>
                <p>
                  <span className="text-muted/60">ΩΛ = </span>
                  <span className="text-foreground">{PLANCK_2018.omega_lambda}</span>
                </p>
                <p className="text-muted/40 text-xs mt-2">{PLANCK_2018.source}</p>
              </div>
            </div>
            <div className="rounded-xl border border-surface-light bg-surface p-5">
              <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                Analytic Best-Fit
              </p>
              <div className="space-y-1.5 text-sm font-mono">
                <p>
                  <span className="text-muted/60">ν*  = </span>
                  <span className="text-emerald-300">{best.nu.toFixed(3)} ± {best.nu_err.toFixed(3)}</span>
                </p>
                <p>
                  <span className="text-muted/60">w₀* = </span>
                  <span className="text-foreground">{best.w0.toFixed(4)}</span>
                </p>
                <p>
                  <span className="text-muted/60">wₐ* = </span>
                  <span className="text-foreground">{best.wa.toFixed(4)}</span>
                </p>
                <p>
                  <span className="text-muted/60">χ²  = </span>
                  <span className="text-foreground">{best.chi2_desi.toFixed(3)}</span>
                  <span className="text-muted/50 text-xs ml-1">
                    ({best.sigma_desi.toFixed(2)}σ)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chi2 landscape */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-3">The χ² Landscape</h2>
          <p className="text-sm text-muted leading-relaxed mb-5">
            χ²(ν) as a function of the running vacuum coefficient ν, evaluated against
            DESI DR1 with the full (w₀, wₐ) anti-correlation. The solver navigates this
            landscape in real time — the minimum at ν* is the theory&apos;s best prediction.
          </p>
          <Chi2Landscape />
        </section>

        {/* Model comparison */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-3">ΛCDM vs CVC — Model Comparison</h2>
          <p className="text-sm text-muted leading-relaxed mb-5">
            How far each model sits from the DESI DR1 best-fit, in units of the correlated
            (w₀, wₐ) likelihood. A lower χ² means the model is more consistent with the data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-700/40 bg-red-950/10 p-5">
              <p className="text-xs font-mono text-red-400/70 uppercase tracking-wider mb-2">ΛCDM  (w₀=−1, wₐ=0)</p>
              <p className="text-3xl font-bold font-mono text-foreground">{lcdmChi2.toFixed(1)}</p>
              <p className="text-xs text-muted mt-1 mb-3">χ²  ({Math.sqrt(lcdmChi2).toFixed(1)}σ from DESI)</p>
              <p className="text-xs font-mono text-red-400/60">
                Fixed point — no free parameter to optimise. The cosmological constant is
                ruled out by DESI at {Math.sqrt(lcdmChi2).toFixed(1)}σ.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/10 p-5">
              <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider mb-2">CVC-1.0  (ν = {best.nu.toFixed(3)})</p>
              <p className="text-3xl font-bold font-mono text-foreground">{best.chi2_desi.toFixed(2)}</p>
              <p className="text-xs text-muted mt-1 mb-3">χ²  ({best.sigma_desi.toFixed(2)}σ from DESI)</p>
              <p className="text-xs font-mono text-emerald-400/60">
                One free parameter (ν). Even at best-fit ν, the H²-line model lands
                far outside the DESI 2σ ellipse — the data disfavours it.
              </p>
            </div>
            <div className="rounded-xl border border-surface-light bg-surface p-5">
              <p className="text-xs font-mono text-accent/70 uppercase tracking-wider mb-2">Improvement</p>
              <p className="text-3xl font-bold font-mono text-violet-300">
                Δχ² = {(lcdmChi2 - best.chi2_desi).toFixed(1)}
              </p>
              <p className="text-xs text-muted mt-1 mb-3">CVC vs ΛCDM</p>
              <p className="text-xs font-mono text-muted/50">
                CVC moves {(lcdmChi2 - best.chi2_desi).toFixed(1)} χ² units relative to
                ΛCDM with one extra parameter — but at χ² ≈ {best.chi2_desi.toFixed(1)} ({best.sigma_desi.toFixed(1)}σ)
                the H²-line model is itself disfavoured by DESI, not a fit. Under AIC, Δχ²−2 = {(lcdmChi2 - best.chi2_desi - 2).toFixed(1)}.
              </p>
            </div>
          </div>
        </section>

        {/* The loop */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6">The Loop</h2>
          <SolverLoop />
        </section>

        {/* What happens next */}
        <section className="mb-12 rounded-2xl border border-surface-light bg-surface/30 p-8">
          <h2 className="text-xl font-bold mb-5">What Happens Next</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              If the loop converges: ν is constrained, the theory makes a specific
              prediction for DESI DR2, and the next iteration is waiting for data.
              The loop pauses until{" "}
              <span className="text-foreground font-mono">DESI_DR2.w0</span> and{" "}
              <span className="text-foreground font-mono">DESI_DR2.wa</span> become
              available.
            </p>
            <p>
              If the loop needs revision: the agent team is triggered. The Geometer,
              QFT Agent, Phenomenologist, and Unifier each receive the residuals and
              propose mechanism amendments. Their outputs become new terms in the
              Theory Engine, and the loop restarts.
            </p>
            <p>
              If the loop falsifies the theory: the CVC constraint line does not
              pass through the observational ellipse. The data has ruled out this
              specific mechanism. The loop returns to the deepest level — the
              wrong-assumption identification step — and a new physical principle
              is needed.
            </p>
            <p className="text-muted/50 text-xs font-mono">
              Loop version: CVC-1.0 · Data vintage: DESI DR1 (2024) ·
              DESI DR2 released 2025-03-19 — not yet incorporated
            </p>
          </div>
        </section>

        {/* Prediction Lock */}
        <section className="mb-16">
          <div className="rounded-2xl border border-emerald-700/30 bg-emerald-950/10 p-8">
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-emerald-400 mb-2">
                  DR1-vintage prediction — recorded {new Date("2026-04-21").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <h2 className="text-xl font-bold">DESI DR2 Falsification Test</h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full border border-emerald-700/40 text-emerald-400 flex-shrink-0">
                DR2 not yet incorporated
              </span>
            </div>

            <p className="text-sm text-muted leading-relaxed mb-6">
              This prediction is derived from DESI DR1 only. DESI DR2 was released on
              2025-03-19 (arXiv:2503.14738) but is <strong>not yet incorporated</strong>
              here; re-evaluating this DR1-vintage prediction against DR2 is outstanding
              work, and DR2 has shifted the (w₀, wₐ) central values.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  label: "CVC falsification criterion",
                  value: "wₐ / (1 + w₀) ≈ +3",
                  note: "to within 1σ of DR2 measurement",
                  color: "emerald",
                },
                {
                  label: "Theory version tested",
                  value: "CVC-1.0",
                  note: "ρ_Λ(H) = ρ_Λ₀ + 3νM_P²(H²−H₀²)/8π",
                  color: "violet",
                },
                {
                  label: "Predicted w₀ range",
                  value: "−0.73 to −0.97",
                  note: "on the CVC ray, depending on ν",
                  color: "slate",
                },
                {
                  label: "Predicted wₐ range",
                  value: "+0.09 to +0.81",
                  note: "wₐ = +3(1+w₀) constraint",
                  color: "slate",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-surface-light bg-surface/60 p-5">
                  <p className="text-xs font-mono text-muted/60 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-base font-bold font-mono text-foreground mb-1">{item.value}</p>
                  <p className="text-xs text-muted/50">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-surface/40 border border-surface-light/40 p-5">
              <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider mb-3">
                Verdict conditions
              </p>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex gap-3">
                  <span className="text-emerald-400 flex-shrink-0">✓</span>
                  <span className="text-muted">
                    <span className="text-foreground">Confirmed</span>: DR2 best-fit (w₀, wₐ) lies within 1σ of the CVC ray wₐ = +3(1+w₀)
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400 flex-shrink-0">~</span>
                  <span className="text-muted">
                    <span className="text-foreground">Needs revision</span>: DR2 point is 1–3σ off the ray — CVC-2.0 (H⁴ term) is invoked
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-400 flex-shrink-0">✗</span>
                  <span className="text-muted">
                    <span className="text-foreground">Falsified</span>: DR2 point is more than 3σ off the CVC ray — the mechanism is wrong
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs font-mono text-muted/40 mt-5">
              Data vintage: DESI DR1 (arXiv:2404.03002) · Recorded: 2026-04-21 ·
              DESI DR2 released 2025-03-19 (arXiv:2503.14738), not yet incorporated
            </p>
          </div>
        </section>
      </div>

      <footer className="px-6 py-8 border-t border-surface-light text-center text-sm text-muted mt-auto">
        <p>
          Imagined Cosmos — an{" "}
          <a href="https://github.com/ImaginedCosmos/imagined-cosmos" className="text-accent hover:underline">
            open-source reproduction
          </a>{" "}
          project
        </p>
      </footer>
    </div>
  );
}
