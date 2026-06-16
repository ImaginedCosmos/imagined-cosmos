import type { Metadata } from "next";
import Link from "next/link";
import { BlockMath, InlineMath } from "@/components/Math";
import VacuumEnergyComparison from "@/components/VacuumEnergyComparison";
import ChapterNav from "@/components/ChapterNav";
import ChapterFooterNav from "@/components/ChapterFooterNav";

export const metadata: Metadata = {
  title: "The Cosmological Constant Problem — Imagined Cosmos",
  description:
    "The worst prediction in physics: why quantum field theory disagrees with observation by 120 orders of magnitude, and what it means for our understanding of the universe.",
  openGraph: {
    title: "The Cosmological Constant Problem — Imagined Cosmos",
    description:
      "The worst prediction in physics: why quantum field theory disagrees with observation by 120 orders of magnitude, and what it means for our understanding of the universe.",
    url: "https://imagined-cosmos.example.com/cosmological-constant",
  },
  twitter: {
    title: "The Cosmological Constant Problem — Imagined Cosmos",
    description:
      "The worst prediction in physics: why quantum field theory disagrees with observation by 120 orders of magnitude, and what it means for our understanding of the universe.",
  },
};

export default function CosmologicalConstantPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ChapterNav current="02" />

      <article className="max-w-4xl mx-auto w-full px-6 py-16">
        {/* Title */}
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Chapter 02
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            The Cosmological Constant Problem
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            Quantum field theory predicts that empty space should have energy.
            General relativity says that energy curves spacetime. When you
            combine these two pillars of modern physics, you get an answer
            that&apos;s wrong by 120 orders of magnitude — the worst prediction
            in the history of science.
          </p>
        </header>

        {/* The Setup */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Setup</h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              Two of our most successful theories make a prediction together.
              Quantum field theory (QFT) tells us that the vacuum isn&apos;t
              empty — it&apos;s full of virtual particles constantly popping in
              and out of existence, each contributing energy. General relativity
              (GR) tells us that all forms of energy curve spacetime.
            </p>
            <p>
              The cosmological constant{" "}
              <InlineMath math="\Lambda" /> in Einstein&apos;s field equations is
              exactly this: the energy density of the vacuum. It should be
              calculable from first principles.
            </p>
          </div>
        </section>

        {/* The Prediction */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The QFT Prediction</h2>

          <div className="rounded-xl bg-surface border border-surface-light p-8 mb-6">
            <p className="text-sm font-mono text-accent mb-3">
              Vacuum energy from quantum field theory
            </p>
            <BlockMath math="\rho_{\text{vac}}^{\text{QFT}} \sim \frac{E_{\text{Planck}}^4}{\hbar^3 c^3} \sim 10^{74} \text{ GeV}^4" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Sum the zero-point energies of all quantum fields up to the Planck
              scale (<InlineMath math="E_P \approx 10^{19}" /> GeV). Each
              mode of each field contributes{" "}
              <InlineMath math="\frac{1}{2}\hbar\omega" />. The sum diverges,
              and when you cut it off at the Planck energy (the natural scale
              where quantum gravity should matter), you get a vacuum energy
              density of roughly{" "}
              <InlineMath math="10^{74} \text{ GeV}^4" />.
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-8 mb-6">
            <p className="text-sm font-mono text-accent mb-3">
              The zero-point energy sum
            </p>
            <BlockMath math="\rho_{\text{vac}} = \sum_{\text{fields}} \int_0^{k_{\text{max}}} \frac{d^3k}{(2\pi)^3} \frac{1}{2}\sqrt{k^2 + m^2}" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              This integral sums over all momenta{" "}
              <InlineMath math="k" /> up to a cutoff{" "}
              <InlineMath math="k_{\text{max}}" />, for every quantum field in
              the Standard Model. With{" "}
              <InlineMath math="k_{\text{max}} = M_{\text{Planck}}" />, the
              result is catastrophically large.
            </p>
          </div>
        </section>

        {/* The Observation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Observation</h2>

          <div className="rounded-xl bg-surface border border-surface-light p-8 mb-6">
            <p className="text-sm font-mono text-accent mb-3">
              Observed vacuum energy density (from Planck 2018)
            </p>
            <BlockMath math="\rho_{\text{vac}}^{\text{obs}} = \frac{\Lambda c^2}{8\pi G} \approx 10^{-47} \text{ GeV}^4" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Type Ia supernovae, the CMB, and baryon acoustic oscillations all
              independently point to the same answer:{" "}
              <InlineMath math="\Omega_\Lambda \approx 0.685" />, which
              translates to a vacuum energy density of about{" "}
              <InlineMath math="10^{-47} \text{ GeV}^4" />.
            </p>
          </div>
        </section>

        {/* The Discrepancy */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">
            The 10<sup>120</sup> Discrepancy
          </h2>

          <div className="rounded-xl bg-red-950/30 border border-red-900/50 p-8 mb-6">
            <BlockMath math="\frac{\rho_{\text{vac}}^{\text{QFT}}}{\rho_{\text{vac}}^{\text{obs}}} = \frac{10^{74}}{10^{-47}} = 10^{121}" />
            <p className="text-sm text-red-300 mt-4 leading-relaxed">
              The theoretical prediction overshoots the observed value by a
              factor of{" "}
              <InlineMath math="10^{121}" />. This isn&apos;t a factor of 2 or
              10. It&apos;s a 1 followed by 121 zeros. No other prediction in
              science has ever been this wrong.
            </p>
          </div>

          <VacuumEnergyComparison />
        </section>

        {/* Why It's Hard */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why This Is So Hard</h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              The naive reaction is: &ldquo;just subtract it off.&rdquo; Set the
              bare cosmological constant to cancel the vacuum energy exactly.
              This is called <strong>fine-tuning</strong>, and it requires
              adjusting a number to 121 decimal places.
            </p>
            <p>
              But it gets worse. Every time you add a new particle or phase
              transition (the QCD condensate, the Higgs mechanism, electroweak
              symmetry breaking), each shifts the vacuum energy by amounts that
              are individually enormous. The observed value requires all of these
              contributions to cancel to 121 digits — and then leave behind
              a tiny positive residual that just happens to be the right size to
              accelerate the universe today.
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-8 mt-6">
            <p className="text-sm font-mono text-accent mb-3">
              The fine-tuning required
            </p>
            <BlockMath math="\Lambda_{\text{bare}} + \rho_{\text{QCD}} + \rho_{\text{EW}} + \rho_{\text{Higgs}} + \cdots = 10^{-47} \text{ GeV}^4" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Each term on the left is of order{" "}
              <InlineMath math="10^{+8}" /> to{" "}
              <InlineMath math="10^{+74} \text{ GeV}^4" />. They must cancel
              to leave a result of order{" "}
              <InlineMath math="10^{-47}" />. This is like adding up a million
              numbers, each around{" "}
              <InlineMath math="10^{70}" />, and getting exactly 0.0000...001.
            </p>
          </div>
        </section>

        {/* Proposed Solutions */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold">Proposed Solutions</h2>
            <Link
              href="/models"
              className="text-xs font-mono text-accent hover:text-violet-300 transition-colors"
            >
              Why each falls short →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <SolutionCard
              number={1}
              title="Supersymmetry"
              status="Incomplete"
              description="SUSY partners have opposite-sign vacuum energy contributions, which could cancel the Standard Model contributions. But SUSY is broken in our universe, and broken SUSY still leaves a vacuum energy many orders of magnitude too large."
            />
            <SolutionCard
              number={2}
              title="The Anthropic Principle"
              status="Controversial"
              description="In a multiverse with different Λ values in each pocket universe, only universes with small Λ can form galaxies and observers. We observe a small Λ because we couldn't exist otherwise. Scientifically unsatisfying to many — it predicts nothing else."
            />
            <SolutionCard
              number={3}
              title="Quintessence"
              status="Active research"
              description="Replace Λ with a dynamical scalar field that slowly rolls to zero. Avoids fine-tuning by making Λ time-dependent. But you still need to explain why the field's potential is so flat — this is its own fine-tuning problem."
            />
            <SolutionCard
              number={4}
              title="Modified Gravity"
              status="Active research"
              description="Degravitate the vacuum: modify GR so that vacuum energy doesn't curve spacetime the way normal energy does. Examples include massive gravity and unimodular gravity. Challenging to make consistent with observations."
            />
            <SolutionCard
              number={5}
              title="Emergent Spacetime"
              status="Speculative"
              description="If spacetime itself is emergent from deeper quantum degrees of freedom, the relationship between vacuum energy and curvature may not be what GR assumes. The cosmological constant might be a low-energy artifact, not a fundamental parameter."
            />
          </div>
        </section>

        {/* DESI 2024 update */}
        <section className="mb-16">
          <div className="rounded-2xl border border-amber-700/40 bg-amber-950/10 p-7">
            <p className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-3">
              Update — DESI 2024 DR1
            </p>
            <h3 className="text-xl font-bold mb-3">
              A new clue: dark energy may not be constant
            </h3>
            <p className="text-muted leading-relaxed mb-4">
              Since the five proposed solutions above were formalized, the DESI
              survey released its first data: 6 million galaxy spectra measuring
              the BAO standard ruler across cosmic time. The result deviates from{" "}
              <InlineMath math="w = -1" /> at 2.5–3.9σ — suggesting dark energy
              is evolving, not fixed. The best-fit CPL parameters are{" "}
              <InlineMath math="w_0 \approx -0.73,\ w_a \approx -1.05" />.
            </p>
            <p className="text-muted leading-relaxed">
              This rules out a pure cosmological constant if confirmed at higher
              significance. It shifts the question from &ldquo;why is{" "}
              <InlineMath math="\Lambda" /> so small?&rdquo; to &ldquo;why is
              dark energy dynamical, and what determines its evolution?&rdquo;
            </p>
            <Link
              href="/since-einstein"
              className="mt-5 inline-flex items-center gap-2 text-sm font-mono text-amber-300 hover:text-amber-200 transition-colors"
            >
              Chapter 03: The evidence in full →
            </Link>
          </div>
        </section>

        {/* Computational Approach */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Approach</h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              The cosmological constant problem sits at the intersection of
              quantum field theory and general relativity — exactly where our
              understanding breaks down. Traditional pen-and-paper approaches
              have struggled for decades.
            </p>
            <p>
              Our computational approach: simulate different vacuum energy
              scenarios, visualize their cosmological consequences, and use AI to
              explore the parameter space of proposed solutions. What does a
              universe with{" "}
              <InlineMath math="\Lambda = 10^{74}" /> look like? How quickly does
              it expand? Can we find patterns in the landscape of possible
              solutions?
            </p>
            <p>
              Einstein said imagination is more important than knowledge. The
              cosmological constant problem is where we need imagination most.
            </p>
          </div>
        </section>
      </article>

      <ChapterFooterNav current="02" />

      <footer className="px-6 py-8 border-t border-surface-light text-center text-sm text-muted mt-auto">
        <p>
          Imagined Cosmos — an{" "}
          <a
            href="https://github.com/ImaginedCosmos/imagined-cosmos"
            className="text-accent hover:underline"
          >
            open-source reproduction
          </a>{" "}
          project
        </p>
      </footer>
    </div>
  );
}

function SolutionCard({
  number,
  title,
  status,
  description,
}: {
  number: number;
  title: string;
  status: string;
  description: string;
}) {
  const statusColor =
    status === "Incomplete"
      ? "text-yellow-400 bg-yellow-900/20"
      : status === "Controversial"
        ? "text-orange-400 bg-orange-900/20"
        : status === "Speculative"
          ? "text-purple-400 bg-purple-900/20"
          : "text-green-400 bg-green-900/20";

  return (
    <div className="rounded-xl border border-surface-light bg-surface p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center text-sm font-bold">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full ${statusColor}`}
            >
              {status}
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
