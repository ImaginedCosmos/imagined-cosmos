import Link from "next/link";

const CHAPTERS = [
  { number: "01", title: "The Friedmann Equations", href: "/friedmann" },
  { number: "02", title: "The Cosmological Constant Problem", href: "/cosmological-constant" },
  { number: "03", title: "What the Universe Has Told Us Since Einstein", href: "/since-einstein" },
  { number: "04", title: "The Solution", href: "/solution" },
];

export default function ChapterFooterNav({ current }: { current: string }) {
  const idx = CHAPTERS.findIndex((c) => c.number === current);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

  return (
    <nav className="max-w-4xl mx-auto w-full px-6 py-12 grid grid-cols-2 gap-4 border-t border-surface-light mt-8">
      <div>
        {prev && (
          <Link
            href={prev.href}
            className="group flex flex-col gap-1 rounded-xl border border-surface-light bg-surface p-5 hover:border-accent-dim/60 transition-colors"
          >
            <span className="text-xs font-mono text-muted group-hover:text-accent transition-colors">
              ← Chapter {prev.number}
            </span>
            <span className="text-sm font-semibold leading-snug">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="flex justify-end">
        {next && (
          <Link
            href={next.href}
            className="group flex flex-col gap-1 rounded-xl border border-surface-light bg-surface p-5 hover:border-accent-dim/60 transition-colors text-right w-full"
          >
            <span className="text-xs font-mono text-muted group-hover:text-accent transition-colors">
              Chapter {next.number} →
            </span>
            <span className="text-sm font-semibold leading-snug">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
