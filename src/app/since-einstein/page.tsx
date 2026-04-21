import type { Metadata } from "next";
import Link from "next/link";
import ChapterNav from "@/components/ChapterNav";
import { BlockMath, InlineMath } from "@/components/Math";
import EquationOfState from "@/components/EquationOfState";
import ChapterFooterNav from "@/components/ChapterFooterNav";

export const metadata: Metadata = {
  title: "The Evidence Since Einstein — Imagined Cosmos",
  description:
    "A century of observation: Hubble's expanding universe, supernovae acceleration, Planck CMB, and DESI 2024 — everything the universe has told us about dark energy.",
  openGraph: {
    title: "The Evidence Since Einstein — Imagined Cosmos",
    description:
      "A century of observation: Hubble's expanding universe, supernovae acceleration, Planck CMB, and DESI 2024 — everything the universe has told us about dark energy.",
    url: "https://cosmos.scheduler-systems.com/since-einstein",
  },
  twitter: {
    title: "The Evidence Since Einstein — Imagined Cosmos",
    description:
      "A century of observation: Hubble's expanding universe, supernovae acceleration, Planck CMB, and DESI 2024 — everything the universe has told us about dark energy.",
  },
};

const TIMELINE: {
  year: string;
  event: string;
  detail: string;
  type: "foundation" | "observation" | "confirmation" | "tension";
}[] = [
  {
    year: "1915",
    event: "Einstein publishes general relativity",
    detail: "Gμν + Λgμν = 8πG/c⁴ Tμν — the framework for all modern cosmology.",
    type: "foundation",
  },
  {
    year: "1917",
    event: "Cosmological constant added",
    detail:
      "Einstein adds Λ to prevent the universe from collapsing — assumes it must be static.",
    type: "foundation",
  },
  {
    year: "1922",
    event: "Friedmann: the universe needn't be static",
    detail:
      "GR admits expanding and contracting solutions. Λ isn't needed for stability.",
    type: "foundation",
  },
  {
    year: "1929",
    event: "Hubble: galaxies are receding",
    detail:
      "Cepheid distances show v = H₀d. The universe is expanding. Λ removed.",
    type: "observation",
  },
  {
    year: "1965",
    event: "CMB discovered by accident",
    detail:
      "Penzias & Wilson detect the 2.725 K fossil light from 380,000 years after the Big Bang.",
    type: "observation",
  },
  {
    year: "1998",
    event: "Supernovae: expansion is accelerating",
    detail:
      "Type Ia SNe are dimmer than expected — farther than a decelerating universe allows. Λ > 0 required.",
    type: "confirmation",
  },
  {
    year: "2003",
    event: "WMAP maps the CMB",
    detail:
      "Full-sky CMB power spectrum: flat geometry, ΩΛ ≈ 0.73. Dark energy is 73% of the universe.",
    type: "confirmation",
  },
  {
    year: "2011",
    event: "Nobel Prize",
    detail:
      "Perlmutter, Riess, Schmidt awarded for the discovery of accelerating expansion.",
    type: "confirmation",
  },
  {
    year: "2018",
    event: "Planck: precision cosmology",
    detail:
      "ΩΛ = 0.685 ± 0.007, H₀ = 67.4 ± 0.5 km/s/Mpc. Six-parameter ΛCDM fits perfectly.",
    type: "confirmation",
  },
  {
    year: "2022",
    event: "Hubble tension reaches 5σ",
    detail:
      "CMB H₀ = 67.4 vs local distance ladder H₀ = 73.04. Cannot be statistical noise.",
    type: "tension",
  },
  {
    year: "2024",
    event: "DESI DR1: dark energy may be evolving",
    detail:
      "6 million galaxy spectra. BAO at 11 redshift bins. w₀ ≈ −0.73, wₐ ≈ −1.05. 2.5–3.9σ from w = −1.",
    type: "tension",
  },
];

const TYPE_STYLE = {
  foundation: "border-violet-800/60 bg-violet-950/20",
  observation: "border-indigo-700/60 bg-indigo-950/20",
  confirmation: "border-emerald-800/60 bg-emerald-950/20",
  tension: "border-amber-700/60 bg-amber-950/20",
};

const TYPE_DOT = {
  foundation: "bg-violet-500",
  observation: "bg-indigo-400",
  confirmation: "bg-emerald-400",
  tension: "bg-amber-400",
};

export default function SinceEinsteinPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ChapterNav current="03" />

      <article className="max-w-4xl mx-auto w-full px-6 py-16">
        {/* Title */}
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Chapter 03
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            What the Universe Has Told Us Since Einstein
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            In 1931, Einstein removed the cosmological constant from his
            equations and called it his greatest blunder. In 1998, two
            independent teams of astronomers proved he was wrong to remove it.
            This is what we&apos;ve learned in the 106 years since general
            relativity — and why it demands a solution.
          </p>
        </header>

        {/* The Blunder That Wasn't */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">The Blunder That Wasn&apos;t</h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Einstein added <InlineMath math="\Lambda" /> to his field
              equations in 1917 because a static universe required it — without
              it, gravity would cause everything to collapse. When Hubble showed
              the universe was expanding in 1929, Einstein abandoned the
              constant. A static universe was never needed. The constant was
              unnecessary.
            </p>
            <p>
              But he was wrong for the right reasons. The universe isn&apos;t
              static — but something is still pushing it apart, and that
              something is exactly what <InlineMath math="\Lambda" /> describes.
              The constant he introduced to prevent collapse turns out to be the
              right mathematical object for a completely different physical
              reality: not a brake, but an accelerator.
            </p>
            <div className="rounded-xl bg-surface border border-surface-light p-7">
              <p className="text-sm font-mono text-accent mb-3">
                Einstein field equations — with the cosmological constant
              </p>
              <BlockMath math="G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}" />
              <p className="text-sm text-muted mt-3 leading-relaxed">
                <InlineMath math="\Lambda g_{\mu\nu}" /> is the term Einstein
                added and then removed. Observations forced it back in — not as
                a fudge factor, but as the dominant component of the universe.
              </p>
            </div>
          </div>
        </section>

        {/* 1929: Hubble */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">1929 — The Universe Is Expanding</h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Edwin Hubble used Cepheid variable stars as cosmic distance
              markers — their brightness oscillates with a period that reveals
              their absolute luminosity, so comparing to apparent brightness
              gives distance. Measuring the redshift of their host galaxies gave
              recession velocity.
            </p>
            <p>
              The result was unmistakable: velocity scales with distance. The
              universe is expanding. And this expansion is described precisely
              by the Friedmann equations Friedmann had derived seven years
              earlier from general relativity.
            </p>
            <div className="rounded-xl bg-surface border border-surface-light p-7">
              <p className="text-sm font-mono text-accent mb-3">
                Hubble&apos;s law
              </p>
              <BlockMath math="v = H_0 \, d" />
              <p className="text-sm text-muted mt-3 leading-relaxed">
                Every galaxy recedes at a speed proportional to its distance.{" "}
                <InlineMath math="H_0" /> is the Hubble constant — the
                expansion rate today. Hubble&apos;s original measurement was{" "}
                <InlineMath math="\sim 500 \text{ km/s/Mpc}" />, off by a
                factor of 7. Today&apos;s value is{" "}
                <InlineMath math="67.4 \pm 0.5 \text{ km/s/Mpc}" /> from
                the CMB — or <InlineMath math="73.04 \pm 1.04" /> from local
                distance measurements. These disagree at 5σ.
              </p>
            </div>
          </div>
        </section>

        {/* 1998: Acceleration */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">
            1998 — The Universe Is Accelerating
          </h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Type Ia supernovae are &ldquo;standard candles&rdquo; — they all
              explode at nearly the same peak luminosity, driven by the same
              nuclear physics. Compare apparent brightness to known absolute
              brightness, and you get distance. Measure redshift, and you get
              recession velocity. Plot both, and you can trace the expansion
              history of the universe.
            </p>
            <p>
              Two teams — the Supernova Cosmology Project (Perlmutter) and the
              High-Z Supernova Search Team (Riess, Schmidt) — independently
              studied supernovae at high redshift. They found the same
              unexpected result: the supernovae were{" "}
              <strong className="text-foreground">fainter</strong> than expected.
              Fainter means farther. Farther means the universe has expanded
              more than a decelerating model would predict.
            </p>
            <p>
              The universe isn&apos;t decelerating under gravity. It&apos;s
              accelerating. Something is overcoming gravity on the largest
              scales. That something is dark energy — and it requires{" "}
              <InlineMath math="\Lambda > 0" />.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "ΩΛ",
                  value: "≈ 0.72",
                  note: "Perlmutter et al. 1999",
                },
                {
                  label: "ΩΛ",
                  value: "≈ 0.76",
                  note: "Riess et al. 1998",
                },
                {
                  label: "ΩΛ",
                  value: "0.685 ± 0.007",
                  note: "Planck 2018 (CMB)",
                },
              ].map((d) => (
                <div
                  key={d.note}
                  className="rounded-xl bg-surface border border-surface-light p-5 text-center"
                >
                  <p className="text-2xl font-bold text-accent mb-1">{d.value}</p>
                  <p className="text-xs font-mono text-muted/70">{d.label}</p>
                  <p className="text-xs text-muted mt-2">{d.note}</p>
                </div>
              ))}
            </div>
            <p>
              Three completely independent methods. All converge on the same
              conclusion: 68–72% of the universe&apos;s energy content is dark
              energy. The 2011 Nobel Prize in Physics went to Perlmutter, Riess,
              and Schmidt for this discovery.
            </p>
          </div>
        </section>

        {/* CMB */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">
            2003–2018 — The Cosmic Microwave Background
          </h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              The CMB is the oldest light in the universe — photons released
              380,000 years after the Big Bang when the cosmos cooled enough for
              hydrogen to form. Its temperature fluctuations encode the
              composition of the universe at that moment: the relative amounts
              of matter, radiation, and dark energy.
            </p>
            <p>
              WMAP (2003) and Planck (2013, 2018) mapped these fluctuations
              across the full sky. The power spectrum — the distribution of hot
              and cold spots at different angular scales — is a precise
              fingerprint. Fitting it against cosmological models gives
              measurements of <InlineMath math="\Omega_\Lambda" />,{" "}
              <InlineMath math="H_0" />, and the geometry of space.
            </p>
            <div className="rounded-xl bg-surface border border-surface-light p-7">
              <p className="text-sm font-mono text-accent mb-3">
                Planck 2018 cosmological parameters
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-light text-left">
                      <th className="pb-3 text-muted font-mono font-normal">Parameter</th>
                      <th className="pb-3 text-muted font-mono font-normal">Value</th>
                      <th className="pb-3 text-muted font-mono font-normal">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {[
                      ["ΩΛ", "0.685 ± 0.007", "Dark energy fraction"],
                      ["Ωm", "0.315 ± 0.007", "Matter fraction"],
                      ["H₀", "67.4 ± 0.5 km/s/Mpc", "Expansion rate today"],
                      ["w₀", "−1.03 ± 0.03", "Dark energy equation of state"],
                      ["k", "≈ 0", "Flat geometry"],
                    ].map(([p, v, m]) => (
                      <tr key={p} className="border-b border-surface-light/40">
                        <td className="py-2.5 font-mono text-accent">{p}</td>
                        <td className="py-2.5 text-foreground">{v}</td>
                        <td className="py-2.5 text-muted">{m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted mt-4">
                The six-parameter ΛCDM model fits the Planck power spectrum with
                extraordinary precision. Dark energy is not a theoretical
                convenience — it is a measured component of reality.
              </p>
            </div>
          </div>
        </section>

        {/* DESI 2024 */}
        <section id="desi" className="mb-20">
          <h2 className="text-2xl font-bold mb-2">
            2024 — Dark Energy May Not Be Constant
          </h2>
          <p className="text-sm font-mono text-accent mb-8">DESI DR1 — the sharpest measurement of dark energy&apos;s nature yet</p>
          <div className="space-y-5 text-muted leading-relaxed mb-8">
            <p>
              The Dark Energy Spectroscopic Instrument measured spectra of 6
              million galaxies and quasars spanning 11 billion years of cosmic
              history. Using Baryon Acoustic Oscillations (BAO) — a{" "}
              <strong className="text-foreground">standard ruler</strong> imprinted
              in the galaxy distribution by sound waves in the early universe —
              DESI measured the expansion rate at multiple epochs.
            </p>
            <p>
              If dark energy is a cosmological constant, its equation of state
              is exactly <InlineMath math="w = -1" /> for all time. DESI tested
              this using the CPL parametrization, which allows{" "}
              <InlineMath math="w" /> to vary with redshift:
            </p>
            <div className="rounded-xl bg-surface border border-surface-light p-7">
              <p className="text-sm font-mono text-accent mb-3">
                CPL parametrization — allows evolving dark energy
              </p>
              <BlockMath math="w(z) = w_0 + w_a \frac{z}{1+z}" />
              <p className="text-sm text-muted mt-3 leading-relaxed">
                A pure cosmological constant gives{" "}
                <InlineMath math="w_0 = -1,\ w_a = 0" />. DESI DR1 combined
                with CMB and Type Ia supernovae found:{" "}
                <strong className="text-foreground">
                  w₀ ≈ −0.73, wₐ ≈ −1.05
                </strong>
                . This is 2.5–3.9σ away from{" "}
                <InlineMath math="w = -1" />, depending on which supernova
                dataset is combined. If confirmed, dark energy is not a
                constant — it is a dynamical field that has{" "}
                <em>evolved</em> over cosmic time.
              </p>
            </div>
          </div>

          <EquationOfState />

          <div className="mt-6 space-y-5 text-muted leading-relaxed">
            <p>
              The visualization above shows the CPL equation of state{" "}
              <InlineMath math="w(z)" /> as a function of redshift. The dashed
              red line is the cosmological constant. The violet curve is the
              DESI 2024 best fit — notice it rises above{" "}
              <InlineMath math="w = -1" /> at low redshift (today) and dips
              well below at high redshift (the early universe). Use the sliders
              to explore: what does a universe with{" "}
              <InlineMath math="w_0 = -1,\ w_a = 0" /> look like versus the
              DESI best fit?
            </p>
            <p>
              The physical implication is profound: if{" "}
              <InlineMath math="w_0 > -1" />, dark energy today is{" "}
              <em>weaker</em> than a pure vacuum energy. If{" "}
              <InlineMath math="w_a < 0" />, it was{" "}
              <em>stronger</em> in the past — behaving more like phantom energy.
              This is inconsistent with a simple cosmological constant. It
              suggests dark energy is a dynamical field, possibly quintessence
              or something more exotic.
            </p>
          </div>
        </section>

        {/* Hubble Tension */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">The Hubble Tension</h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              The expansion rate of the universe today —{" "}
              <InlineMath math="H_0" /> — can be measured two ways. Measuring
              the CMB and fitting ΛCDM to the early universe gives one answer.
              Measuring Cepheid distances to nearby galaxies and calibrating
              Type Ia supernovae gives another. They disagree.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface border border-indigo-900/50 p-6">
                <p className="text-xs font-mono text-indigo-400 mb-2">Early Universe (CMB)</p>
                <p className="text-3xl font-bold text-foreground mb-1">
                  67.4
                  <span className="text-lg font-normal text-muted ml-1">km/s/Mpc</span>
                </p>
                <p className="text-xs text-muted">Planck 2018 — ±0.5</p>
              </div>
              <div className="rounded-xl bg-surface border border-amber-800/50 p-6">
                <p className="text-xs font-mono text-amber-400 mb-2">Late Universe (Distance Ladder)</p>
                <p className="text-3xl font-bold text-foreground mb-1">
                  73.04
                  <span className="text-lg font-normal text-muted ml-1">km/s/Mpc</span>
                </p>
                <p className="text-xs text-muted">SH0ES / Riess et al. 2022 — ±1.04</p>
              </div>
            </div>
            <p>
              The discrepancy is 5σ. In physics, 5σ is the threshold for
              discovery. This is not a measurement error — both measurements are
              among the most carefully checked in all of science. Either one or
              both measurements has an unidentified systematic error, or the
              standard cosmological model is incomplete.
            </p>
            <p>
              The Hubble tension may be the first crack in ΛCDM. Any solution
              to dark energy that modifies the expansion history — particularly
              in the late universe — could shift the inferred{" "}
              <InlineMath math="H_0" /> from the CMB toward the local value.
            </p>
          </div>
        </section>

        {/* What the evidence demands */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">
            What the Evidence Demands
          </h2>
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Taken together, this is what the last century of observation has
              established beyond any reasonable doubt:
            </p>
            <ul className="space-y-3 ml-4">
              {[
                "The universe is expanding — measured by Hubble 1929",
                "The expansion is accelerating — measured by Perlmutter, Riess, Schmidt 1998",
                "68.5% of the universe is dark energy — confirmed by CMB, BAO, and supernovae independently",
                "The cosmological constant fits the data, but dark energy may be evolving — DESI 2024",
                "Two measurements of H₀ disagree at 5σ — the Hubble tension demands new physics",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-accent mt-0.5 flex-shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              And yet the theoretical prediction for dark energy — the quantum
              vacuum energy — overshoots the observed value by{" "}
              <InlineMath math="10^{121}" />. This is the cosmological constant
              problem: not a gap in observation, but a catastrophic failure of
              our best theories to explain what we observe.
            </p>
            <p>
              A complete solution must do four things: explain why{" "}
              <InlineMath math="\Lambda_{\text{obs}} \ll \Lambda_{\text{QFT}}" />
              , explain the coincidence that dark energy became dominant only
              recently (<em>why now?</em>), predict or accommodate the DESI
              finding that <InlineMath math="w \neq -1" />, and resolve or
              explain the Hubble tension.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">106 Years in Sequence</h2>
          <div className="relative">
            <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-surface-light" />
            <div className="space-y-4">
              {TIMELINE.map((entry) => (
                <div key={entry.year} className="flex gap-6 items-start">
                  <span className="w-14 text-right text-xs font-mono text-muted flex-shrink-0 pt-3.5">
                    {entry.year}
                  </span>
                  <div className="relative flex-shrink-0 pt-3.5">
                    <div
                      className={`w-3 h-3 rounded-full mt-0.5 ${TYPE_DOT[entry.type]}`}
                    />
                  </div>
                  <div
                    className={`flex-1 rounded-xl border p-4 ${TYPE_STYLE[entry.type]}`}
                  >
                    <p className="font-semibold text-sm text-foreground mb-1">
                      {entry.event}
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      {entry.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono">
            {(
              [
                ["foundation", "Foundation"],
                ["observation", "Observation"],
                ["confirmation", "Confirmation"],
                ["tension", "Tension / New physics"],
              ] as const
            ).map(([type, label]) => (
              <span key={type} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${TYPE_DOT[type]}`} />
                <span className="text-muted">{label}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Next chapter CTA */}
        <div className="rounded-2xl border border-accent-dim/40 bg-accent-dim/10 p-8 text-center">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-3">
            Chapter 04
          </p>
          <h3 className="text-2xl font-bold mb-3">The Solution</h3>
          <p className="text-muted leading-relaxed max-w-lg mx-auto mb-6">
            Continuing where Einstein left us — the Causal Vacuum Correspondence:
            a theory that resolves the 10<sup>121</sup> discrepancy, predicts the
            DESI equation of state, and makes a specific falsifiable claim for DR2.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/solution"
              className="inline-block px-5 py-2.5 rounded-lg bg-accent/20 text-violet-300 text-sm font-mono hover:bg-accent/30 transition-colors"
            >
              Read the theory →
            </Link>
            <Link
              href="/solve"
              className="inline-block px-5 py-2.5 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-sm font-mono hover:bg-emerald-900/50 transition-colors"
            >
              ⟳ Run the Solver →
            </Link>
          </div>
        </div>
      </article>

      <ChapterFooterNav current="03" />

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
