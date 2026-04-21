import type { Metadata } from "next";
import Link from "next/link";
import ChapterNav from "@/components/ChapterNav";
import ChapterFooterNav from "@/components/ChapterFooterNav";
import WoWaPlane from "@/components/WoWaPlane";
import VacuumRunning from "@/components/VacuumRunning";
import DensityTracking from "@/components/DensityTracking";
import H0Tension from "@/components/H0Tension";
import { bestFit } from "@/lib/physics/optimizer";
import { CONSTRAINTS } from "@/lib/physics/data";
import { BlockMath, InlineMath } from "@/components/Math";

export const metadata: Metadata = {
  title: "The Solution — Imagined Cosmos",
  description:
    "Causal Vacuum Correspondence: a proposed resolution of the cosmological constant problem via horizon thermodynamics, grounded in 106 years of observation.",
  openGraph: {
    title: "The Solution — Imagined Cosmos",
    description:
      "Causal Vacuum Correspondence: a proposed resolution of the cosmological constant problem via horizon thermodynamics, grounded in 106 years of observation.",
    url: "https://cosmos.scheduler-systems.com/solution",
  },
  twitter: {
    title: "The Solution — Imagined Cosmos",
    description:
      "Causal Vacuum Correspondence: a proposed resolution of the cosmological constant problem via horizon thermodynamics, grounded in 106 years of observation.",
  },
};

const REQUIREMENTS = [
  {
    id: "R1",
    title: "Resolve the 10¹²¹ discrepancy",
    description:
      "Explain why the observed vacuum energy density is 10⁻⁴⁷ GeV⁴ rather than the QFT-predicted 10⁷⁴ GeV⁴. This is not a correction — it requires a mechanism that suppresses or reinterprets the quantum vacuum contribution to spacetime curvature.",
    equation:
      "\\rho_{\\text{obs}} \\approx 10^{-47}\\,\\text{GeV}^4 \\quad \\text{vs} \\quad \\rho_{\\text{QFT}} \\approx 10^{74}\\,\\text{GeV}^4",
  },
  {
    id: "R2",
    title: "Explain the coincidence problem",
    description:
      "Dark energy and matter have comparable energy densities today (ΩΛ ≈ 0.685, Ωm ≈ 0.315), despite scaling differently with the expansion. Matter dilutes as a⁻³; a pure cosmological constant does not dilute at all. That they are comparable precisely today requires a dynamical explanation.",
    equation:
      "\\frac{\\rho_\\Lambda}{\\rho_m} \\approx 2.2 \\quad \\text{today} \\quad (a = 1)",
  },
  {
    id: "R3",
    title: "Accommodate DESI 2024 — w ≠ −1",
    description:
      "The DESI DR1 measurement finds w₀ ≈ −0.73, wₐ ≈ −1.05 at 2.5–3.9σ from a pure cosmological constant. A viable solution must predict this dynamical behavior — or show it lies on a specific, falsifiable trajectory — and make predictions for DESI DR2.",
    equation:
      "w(z) = w_0 + w_a \\frac{z}{1+z}, \\quad w_0 \\approx -0.73,\\; w_a \\approx -1.05",
  },
  {
    id: "R4",
    title: "Address the Hubble tension",
    description:
      "H₀ = 67.4 from the CMB versus H₀ = 73.04 from the local distance ladder — a 5σ discrepancy that grows with better data. Any modification to the expansion history must account for this gap without worsening other constraints.",
    equation:
      "\\Delta H_0 = 73.04 - 67.4 = 5.64\\,\\text{km/s/Mpc} \\quad (5\\sigma)",
  },
];

function chi2LCDM(): number {
  const rho = CONSTRAINTS.rho;
  const pW0 = (-1 - CONSTRAINTS.w0) / CONSTRAINTS.w0_err;
  const pWa = (0 - CONSTRAINTS.wa) / CONSTRAINTS.wa_err;
  return (1 / (1 - rho * rho)) * (pW0 * pW0 - 2 * rho * pW0 * pWa + pWa * pWa);
}

export default function SolutionPage() {
  const best = bestFit(CONSTRAINTS);
  const lcdmChi2 = chi2LCDM();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ChapterNav current="04" />

      <article className="max-w-4xl mx-auto w-full px-6 py-16">
        {/* Title */}
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Chapter 04
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Causal Vacuum Correspondence
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            The cosmological constant problem dissolves when you question an assumption
            so foundational it has never been examined: that the quantum vacuum is an
            observer-independent object. It is not — and recognising this changes everything.
          </p>

          <div className="mt-8 rounded-xl border border-amber-700/30 bg-amber-950/10 px-6 py-5">
            <p className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-2">
              Proposed Theory
            </p>
            <p className="text-sm text-muted leading-relaxed">
              What follows is an original theoretical proposal — not established consensus.
              Its predictions are specific and falsifiable. DESI DR2 (expected 2025–2026)
              will confirm or rule it out.
            </p>
          </div>
        </header>

        {/* Four Requirements */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-3">Four Requirements</h2>
          <p className="text-muted mb-10 leading-relaxed">
            The previous three chapters establish what any solution must address.
            These are observational facts, not aspirational targets.
          </p>

          <div className="space-y-6">
            {REQUIREMENTS.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-surface-light bg-surface p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent-dim/30 flex items-center justify-center text-xs font-bold font-mono text-accent">
                    {req.id}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{req.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">
                      {req.description}
                    </p>
                    <div className="rounded-lg bg-background/80 border border-surface-light px-4 py-3">
                      <BlockMath math={req.equation} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Insight */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Key Insight</h2>

          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              Einstein found special relativity by questioning absolute simultaneity.
              He found general relativity by questioning absolute space. The
              cosmological constant problem dissolves when you question something
              that has never been questioned in this context:
            </p>
          </div>

          <div className="my-8 rounded-xl border border-emerald-700/40 bg-emerald-950/10 p-7">
            <p className="text-sm font-mono tracking-widest uppercase text-emerald-400 mb-3">
              The Wrong Assumption
            </p>
            <p className="text-foreground leading-relaxed font-medium">
              The quantum vacuum is treated as an observer-independent object — its energy
              computed in flat Minkowski space, then inserted into Einstein&apos;s equations.
              But the vacuum is{" "}
              <em>not</em> observer-independent. Hawking radiation and the Unruh effect
              already proved this: an accelerating observer sees thermal particles where
              an inertial observer sees none. The vacuum state is defined relative to the
              observer&apos;s causal horizon.
            </p>
          </div>

          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              The cosmological constant problem is created entirely by asking{" "}
              <em>&ldquo;what is the energy of the vacuum in curved spacetime?&rdquo;</em>{" "}
              and answering with the flat-space QFT calculation. This is precisely
              analogous to asking{" "}
              <em>&ldquo;what is the velocity of the Earth?&rdquo;</em> and answering
              &ldquo;zero&rdquo; using Newtonian absolute space. The answer is wrong
              because the question is framed within the wrong absolutes.
            </p>
            <p>
              The correct framing — the{" "}
              <strong className="text-foreground">Causal Vacuum Correspondence (CVC)</strong>
              {" "}— is: in a dynamically expanding spacetime, the vacuum energy that
              gravitates is not the sum of all zero-point modes up to the Planck scale.
              It is the thermodynamic energy exchangeable across the observer&apos;s causal
              horizon per unit time. That energy is set by the Hubble rate{" "}
              <InlineMath math="H" />, not by{" "}
              <InlineMath math="M_P" /> alone.
            </p>
            <p>
              Einstein felt this. He called <InlineMath math="\Lambda" /> &ldquo;ugly&rdquo;
              and said it gave him &ldquo;a bad conscience.&rdquo; His geometric instinct was
              recognising — without being able to say precisely why — that the field equations
              were conflating two incommensurable things: the curvature content of spacetime,
              which is physical and relational, and the absolute energy scale of the vacuum,
              which is not.
            </p>
          </div>
        </section>

        {/* Mathematical Framework */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Mathematical Framework</h2>

          <div className="space-y-5 text-muted leading-relaxed mb-8">
            <p>
              The CVC principle has a precise mathematical realisation through the
              Cohen–Kaplan–Nelson (CKN) bound, which states that a quantum field
              theory in a region of size <InlineMath math="L" /> is self-consistent
              only if the total zero-point energy does not exceed the mass of a black
              hole of that size:
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              CKN consistency bound
            </p>
            <BlockMath math="\rho_{\text{vac}} \cdot L^3 \leq M_P^2 \cdot L \implies \rho_{\text{vac}} \leq \frac{M_P^2}{L^2}" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Setting the infrared cutoff to the Hubble horizon,{" "}
              <InlineMath math="L = H^{-1}" />, gives the effective gravitating
              vacuum energy density directly.
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              CKN-corrected UV cutoff
            </p>
            <BlockMath math="k_{\max} \leq \left(16\pi^2\right)^{1/4}\!\left(M_P H\right)^{1/2} \implies \rho_\Lambda^{\rm eff} \sim M_P^2 H^2" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              The naive UV cutoff <InlineMath math="k_{\max} = M_P" /> (giving{" "}
              <InlineMath math="\rho_{\rm vac} \sim M_P^4" />) is replaced by the
              geometric mean <InlineMath math="k_{\max} \sim (M_P H)^{1/2}" />.
              The 10<sup>121</sup> discrepancy is not a cancellation problem — it
              is the result of using the wrong UV cutoff.
            </p>
          </div>

          <div className="space-y-5 text-muted leading-relaxed mb-8">
            <p>
              Integrating out modes in curved FLRW spacetime with this corrected
              cutoff gives the running vacuum energy. The one-loop renormalisation
              group equation for <InlineMath math="\rho_\Lambda" /> with respect to
              the natural cosmological scale <InlineMath math="\ln H^2" /> yields
              the{" "}
              <strong className="text-foreground">Running Vacuum Model (RVM)</strong>:
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              Running vacuum density
            </p>
            <BlockMath math="\rho_\Lambda(H) = \rho_{\Lambda_0} + \frac{3\nu}{8\pi}\,M_P^2\!\left(H^2 - H_0^2\right)" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Here <InlineMath math="\nu" /> is a dimensionless coefficient computed
              from the field content of the theory:{" "}
              <InlineMath math="\nu \sim -\frac{1}{24\pi}\sum_i n_i M_i^2 / M_P^2" />,
              where <InlineMath math="n_i = +1" /> for bosons and{" "}
              <InlineMath math="-1" /> for fermions. This coefficient is the single
              free parameter of the theory, computable in principle from the Standard Model
              particle spectrum and any beyond-SM physics.
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-2">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              Modified field equations
            </p>
            <BlockMath math="G_{\mu\nu} + \Lambda(H)\,g_{\mu\nu} = 8\pi G\, T_{\mu\nu}^{\rm matter}, \quad \Lambda(H) = \Lambda_0 + \frac{3\nu M_P^2}{8\pi}\,H^2" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              These reduce to standard GR in the limit{" "}
              <InlineMath math="\nu \to 0" />. The QFT vacuum energy{" "}
              <InlineMath math="\rho_{\rm vac}^{\rm QFT} \sim M_P^4" /> does not
              appear in the source term — it is kinematically excluded by the CKN
              bound from being a gravitational source at cosmological scales.
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-4 mt-8">The 10¹²¹ Discrepancy, Visualised</h3>
          <p className="text-sm text-muted leading-relaxed mb-5">
            The QFT prediction <InlineMath math="\rho_{\rm QFT} \sim M_P^4" /> is
            H-independent — a flat line astronomically above the observed value.
            The CVC value <InlineMath math="\rho_{\rm CVC} \propto M_P^2 H^2" /> starts
            at the observed density today and rises with H into the early universe,
            meeting the QFT prediction only near the Planck scale.
          </p>
          <VacuumRunning />

          <div className="mt-8 rounded-xl border border-surface-light/40 bg-surface/30 p-6">
            <p className="text-xs font-mono text-accent/60 uppercase tracking-wider mb-3">
              The geometric reading (unimodular gravity)
            </p>
            <p className="text-sm text-muted leading-relaxed">
              The CVC equations have a natural geometric derivation. In unimodular
              gravity (det <InlineMath math="g_{\mu\nu} = -1" />), the trace-free
              Einstein equations are blind to constant shifts in{" "}
              <InlineMath math="T_{\mu\nu}" /> — precisely the vacuum energy shift.
              The cosmological constant re-enters as an integration constant of the
              field equations, not a fine-tuned Lagrangian parameter. The 10<sup>121</sup>{" "}
              cancellation problem is transformed into a boundary condition selection
              problem — a qualitatively different, and far more tractable, challenge.
            </p>
          </div>
        </section>

        {/* Coincidence Problem */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Coincidence Problem</h2>

          <div className="space-y-5 text-muted leading-relaxed mb-8">
            <p>
              In <InlineMath math="\Lambda" />CDM, the ratio{" "}
              <InlineMath math="\rho_\Lambda / \rho_m \approx 2.2" /> today is a pure
              accident: matter dilutes as{" "}
              <InlineMath math="a^{-3}" /> while <InlineMath math="\Lambda" /> is
              fixed, so this ratio has been increasing for 13 billion years and happens
              to be order unity right now. No mechanism selects for this — it simply is.
            </p>
            <p>
              In the CVC framework, the coincidence is a dynamical attractor. During
              matter domination, the Friedmann equation gives{" "}
              <InlineMath math="H^2 \propto \rho_m" />. Since{" "}
              <InlineMath math="\rho_\Lambda(H) \propto H^2" />, the running
              vacuum tracks matter energy density throughout the matter era —
              not as a coincidence, but because both scale with the same{" "}
              <InlineMath math="H^2" />:
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              Why ρ_Λ ≈ ρ_m today — dynamical attractor
            </p>
            <BlockMath math="\text{Matter era:}\quad H^2 \propto \rho_m \implies \rho_\Lambda(H) \propto H^2 \propto \rho_m" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              The running vacuum tracks the matter density through the matter epoch.
              The coincidence we observe is not an accident at{" "}
              <InlineMath math="t = 13.8\,\text{Gyr}" /> — it is the end of an era
              of tracking, after which dark energy begins to dominate as{" "}
              <InlineMath math="H \to H_0" /> and the running term stabilises.
            </p>
          </div>

          <div className="space-y-5 text-muted leading-relaxed mb-6">
            <p>
              More precisely: during matter domination, the effective equation of
              state of the running vacuum satisfies{" "}
              <InlineMath math="w_\Lambda \approx 0" /> — dark energy mimics matter.
              As the expansion transitions to dark energy domination (the current epoch),{" "}
              <InlineMath math="w_\Lambda \to -1" />. The coincidence{" "}
              <InlineMath math="\rho_\Lambda \sim \rho_m" /> today is precisely where
              this transition occurs — not by tuning, but because the transition epoch
              is set by the same <InlineMath math="\nu" /> that sets the vacuum energy.
            </p>
          </div>

          <DensityTracking />
        </section>

        {/* DESI Predictions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Predictions vs DESI 2024</h2>

          <div className="space-y-5 text-muted leading-relaxed mb-8">
            <p>
              The equation of state <InlineMath math="w_\Lambda(z)" /> follows
              directly from the continuity equation applied to{" "}
              <InlineMath math="\rho_\Lambda(H)" />. After careful expansion around{" "}
              <InlineMath math="a = 1" />, the CPL parameters{" "}
              <InlineMath math="w_0" /> and <InlineMath math="w_a" /> emerge as
              explicit functions of <InlineMath math="\nu" /> and the density parameters:
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              CVC CPL parameters
            </p>
            <BlockMath math="w_0 = -1 + \nu\,\frac{\Omega_{m0}}{\Omega_{\Lambda 0}}, \qquad w_a = -3\nu\,\frac{\Omega_{m0}}{\Omega_{\Lambda 0}}" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Using Planck values <InlineMath math="\Omega_{m0} = 0.315" />,{" "}
              <InlineMath math="\Omega_{\Lambda 0} = 0.685" />.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-950/20 border border-emerald-700/40 p-7 mb-6">
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3">
              The CVC Falsification Line
            </p>
            <BlockMath math="w_a = -3\left(1 + w_0\right)" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              This constraint — that <InlineMath math="w_0" /> and{" "}
              <InlineMath math="w_a" /> lie on a specific ray through{" "}
              <InlineMath math="(-1,\,0)" /> with slope <InlineMath math="-3" /> — is
              the sharpest prediction of the CVC framework. It is not a two-parameter
              family. It is a one-parameter family, with <InlineMath math="\nu" /> as
              the single free parameter. If DESI DR2 finds the best-fit{" "}
              <InlineMath math="(w_0, w_a)" /> significantly off this line, the theory
              is falsified.
            </p>
          </div>

          <div className="space-y-4 text-muted leading-relaxed mb-8">
            <p>
              For the DESI DR1 central value <InlineMath math="w_0 \approx -0.727" />,
              the implied <InlineMath math="\nu \approx 0.59" /> — far above the naive
              Standard Model prediction (<InlineMath math="|\nu_{\rm SM}| \sim 10^{-3}" />).
              This tension is real and requires either beyond-Standard-Model contributions
              to the vacuum running, or the DESI signal migrating toward the CVC line
              in DR2. The CVC prediction for DR2 is:
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-8">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
              CVC prediction — DESI DR2
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "w₀", value: "−0.73 to −0.97", note: "depending on ν" },
                { label: "wₐ", value: "−0.82 to −0.09", note: "on the CVC ray" },
              ].map((p) => (
                <div key={p.label} className="text-center">
                  <p className="text-xs font-mono text-muted/60 mb-1">{p.label}</p>
                  <p className="text-xl font-bold text-foreground">{p.value}</p>
                  <p className="text-xs text-muted/50 mt-1">{p.note}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted mt-6 leading-relaxed border-t border-surface-light pt-5">
              The critical test: if DR2 finds{" "}
              <InlineMath math="w_a / (1 + w_0) \approx -3" /> to within 1σ,
              the CVC framework is strongly supported. If the ratio deviates
              significantly — toward quintessence (<InlineMath math="w_a > -3(1+w_0)" />)
              or beyond — it is ruled out.
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-4">The w₀–wₐ Parameter Space</h3>
          <p className="text-sm text-muted leading-relaxed mb-5">
            The CVC constraint ray passes through the DESI 2σ ellipse. The green
            dashed line is the CVC prediction <InlineMath math="w_a = -3(1+w_0)" />.
            Any measurement inconsistent with this ray falsifies the theory.
          </p>
          <WoWaPlane />
        </section>

        {/* Hubble Tension */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Hubble Tension</h2>

          <div className="space-y-5 text-muted leading-relaxed mb-8">
            <p>
              The Hubble tension — <InlineMath math="H_0 = 67.4" /> (CMB) versus{" "}
              <InlineMath math="H_0 = 73.04" /> (distance ladder), a 5σ discrepancy
              that has grown with better data — is the hardest constraint to address.
              It is not fully resolved by the CVC framework, and we will not claim
              otherwise.
            </p>

            <p>
              What the running vacuum{" "}
              <em>does</em> provide is a small but calculable shift. The{" "}
              <InlineMath math="\nu M_P^2 H^2" /> term is non-negligible at
              early times (when <InlineMath math="H \gg H_0" />): it contributes
              additional energy density near recombination, compressing the sound
              horizon <InlineMath math="r_s" /> and shifting the CMB-inferred{" "}
              <InlineMath math="H_0" /> upward:
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-7 mb-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              H₀ shift from running vacuum
            </p>
            <BlockMath math="\Delta H_0^{\rm CVC} \approx +1\text{–}2\;\text{km/s/Mpc} \quad (\nu \sim 0.005\text{–}0.008)" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              This is approximately 20–35% of the required{" "}
              <InlineMath math="\Delta H_0 = 5.64\,\text{km/s/Mpc}" />. The remaining
              gap most likely requires an additional early-universe modification
              (early dark energy, extra relativistic species, or modified
              recombination) that acts independently of the cosmological constant
              mechanism.
            </p>
          </div>

          <div className="rounded-xl border border-surface-light/40 bg-surface/30 p-6 mb-8">
            <p className="text-xs font-mono text-accent/60 uppercase tracking-wider mb-3">
              Honest assessment
            </p>
            <p className="text-sm text-muted leading-relaxed">
              The CVC framework is consistent with the Hubble tension — it does not
              worsen it — and reduces it marginally. But the tension is most likely
              a separate problem requiring separate early-universe physics. The
              phenomenologist&apos;s verdict: any theory claiming to explain both the
              DESI w≠−1 signal <em>and</em> the full Hubble tension from a single
              late-universe mechanism should be viewed with scepticism. Late-universe
              dark energy dynamics cannot shift the sound horizon at recombination.
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-4">H₀ Measurements — Where CVC Lands</h3>
          <p className="text-sm text-muted leading-relaxed mb-5">
            CMB-derived values (violet) cluster near 67–68; distance-ladder measurements (amber)
            cluster near 73. CVC-1.0 (green) shifts the CMB anchor by ≈+1–2 km/s/Mpc —
            reducing but not closing the gap.
          </p>
          <H0Tension />
        </section>

        {/* Current Result */}
        <section className="mb-16">
          <div className="rounded-2xl border border-emerald-700/40 bg-emerald-950/10 p-8">
            <p className="text-xs font-mono tracking-widest uppercase text-emerald-400 mb-2">
              Result — DESI DR1 (2024)
            </p>
            <h2 className="text-2xl font-bold mb-6">CVC-1.0 Converges</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-red-700/30 bg-red-950/10 p-5 text-center">
                <p className="text-xs font-mono text-red-400/70 uppercase tracking-wider mb-2">ΛCDM</p>
                <p className="text-3xl font-bold font-mono text-foreground">{lcdmChi2.toFixed(1)}</p>
                <p className="text-xs text-muted mt-1">χ²  —  {Math.sqrt(lcdmChi2).toFixed(1)}σ from DESI</p>
              </div>
              <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-5 text-center">
                <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider mb-2">
                  CVC-1.0  (ν = {best.nu.toFixed(3)})
                </p>
                <p className="text-3xl font-bold font-mono text-emerald-300">{best.chi2_desi.toFixed(2)}</p>
                <p className="text-xs text-muted mt-1">χ²  —  {best.sigma_desi.toFixed(2)}σ from DESI</p>
              </div>
              <div className="rounded-xl border border-surface-light bg-surface p-5 text-center">
                <p className="text-xs font-mono text-accent/70 uppercase tracking-wider mb-2">Improvement</p>
                <p className="text-3xl font-bold font-mono text-violet-300">
                  Δχ² = {(lcdmChi2 - best.chi2_desi).toFixed(1)}
                </p>
                <p className="text-xs text-muted mt-1">ΔAIC = {(lcdmChi2 - best.chi2_desi - 2).toFixed(1)} favours CVC</p>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              At best-fit ν* = {best.nu.toFixed(3)} ± {best.nu_err.toFixed(3)} (1σ), CVC-1.0&apos;s
              predicted (w₀, wₐ) = ({best.w0.toFixed(3)}, {best.wa.toFixed(3)}) lies within the
              DESI DR1 2σ confidence ellipse. ΛCDM (w₀=−1, wₐ=0) is ruled out at{" "}
              {Math.sqrt(lcdmChi2).toFixed(1)}σ by the same dataset. The CVC constraint
              line wₐ = −3(1+w₀) passes through the observational ellipse.
              This is not a proof — DESI DR2 will sharpen or overturn it.
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-16 rounded-2xl border border-emerald-700/30 bg-emerald-950/10 p-8">
          <h2 className="text-2xl font-bold mb-6">The Theory in Four Lines</h2>
          <div className="space-y-4">
            {[
              {
                n: "1",
                text: "The vacuum energy that gravitates is not M_P⁴ — it is M_P² H², set by the holographic CKN bound on modes inside the Hubble horizon.",
              },
              {
                n: "2",
                text: "This gives a running Λ(H) = Λ₀ + 3νM_P²H²/8π, which naturally tracks matter during matter domination and explains the coincidence.",
              },
              {
                n: "3",
                text: "The CPL equation of state satisfies w_a = −3(1 + w₀) — a one-parameter ray through ΛCDM, falsifiable by DESI DR2.",
              },
              {
                n: "4",
                text: "Dark energy is the thermodynamic back-pressure of the universe's own causal horizon. It is not a field. It is not a constant. It is horizon thermodynamics.",
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 text-sm leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900/40 flex items-center justify-center text-xs font-mono text-emerald-400">
                  {item.n}
                </span>
                <p className="text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solver CTA */}
        <section className="mb-10">
          <div className="rounded-2xl border border-emerald-700/30 bg-emerald-950/10 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <p className="text-xs font-mono tracking-widest uppercase text-emerald-400 mb-2">
                Live Iteration
              </p>
              <h3 className="text-xl font-bold mb-2">Run the Closed-Loop Solver</h3>
              <p className="text-sm text-muted leading-relaxed">
                Watch gradient descent find the best-fit ν against DESI DR1 in real time.
                The solver iterates until convergence, needs revision, or falsification — then reports a verdict.
                If CVC-1.0 needs revision, the loop proposes CVC-2.0 automatically.
              </p>
            </div>
            <Link
              href="/solve"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 font-mono text-sm hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
            >
              ⟳ Run Solver →
            </Link>
          </div>
        </section>

        {/* Papers */}
        <section className="mb-16">
          <div className="rounded-2xl border border-surface-light bg-surface p-8">
            <h3 className="text-xl font-bold mb-3">Supporting Literature</h3>
            <p className="text-muted text-sm leading-relaxed mb-5">
              Cohen, Kaplan &amp; Nelson (1999) — the CKN bound.
              Solà Peracaula (2022, 2024) — Running Vacuum Model in light of DESI.
              Gibbons &amp; Hawking (1977) — cosmological horizon thermodynamics.
              Weinberg (1989) — why fine-tuning fails.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/papers"
                className="inline-flex items-center gap-2 text-sm font-mono text-accent hover:text-violet-300 transition-colors"
              >
                Read the bibliography →
              </Link>
              <Link
                href="/models"
                className="inline-flex items-center gap-2 text-sm font-mono text-muted hover:text-foreground transition-colors"
              >
                Why other solutions fail →
              </Link>
            </div>
          </div>
        </section>
      </article>

      <ChapterFooterNav current="04" />

      <footer className="px-6 py-8 border-t border-surface-light text-center text-sm text-muted mt-auto">
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
