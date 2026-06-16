import Image from "next/image";
import Link from "next/link";

const CHAPTERS = [
  {
    number: "01",
    href: "/friedmann",
    title: "The Friedmann Equations",
    description:
      "The master equations of cosmic expansion — derived from general relativity, simulated in code. Toggle dark energy on and off to watch 200 galaxies accelerate or decelerate in real time.",
    tags: ["Scale Factor", "H(z)", "ΛCDM"],
    status: "published",
  },
  {
    number: "02",
    href: "/cosmological-constant",
    title: "The Cosmological Constant Problem",
    description:
      "Quantum field theory predicts a vacuum energy 10¹²¹ times larger than what we observe. No prediction in the history of science has ever been this wrong.",
    tags: ["Vacuum Energy", "Fine-Tuning", "10¹²¹"],
    status: "published",
  },
  {
    number: "03",
    href: "/since-einstein",
    title: "What the Universe Has Told Us Since Einstein",
    description:
      "Hubble 1929, supernovae 1998, Planck 2018, DESI 2024 — a century of observation that transforms dark energy from theory into measured fact. And why DESI's latest finding changes everything.",
    tags: ["DESI 2024", "BAO", "Hubble Tension", "w(z)"],
    status: "published",
  },
  {
    number: "04",
    href: "/solution",
    title: "The Solution",
    description:
      "Continuing where Einstein left us — a theory of dark energy accounting for the 10¹²¹ discrepancy, the DESI equation of state, and the 5σ Hubble tension.",
    tags: ["Theory", "Proof", "Predictions"],
    status: "published",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.15)_0%,_transparent_70%)]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_30rem]">
          <div className="text-center lg:text-left">
            <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
              Computational Physics + Generative AI
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
              Imagined{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                Cosmos
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Einstein left us with a universe that accelerates, a cosmological
              constant that makes no sense, and equations that almost work. We
              take it from there.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/since-einstein"
                className="px-5 py-2.5 rounded-lg bg-accent/20 text-violet-300 text-sm font-mono hover:bg-accent/30 transition-colors"
              >
                Start with the evidence →
              </Link>
              <Link
                href="/solve"
                className="px-5 py-2.5 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-sm font-mono hover:bg-emerald-900/50 transition-colors"
              >
                ⟳ Run the Solver
              </Link>
              <Link
                href="/papers"
                className="px-5 py-2.5 rounded-lg border border-surface-light text-muted text-sm font-mono hover:border-accent-dim hover:text-foreground transition-colors"
              >
                Read the papers
              </Link>
            </div>

            <blockquote className="mt-12 border-l-2 border-accent-dim pl-4 text-left max-w-lg italic text-muted mx-auto lg:mx-0">
              &ldquo;Imagination is more important than knowledge. Knowledge is
              limited. Imagination encircles the world.&rdquo;
              <footer className="mt-2 text-sm not-italic text-accent">
                — Albert Einstein
              </footer>
            </blockquote>
          </div>

          <div className="mx-auto w-full max-w-[32rem]">
            <div className="overflow-hidden rounded-[2rem] border border-surface-light/70 bg-surface/60 p-3 shadow-[0_0_80px_rgba(91,33,182,0.24)]">
              <Image
                src="/visuals/cosmic-hero.svg"
                alt="A luminous spacetime visualization with a warped cosmic core."
                width={1600}
                height={1200}
                priority
                className="h-auto w-full rounded-[1.35rem]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chapter journey */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="mb-12 text-center">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-3">
            The Journey
          </p>
          <h2 className="text-3xl font-bold mb-4">
            From Einstein to a Solution
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Four chapters. 106 years of physics. One unresolved problem — and
            one proposed answer.
          </p>
        </div>

        <div className="space-y-4">
          {CHAPTERS.map((ch) => (
            <ChapterCard key={ch.number} {...ch} />
          ))}
        </div>
      </section>

      {/* The problem in numbers */}
      <section className="px-6 py-20 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            The Scale of the Problem
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Stat
              value="10¹²¹"
              label="QFT prediction vs observed vacuum energy"
              sublabel="The worst prediction in physics"
            />
            <Stat
              value="68.5%"
              label="of the universe is dark energy"
              sublabel="We don't know what it is"
            />
            <Stat
              value="5σ"
              label="Hubble tension"
              sublabel="CMB vs local distance ladder"
            />
          </div>
        </div>
      </section>

      {/* DESI teaser */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-amber-800/40 bg-amber-950/10 p-8 sm:p-10">
          <p className="text-xs font-mono tracking-widest uppercase text-amber-400 mb-3">
            New — DESI 2024 DR1
          </p>
          <h3 className="text-2xl font-bold mb-4">
            Dark energy may not be a constant
          </h3>
          <p className="text-muted leading-relaxed mb-6 max-w-2xl">
            The Dark Energy Spectroscopic Instrument measured 6 million galaxy
            spectra and found the dark energy equation of state deviates from{" "}
            <span className="text-foreground font-mono">w = −1</span> at
            2.5–3.9σ. If confirmed, this rules out the simple cosmological
            constant and demands a dynamical explanation.
          </p>
          <Link
            href="/since-einstein#desi"
            className="inline-flex items-center gap-2 text-sm font-mono text-amber-300 hover:text-amber-200 transition-colors"
          >
            Explore the evidence →
          </Link>
        </div>
      </section>

      {/* Solver teaser */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-emerald-700/25 bg-emerald-950/10 p-8 sm:p-10">
          <p className="text-xs font-mono tracking-widest uppercase text-emerald-400 mb-3">
            Closed-Loop Solver
          </p>
          <h3 className="text-2xl font-bold mb-4">
            Watch the theory iterate in real time
          </h3>
          <p className="text-muted leading-relaxed mb-6 max-w-2xl">
            The CVC theory has one free parameter: ν. The solver runs gradient
            descent against DESI DR1, finds the best-fit ν, and reports whether
            the theory converges, needs revision, or is falsified. If CVC-1.0
            falls short, CVC-2.0 (H⁴ correction) is automatically proposed.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            {[
              { value: "ν*", label: "single free parameter" },
              { value: "χ²", label: "DESI goodness-of-fit" },
              { value: "DR2", label: "next falsification test" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold font-mono text-emerald-300">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/solve"
            className="inline-flex items-center gap-2 text-sm font-mono px-5 py-2.5 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-900/50 transition-colors"
          >
            ⟳ Open the Solver →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-surface-light text-center text-sm text-muted mt-auto">
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

function ChapterCard({
  number,
  href,
  title,
  description,
  tags,
  status,
}: (typeof CHAPTERS)[0]) {
  const isComingSoon = status === "coming";

  const inner = (
    <div
      className={`rounded-xl border p-6 sm:p-7 transition-colors ${
        isComingSoon
          ? "border-surface-light bg-surface/40 opacity-60 cursor-not-allowed"
          : "border-surface-light bg-surface hover:border-accent-dim/70 group"
      }`}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-dim/30 flex items-center justify-center text-sm font-mono text-accent font-bold">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3
              className={`text-lg font-semibold ${
                isComingSoon ? "" : "group-hover:text-accent transition-colors"
              }`}
            >
              {title}
            </h3>
            {isComingSoon && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-light text-muted/60">
                Coming soon
              </span>
            )}
          </div>
          <p className="text-sm text-muted leading-relaxed mb-3">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-light text-muted/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isComingSoon) return inner;
  return <Link href={href}>{inner}</Link>;
}

function Stat({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="rounded-xl border border-surface-light p-6 text-center">
      <p className="text-4xl font-bold text-accent mb-2">{value}</p>
      <p className="text-sm text-foreground font-medium mb-1">{label}</p>
      <p className="text-xs text-muted">{sublabel}</p>
    </div>
  );
}
