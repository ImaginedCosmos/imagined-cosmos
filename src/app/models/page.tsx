import type { Metadata } from "next";
import Link from "next/link";
import ChapterNav from "@/components/ChapterNav";
import WoWaPlane from "@/components/WoWaPlane";

export const metadata: Metadata = {
  title: "Why Existing Solutions Fall Short — Imagined Cosmos",
  description:
    "SUSY, quintessence, anthropic principle, modified gravity — why every proposed solution to the cosmological constant problem is incomplete, and what a real solution must do differently.",
  openGraph: {
    title: "Why Existing Solutions Fall Short — Imagined Cosmos",
    description:
      "SUSY, quintessence, anthropic principle, modified gravity — why every proposed solution to the cosmological constant problem is incomplete, and what a real solution must do differently.",
    url: "https://cosmos.scheduler-systems.com/models",
  },
  twitter: {
    title: "Why Existing Solutions Fall Short — Imagined Cosmos",
    description:
      "SUSY, quintessence, anthropic principle, modified gravity — why every proposed solution to the cosmological constant problem is incomplete, and what a real solution must do differently.",
  },
};

interface Model {
  name: string;
  idea: string;
  right: string[];
  breaks: string[];
  status: "ruled out" | "incomplete" | "not science" | "active";
}

const MODELS: Model[] = [
  {
    name: "ΛCDM — The Standard Model That Explains Nothing",
    idea:
      "Add Λ as a free parameter to the Friedmann equations and fit its value to observations. Accept that we don't know where it comes from.",
    right: [
      "Fits every cosmological observation to extraordinary precision",
      "Only six free parameters describe the entire observable universe",
      "Predicted CMB anisotropies later confirmed by WMAP and Planck",
    ],
    breaks: [
      "Λ has no theoretical explanation — it is a number we measured, not derived",
      "Does not address why ρ_vac(obs) / ρ_vac(QFT) = 10⁻¹²¹",
      "The coincidence problem: why does Λ dominate precisely at z ≈ 0.3?",
      "DESI DR1 hints w ≠ −1 — if confirmed, ΛCDM is observationally wrong",
    ],
    status: "incomplete",
  },
  {
    name: "Supersymmetry",
    idea:
      "Every boson has a fermion superpartner. Their vacuum energy contributions have opposite signs and cancel. The residual is much smaller than the bare QFT prediction.",
    right: [
      "Reduces the discrepancy: cancels contributions up to the SUSY breaking scale",
      "Motivated independently by gauge coupling unification and the hierarchy problem",
      "Elegant mathematical structure",
    ],
    breaks: [
      "SUSY must be broken in our universe — broken SUSY still leaves ρ_vac ∼ M_SUSY⁴",
      "For M_SUSY ∼ 1 TeV (electroweak scale), residual is still 10⁶⁰ times too large",
      "LHC has found no SUSY particles up to ∼1–2 TeV — the preferred range",
      "Even perfect SUSY cancellation at known scales leaves ∼60 orders of magnitude unexplained",
    ],
    status: "incomplete",
  },
  {
    name: "Quintessence — Dynamical Scalar Fields",
    idea:
      "Replace Λ with a slowly rolling scalar field φ with potential V(φ). The field's kinetic and potential energy mimic dark energy, with w(z) ≠ −1 in general.",
    right: [
      "Naturally produces w ≠ −1 — matches the DESI 2024 DR1 signal",
      "Tracker solutions exist: φ evolves toward the observed value from a wide range of initial conditions",
      "Avoids the coincidence problem if the tracker attractor is efficient",
    ],
    breaks: [
      "Does not solve the 10¹²¹ problem — just replaces Λ with V₀(φ)",
      "Still requires V₀ to be tuned to 10⁻⁴⁷ GeV⁴ — why is the potential so flat?",
      "Requires a light scalar with m_φ ∼ H₀ ∼ 10⁻³³ eV — no particle physics motivation",
      "Coupling to Standard Model fields must be suppressed to avoid fifth-force violations",
    ],
    status: "active",
  },
  {
    name: "The Anthropic Principle / String Landscape",
    idea:
      "String theory predicts ∼10⁵⁰⁰ vacua with different values of Λ. Observers can only exist where Λ is small enough for galaxies to form. We observe small Λ because we're here.",
    right: [
      "Weinberg 1987 correctly predicted Λ would be non-zero before it was measured",
      "Provides an order-of-magnitude argument for why Λ ≠ 0 but Λ ≪ Λ_QFT",
      "Takes seriously that the fundamental constants may not be uniquely determined",
    ],
    breaks: [
      "Not a dynamical explanation — no mechanism selects our vacuum",
      "Makes no testable predictions beyond the range of Λ we already know",
      "Requires accepting a multiverse for which there is no direct evidence",
      "Explains the coincidence problem only if the measure over vacua is precisely defined — which it isn't",
    ],
    status: "not science",
  },
  {
    name: "Modified Gravity — f(R), Galileons, DGP",
    idea:
      "Modify the Einstein–Hilbert action by replacing R with f(R) or adding higher-derivative terms. Late-time cosmic acceleration emerges without any dark energy component.",
    right: [
      "Avoids introducing dark energy entirely — acceleration is geometric",
      "f(R) can exactly reproduce the ΛCDM expansion history",
      "Makes distinctive predictions for structure growth — testable with future surveys",
    ],
    breaks: [
      "Requires chameleon or Vainshtein mechanisms to hide modifications in the solar system",
      "Gravitational wave speed constraint (GW170817): many models ruled out",
      "Does not explain the coincidence problem — why does modification kick in now?",
      "The 10¹²¹ vacuum energy problem remains entirely unaddressed",
    ],
    status: "active",
  },
  {
    name: "Unimodular Gravity / Vacuum Energy Sequestering",
    idea:
      "In unimodular gravity, the determinant of the metric is fixed: det(g) = 1. This decouples vacuum energy from the gravitational field equations — Λ becomes an integration constant.",
    right: [
      "Vacuum energy from QFT does not source curvature — the 10¹²¹ discrepancy dissolves",
      "GR is recovered in the classical limit",
      "Sequestering variants extend this to loop corrections",
    ],
    breaks: [
      "Λ as integration constant still needs a value — why is it 10⁻⁴⁷ GeV⁴ and not zero?",
      "Moves the problem: trading a fine-tuning for a boundary condition with no dynamical origin",
      "Coincidence problem not addressed",
      "Predicts w = −1 exactly — in tension with DESI hint",
    ],
    status: "incomplete",
  },
];

const STATUS_STYLE = {
  "ruled out": "text-red-400 bg-red-900/20",
  incomplete: "text-amber-400 bg-amber-900/20",
  "not science": "text-orange-400 bg-orange-900/20",
  active: "text-emerald-400 bg-emerald-900/20",
};

export default function ModelsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ChapterNav current="models" />

      <div className="max-w-4xl mx-auto w-full px-6 py-16">
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Reference
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Why Existing Solutions Fall Short
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            Six decades of attempts at the cosmological constant problem. Each
            approach captures something real — and each runs into a wall. Understanding
            where they fail is the prerequisite for understanding what a solution
            must do differently.
          </p>
        </header>

        {/* WoWaPlane */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-3">The Observational Target</h2>
          <p className="text-muted mb-6 leading-relaxed text-sm">
            Any viable dark energy theory must place its prediction inside the DESI
            2024 confidence region — or explain why the deviation from Λ is a
            systematic artifact. The cosmological constant sits at (−1, 0); DESI
            excludes it at 2.5–3.9σ.
          </p>
          <WoWaPlane />
        </section>

        {/* Models */}
        <div className="space-y-8">
          {MODELS.map((model) => (
            <section
              key={model.name}
              className="rounded-2xl border border-surface-light bg-surface overflow-hidden"
            >
              <div className="px-7 py-6 border-b border-surface-light flex items-start justify-between gap-4 flex-wrap">
                <h2 className="text-xl font-bold leading-snug">{model.name}</h2>
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[model.status]}`}
                >
                  {model.status}
                </span>
              </div>

              <div className="px-7 py-5 space-y-5">
                <div>
                  <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
                    The idea
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{model.idea}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                      What it gets right
                    </p>
                    <ul className="space-y-1.5">
                      {model.right.map((r) => (
                        <li key={r} className="flex gap-2 text-xs text-muted leading-relaxed">
                          <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
                      Where it breaks down
                    </p>
                    <ul className="space-y-1.5">
                      {model.breaks.map((b) => (
                        <li key={b} className="flex gap-2 text-xs text-muted leading-relaxed">
                          <span className="text-red-500 flex-shrink-0 mt-0.5">✗</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* What's needed */}
        <section className="mt-16 rounded-2xl border border-accent-dim/40 bg-accent-dim/5 p-8">
          <h2 className="text-2xl font-bold mb-5">What a Real Solution Must Do</h2>
          <div className="space-y-3">
            {[
              "Suppress or reinterpret the QFT vacuum energy without fine-tuning — not just rename the parameter",
              "Explain the coincidence problem dynamically — not as an accident, not anthropically",
              "Predict w(z) consistent with DESI 2024: w₀ ≈ −0.73, wₐ ≈ −1.05, or explain the deviation",
              "Address the 5σ Hubble tension without introducing larger inconsistencies",
              "Recover GR in the solar system and match binary pulsar timing",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-accent-dim/30 flex items-center justify-center text-xs font-mono text-accent flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              href="/solution"
              className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg bg-accent/20 text-violet-300 hover:bg-accent/30 transition-colors"
            >
              Chapter 04: The Solution →
            </Link>
            <Link
              href="/papers"
              className="inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg border border-surface-light text-muted hover:border-accent-dim hover:text-foreground transition-colors"
            >
              Read the literature →
            </Link>
          </div>
        </section>
      </div>

      <footer className="px-6 py-10 border-t border-surface-light text-center text-sm text-muted mt-auto">
        <p>
          Imagined Cosmos — a{" "}
          <a href="https://scheduler-systems.com" className="text-accent hover:underline">
            Scheduler Systems
          </a>{" "}
          project
        </p>
      </footer>
    </div>
  );
}
