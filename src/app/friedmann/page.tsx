import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlockMath, InlineMath } from "@/components/Math";
import ExpansionSimulation from "@/components/ExpansionSimulation";

export const metadata: Metadata = {
  title: "Friedmann Equations — Imagined Cosmos",
  description:
    "The master equations of cosmic expansion, derived and simulated. Interactive visualization of dark energy's effect on the universe.",
};

export default function FriedmannPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="px-6 py-4 border-b border-surface-light">
        <Link
          href="/"
          className="text-sm font-mono text-muted hover:text-accent transition-colors"
        >
          &larr; Imagined Cosmos
        </Link>
      </nav>

      <article className="max-w-4xl mx-auto w-full px-6 py-16">
        {/* Title */}
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Chapter 01
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            The Friedmann Equations
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            Two equations that govern the expansion of the entire universe —
            derived from general relativity in 1922, seven years before Hubble
            observed expansion. They predict everything from the Big Bang to the
            accelerating cosmos we see today.
          </p>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-surface-light bg-surface/60 p-3 shadow-[0_0_70px_rgba(124,58,237,0.18)]">
            <Image
              src="/visuals/friedmann-expansion.svg"
              alt="An abstract illustration of expanding cosmic shells and galaxies moving apart."
              width={1600}
              height={900}
              priority
              className="h-auto w-full rounded-[1.35rem]"
            />
          </div>
        </header>

        {/* The Equations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Equations</h2>

          <div className="rounded-xl bg-surface border border-surface-light p-8 mb-6">
            <p className="text-sm font-mono text-accent mb-3">
              First Friedmann Equation — the expansion rate
            </p>
            <BlockMath math="H^2 = \frac{8\pi G}{3}\rho - \frac{kc^2}{a^2} + \frac{\Lambda c^2}{3}" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              How fast the universe expands depends on its total energy content.
              The left side is the square of the Hubble parameter. The right side
              has three terms: matter/radiation density (
              <InlineMath math="\rho" />
              ), spatial curvature (<InlineMath math="k" />
              ), and the cosmological constant (<InlineMath math="\Lambda" />
              ).
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-8 mb-6">
            <p className="text-sm font-mono text-accent mb-3">
              Second Friedmann Equation — acceleration
            </p>
            <BlockMath math="\frac{\ddot{a}}{a} = -\frac{4\pi G}{3}\left(\rho + \frac{3p}{c^2}\right) + \frac{\Lambda c^2}{3}" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Does expansion speed up or slow down? Matter and radiation (
              <InlineMath math="\rho + 3p/c^2" />) decelerate expansion. The
              cosmological constant (<InlineMath math="\Lambda" />) accelerates
              it. The universe transitioned from deceleration to acceleration at
              redshift{" "}
              <InlineMath math="z \approx 0.67" /> — about 5 billion years ago.
            </p>
          </div>

          <div className="rounded-xl bg-surface border border-surface-light p-8">
            <p className="text-sm font-mono text-accent mb-3">
              Density parameter form — what cosmologists actually use
            </p>
            <BlockMath math="H^2(a) = H_0^2 \left[ \Omega_r \, a^{-4} + \Omega_m \, a^{-3} + \Omega_k \, a^{-2} + \Omega_\Lambda \right]" />
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Each component scales differently with the scale factor{" "}
              <InlineMath math="a" />: radiation dilutes as{" "}
              <InlineMath math="a^{-4}" />, matter as{" "}
              <InlineMath math="a^{-3}" />, curvature as{" "}
              <InlineMath math="a^{-2}" />, and dark energy stays{" "}
              <strong className="text-foreground">constant</strong> — which is
              why it eventually dominates.
            </p>
          </div>
        </section>

        {/* Key parameters */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Measured Values</h2>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="rounded-xl bg-surface border border-surface-light overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-light text-left">
                    <th className="px-6 py-3 text-muted font-mono">
                      Parameter
                    </th>
                    <th className="px-6 py-3 text-muted font-mono">Symbol</th>
                    <th className="px-6 py-3 text-muted font-mono">
                      Value (Planck 2018)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  <tr className="border-b border-surface-light/50">
                    <td className="px-6 py-3">Hubble constant</td>
                    <td className="px-6 py-3">
                      <InlineMath math="H_0" />
                    </td>
                    <td className="px-6 py-3 font-mono text-accent">
                      67.4 ± 0.5 km/s/Mpc
                    </td>
                  </tr>
                  <tr className="border-b border-surface-light/50">
                    <td className="px-6 py-3">Matter density</td>
                    <td className="px-6 py-3">
                      <InlineMath math="\Omega_m" />
                    </td>
                    <td className="px-6 py-3 font-mono text-accent">
                      0.315 ± 0.007
                    </td>
                  </tr>
                  <tr className="border-b border-surface-light/50">
                    <td className="px-6 py-3">Dark energy density</td>
                    <td className="px-6 py-3">
                      <InlineMath math="\Omega_\Lambda" />
                    </td>
                    <td className="px-6 py-3 font-mono text-accent">
                      0.685 ± 0.007
                    </td>
                  </tr>
                  <tr className="border-b border-surface-light/50">
                    <td className="px-6 py-3">Radiation density</td>
                    <td className="px-6 py-3">
                      <InlineMath math="\Omega_r" />
                    </td>
                    <td className="px-6 py-3 font-mono text-accent">
                      9.1 × 10⁻⁵
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Equation of state</td>
                    <td className="px-6 py-3">
                      <InlineMath math="w_0" />
                    </td>
                    <td className="px-6 py-3 font-mono text-accent">
                      −1.03 ± 0.03
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-hidden rounded-xl border border-surface-light bg-surface/70 p-3">
              <Image
                src="/visuals/friedmann-scale-factor.svg"
                alt="A scale-factor inspired visualization showing the expansion curve steepening over cosmic time."
                width={1200}
                height={900}
                className="h-auto w-full rounded-[1rem]"
              />
            </div>
          </div>
        </section>

        {/* Simulation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">
            Simulation: Cosmic Expansion
          </h2>
          <p className="text-muted mb-6 leading-relaxed">
            200 galaxies expanding according to the Friedmann equations with
            Planck 2018 parameters. Toggle dark energy to see the difference —
            with <InlineMath math="\Lambda" />, expansion accelerates and
            galaxies fly apart. Without it, expansion decelerates.
          </p>
          <ExpansionSimulation />
        </section>

        {/* Why it matters */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why This Matters</h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              The Friedmann equations are where the cosmological constant problem
              lives. When you write{" "}
              <InlineMath math="\Omega_\Lambda = 0.685" />, you&apos;re saying
              that 68.5% of the universe is made of something we don&apos;t
              understand — something that makes empty space push outward.
            </p>
            <p>
              Quantum field theory predicts that the vacuum should have energy —
              virtual particles popping in and out of existence contribute to{" "}
              <InlineMath math="\Lambda" />. But the predicted value is{" "}
              <InlineMath math="10^{120}" /> times larger than what we observe.
              This isn&apos;t a small discrepancy. It&apos;s the worst
              prediction in the history of physics.
            </p>
            <p>
              Our approach: use computation and AI to explore this problem from
              new angles. Simulate alternative models. Visualize what the
              equations describe. Find patterns that pen-and-paper derivations
              might miss.
            </p>
          </div>
        </section>

        {/* Derivation preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The Derivation</h2>
          <p className="text-muted mb-6 leading-relaxed">
            Start with the Einstein field equations applied to a homogeneous,
            isotropic universe (the FLRW metric):
          </p>
          <div className="rounded-xl bg-surface border border-surface-light p-8 space-y-4">
            <p className="text-sm text-muted">
              The FLRW metric describes a universe that looks the same in every
              direction and at every point:
            </p>
            <BlockMath math="ds^2 = -c^2 dt^2 + a(t)^2 \left[ \frac{dr^2}{1-kr^2} + r^2 d\Omega^2 \right]" />
            <p className="text-sm text-muted">
              Plug this into Einstein&apos;s equations{" "}
              <InlineMath math="G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}" />{" "}
              with a perfect fluid stress-energy tensor. The{" "}
              <InlineMath math="(0,0)" /> component gives the first Friedmann
              equation. The <InlineMath math="(i,i)" /> components give the
              second.
            </p>
            <BlockMath math="G_{00} \implies H^2 = \frac{8\pi G}{3}\rho - \frac{kc^2}{a^2} + \frac{\Lambda c^2}{3}" />
            <BlockMath math="G_{ii} \implies \frac{\ddot{a}}{a} = -\frac{4\pi G}{3}\left(\rho + \frac{3p}{c^2}\right) + \frac{\Lambda c^2}{3}" />
            <p className="text-sm text-muted">
              The scale factor <InlineMath math="a(t)" /> is the single
              dynamical variable — it tells you how much the universe has
              expanded relative to today (
              <InlineMath math="a_0 = 1" />
              ).
            </p>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-surface-light text-center text-sm text-muted mt-auto">
        <p>
          Imagined Cosmos — a{" "}
          <a
            href="https://scheduler-systems.com"
            className="text-accent hover:underline"
          >
            Scheduler Systems
          </a>{" "}
          project
        </p>
      </footer>
    </div>
  );
}
