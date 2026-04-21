import Link from "next/link";

const CHAPTERS: { number: string; title: string; short: string; href: string }[] = [
  { number: "01", title: "Friedmann Equations", short: "Friedmann", href: "/friedmann" },
  { number: "02", title: "The Λ Problem", short: "Λ Problem", href: "/cosmological-constant" },
  { number: "03", title: "The Evidence", short: "Evidence", href: "/since-einstein" },
  { number: "04", title: "The Solution", short: "Solution", href: "/solution" },
];

export default function ChapterNav({ current }: { current: string }) {
  return (
    <nav className="px-4 py-3 border-b border-surface-light bg-background/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        {/* Home link — hidden on mobile to save space */}
        <Link
          href="/"
          className="hidden sm:block text-sm font-mono text-muted hover:text-accent transition-colors whitespace-nowrap flex-shrink-0 mr-1"
        >
          Imagined Cosmos
        </Link>
        <span className="hidden sm:block text-surface-light flex-shrink-0 select-none mr-1">—</span>

        {/* Chapter links — horizontally scrollable */}
        <div className="flex items-center gap-0.5 overflow-x-auto min-w-0 scrollbar-none">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.number}
              href={ch.href}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap flex-shrink-0 ${
                current === ch.number
                  ? "bg-accent/20 text-violet-300"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {/* Short label on mobile, full on sm+ */}
              <span className="sm:hidden">Ch.{ch.number}</span>
              <span className="hidden sm:inline">Ch.{ch.number} {ch.title}</span>
            </Link>
          ))}
          <Link
            href="/papers"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap flex-shrink-0 ${
              current === "papers"
                ? "bg-accent/20 text-violet-300"
                : "text-muted hover:text-foreground"
            }`}
          >
            Papers
          </Link>
          <Link
            href="/models"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap flex-shrink-0 ${
              current === "models"
                ? "bg-accent/20 text-violet-300"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="sm:hidden">Models</span>
            <span className="hidden sm:inline">Why Solutions Fail</span>
          </Link>
          <Link
            href="/solve"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap flex-shrink-0 ${
              current === "solve"
                ? "bg-emerald-500/20 text-emerald-300"
                : "text-emerald-500/70 hover:text-emerald-300"
            }`}
          >
            <span className="sm:hidden">Solve</span>
            <span className="hidden sm:inline">⟳ Solver</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
