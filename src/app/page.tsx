import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="relative overflow-hidden px-6 py-24 sm:py-28">
        {/* Background glow */}
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
              Einstein said the most important thing is imagination. We use code
              and generative AI to visualize the deepest problems in physics —
              dark energy, the cosmological constant, and the geometry of
              spacetime.
            </p>

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

      {/* What we do */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-16">
          Where Code Meets Curvature
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            symbol="G&#x3BC;&#x3BD;"
            title="General Relativity"
            description="Einstein field equations, geodesics, and the geometry of spacetime — derived and simulated in code."
          />
          <Card
            symbol="&Lambda;"
            title="The Cosmological Constant"
            description="The worst prediction in physics: why does vacuum energy disagree with observation by 120 orders of magnitude?"
          />
          <Card
            symbol="&#x2207;"
            title="AI Visualization"
            description="Generative AI as an imagination engine — rendering what equations describe but humans can't see."
          />
        </div>
      </section>

      {/* Approach */}
      <section className="px-6 py-24 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Approach</h2>
          <div className="space-y-8">
            <Step
              number={1}
              title="Derive"
              description="Start from first principles. Work through the mathematics of general relativity, cosmology, and quantum field theory."
            />
            <Step
              number={2}
              title="Simulate"
              description="Translate equations into code. Run numerical simulations of cosmic expansion, gravitational dynamics, and dark energy models."
            />
            <Step
              number={3}
              title="Imagine"
              description="Use generative AI to visualize what the math describes — curved spacetime, vacuum fluctuations, the accelerating universe."
            />
            <Step
              number={4}
              title="Share"
              description="Publish articles, videos, and interactive visualizations that make frontier physics accessible and beautiful."
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Latest</h2>
        <div className="space-y-6">
          <a
            href="/cosmological-constant"
            className="block rounded-xl border border-surface-light bg-surface p-8 hover:border-accent transition-colors group"
          >
            <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
              Chapter 02
            </p>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
              The Cosmological Constant Problem
            </h3>
            <p className="text-muted leading-relaxed">
              The worst prediction in physics — quantum field theory overshoots
              the observed vacuum energy by 10<sup>121</sup>. Interactive
              visualization of the discrepancy and five proposed solutions.
            </p>
            <p className="mt-4 text-sm text-accent font-mono">
              Explore the problem &rarr;
            </p>
          </a>
          <a
            href="/friedmann"
            className="block rounded-xl border border-surface-light bg-surface p-8 hover:border-accent transition-colors group"
          >
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-accent mb-2">
                  Chapter 01
                </p>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                  The Friedmann Equations
                </h3>
                <p className="text-muted leading-relaxed">
                  The master equations of cosmic expansion — derived, explained,
                  and simulated with an interactive visualization. Toggle dark
                  energy on and off to see 200 galaxies accelerate or decelerate
                  in real time.
                </p>
                <p className="mt-4 text-sm text-accent font-mono">
                  Read &amp; simulate &rarr;
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-surface-light/70 bg-background/50 p-2">
                <Image
                  src="/visuals/friedmann-expansion.svg"
                  alt="An expanding-universe illustration with galaxies moving outward from a common origin."
                  width={1600}
                  height={900}
                  className="h-auto w-full rounded-[1rem]"
                />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Topics */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-16">
          Research Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Topic
            title="Dark Energy & Accelerating Expansion"
            tags={["Type Ia Supernovae", "BAO", "Equation of State"]}
          />
          <Topic
            title="The Cosmological Constant Problem"
            tags={["Vacuum Energy", "10^120 Discrepancy", "Fine-Tuning"]}
          />
          <Topic
            title="Friedmann Equations & Cosmic Evolution"
            tags={["Scale Factor", "Deceleration Parameter", "LCDM"]}
          />
          <Topic
            title="The Hubble Tension"
            tags={["H0 Discrepancy", "Early vs Late Universe", "New Physics?"]}
          />
          <Topic
            title="Modified Gravity Theories"
            tags={["f(R) Gravity", "DGP", "Emergent Gravity"]}
          />
          <Topic
            title="Computational Methods"
            tags={["Numerical Relativity", "SymPy", "Neural ODEs"]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-surface-light text-center text-sm text-muted">
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

function Card({
  symbol,
  title,
  description,
}: {
  symbol: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-8 hover:border-accent-dim transition-colors">
      <div
        className="text-4xl font-mono text-accent mb-4"
        dangerouslySetInnerHTML={{ __html: symbol }}
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-dim flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Topic({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-6 hover:border-accent-dim transition-colors">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-light text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
