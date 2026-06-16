import type { Metadata } from "next";
import ChapterNav from "@/components/ChapterNav";

export const metadata: Metadata = {
  title: "Scientific Papers — Imagined Cosmos",
  description:
    "The foundational and modern literature on dark energy, the cosmological constant, general relativity, and the observations that shape our understanding of the universe.",
  openGraph: {
    title: "Scientific Papers — Imagined Cosmos",
    description:
      "The foundational and modern literature on dark energy, the cosmological constant, general relativity, and the observations that shape our understanding of the universe.",
    url: "https://imagined-cosmos.example.com/papers",
  },
  twitter: {
    title: "Scientific Papers — Imagined Cosmos",
    description:
      "The foundational and modern literature on dark energy, the cosmological constant, general relativity, and the observations that shape our understanding of the universe.",
  },
};

interface Paper {
  title: string;
  authors: string;
  year: number;
  venue: string;
  arxiv?: string;
  doi?: string;
  annotation: string;
}

const SECTIONS: { heading: string; description: string; papers: Paper[] }[] = [
  {
    heading: "Foundations",
    description:
      "The theoretical and observational papers that built modern cosmology from the ground up.",
    papers: [
      {
        title:
          "Kosmologische Betrachtungen zur allgemeinen Relativitätstheorie",
        authors: "Einstein, A.",
        year: 1917,
        venue: "Sitzungsberichte der Preussischen Akademie der Wissenschaften",
        annotation:
          "Einstein introduces the cosmological constant Λ to obtain a static universe — the paper that started everything. The constant he added \"to hold the universe still\" turns out to describe the dominant component of the cosmos.",
      },
      {
        title: "Über die Krümmung des Raumes",
        authors: "Friedmann, A.",
        year: 1922,
        venue: "Zeitschrift für Physik",
        annotation:
          "Friedmann derives the equations governing an expanding or contracting homogeneous, isotropic universe directly from GR — seven years before Hubble's observation. The Friedmann equations remain the backbone of all modern cosmology.",
      },
      {
        title:
          "A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae",
        authors: "Hubble, E.",
        year: 1929,
        venue: "Proceedings of the National Academy of Sciences",
        doi: "10.1073/pnas.15.3.168",
        annotation:
          "Using Cepheid variable distances, Hubble establishes v = H₀d — galaxies recede in proportion to their distance. The first empirical proof of an expanding universe; Einstein removes Λ shortly afterward.",
      },
      {
        title: "The Cosmological Constant",
        authors: "Carroll, S. M.",
        year: 2001,
        venue: "Living Reviews in Relativity",
        arxiv: "astro-ph/0004075",
        annotation:
          "The standard reference review: history of Λ, observational evidence, the fine-tuning problem, and all proposed solutions. Essential reading before approaching any proposed solution to the cosmological constant problem.",
      },
    ],
  },
  {
    heading: "Discovery of Accelerating Expansion",
    description:
      "The Nobel Prize-winning papers that proved dark energy is real.",
    papers: [
      {
        title:
          "Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant",
        authors: "Riess, A. G. et al. (High-Z Supernova Search Team)",
        year: 1998,
        venue: "The Astronomical Journal",
        arxiv: "astro-ph/9805201",
        doi: "10.1086/300499",
        annotation:
          "First direct evidence of accelerating expansion: high-redshift Type Ia supernovae are 10–15% fainter than a decelerating universe predicts. Together with Perlmutter et al., these results revolutionized cosmology and earned the 2011 Nobel Prize.",
      },
      {
        title:
          "Measurements of Ω and Λ from 42 High-Redshift Supernovae",
        authors: "Perlmutter, S. et al. (Supernova Cosmology Project)",
        year: 1999,
        venue: "The Astrophysical Journal",
        arxiv: "astro-ph/9812133",
        doi: "10.1086/307221",
        annotation:
          "Independent confirmation using 42 SNe Ia. Constrains Ωm ≈ 0.28, ΩΛ ≈ 0.72, ruling out a matter-only or flat matter universe. The two papers together constitute the observational foundation for dark energy.",
      },
      {
        title:
          "A 3% Solution: Determination of the Hubble Constant with the Hubble Space Telescope and Wide Field Camera 3",
        authors: "Riess, A. G. et al. (SH0ES)",
        year: 2011,
        venue: "The Astrophysical Journal",
        arxiv: "1103.2976",
        doi: "10.1088/0004-637X/730/2/119",
        annotation:
          "The first high-precision local H₀ measurement: 73.8 ± 2.4 km/s/Mpc. The beginning of the Hubble tension — a discrepancy with CMB-derived values that has only sharpened with subsequent measurements.",
      },
    ],
  },
  {
    heading: "CMB & Precision Cosmology",
    description:
      "Satellite measurements of the Cosmic Microwave Background that established the standard cosmological model.",
    papers: [
      {
        title:
          "First-Year Wilkinson Microwave Anisotropy Probe (WMAP) Observations: Determination of Cosmological Parameters",
        authors: "Spergel, D. N. et al.",
        year: 2003,
        venue: "The Astrophysical Journal Supplement Series",
        arxiv: "astro-ph/0302209",
        doi: "10.1086/377226",
        annotation:
          "First precision CMB power spectrum from WMAP: flat geometry confirmed, ΩΛ ≈ 0.73. Established six-parameter ΛCDM as the standard model of cosmology.",
      },
      {
        title:
          "Planck 2018 results. VI. Cosmological parameters",
        authors: "Planck Collaboration",
        year: 2020,
        venue: "Astronomy & Astrophysics",
        arxiv: "1807.06209",
        doi: "10.1051/0004-6361/201833910",
        annotation:
          "Gold-standard CMB measurement: ΩΛ = 0.685 ± 0.007, H₀ = 67.36 ± 0.54, w₀ = −1.03 ± 0.03. The tension with local H₀ measurements exceeds 4σ in this data release.",
      },
    ],
  },
  {
    heading: "The Cosmological Constant Problem",
    description:
      "Why does quantum field theory predict a vacuum energy 10¹²¹ times larger than observed?",
    papers: [
      {
        title: "The Cosmological Constant Problem",
        authors: "Weinberg, S.",
        year: 1989,
        venue: "Reviews of Modern Physics",
        doi: "10.1103/RevModPhys.61.1",
        annotation:
          "Weinberg's foundational review that introduced the cosmological constant problem to the wider physics community. Derives the 10¹²⁰ discrepancy from quantum field theory, surveys historical attempts at solution, and introduces the anthropic argument. Still the clearest statement of the problem.",
      },
      {
        title:
          "The Cosmological Constant and Dark Energy",
        authors: "Peebles, P. J. E. and Ratra, B.",
        year: 2003,
        venue: "Reviews of Modern Physics",
        arxiv: "astro-ph/0207347",
        doi: "10.1103/RevModPhys.75.559",
        annotation:
          "Comprehensive review of dark energy observations and the theoretical landscape — including quintessence, k-essence, and modified gravity — up to 2003. A companion to the Weinberg review from the observational side.",
      },
    ],
  },
  {
    heading: "DESI & Modern Surveys",
    description:
      "The most recent and most precise measurements of dark energy's equation of state.",
    papers: [
      {
        title:
          "DESI 2024 VI: Cosmological Constraints from the Measurements of Baryon Acoustic Oscillations",
        authors: "DESI Collaboration",
        year: 2024,
        venue: "arXiv preprint",
        arxiv: "2404.03002",
        annotation:
          "First data release from the DESI survey: BAO measurements from 6 million galaxy and quasar spectra across 11 redshift bins. Combined with CMB and supernovae, finds w₀ ≈ −0.73, wₐ ≈ −1.05 — 2.5–3.9σ from the pure cosmological constant (w₀ = −1, wₐ = 0). The strongest evidence yet that dark energy may be dynamical.",
      },
      {
        title:
          "DESI 2024 III: Baryon Acoustic Oscillations from Galaxies and Quasars",
        authors: "DESI Collaboration",
        year: 2024,
        venue: "arXiv preprint",
        arxiv: "2404.03000",
        annotation:
          "The measurement paper underlying DESI 2024 VI — BAO detection at multiple redshifts, from bright galaxy sample through quasars at z ≈ 2.1. Establishes the standard ruler distances used to constrain dark energy.",
      },
      {
        title:
          "A Comprehensive Measurement of the Local Value of the Hubble Constant with 1 km/s/Mpc Uncertainty from the Hubble Space Telescope and the SHOES Team",
        authors: "Riess, A. G. et al.",
        year: 2022,
        venue: "The Astrophysical Journal Letters",
        arxiv: "2112.04510",
        doi: "10.3847/2041-8213/ac5c5b",
        annotation:
          "H₀ = 73.04 ± 1.04 km/s/Mpc — the most precise local measurement. Combined with Planck, the tension is 5σ. This paper established that the Hubble tension is not going away with better data; it is getting worse.",
      },
    ],
  },
  {
    heading: "CVC Theory — Foundational Papers",
    description:
      "The mechanistic results underlying the Causal Vacuum Correspondence: holographic UV cutoffs, horizon thermodynamics, and running vacuum phenomenology.",
    papers: [
      {
        title:
          "Effective Field Theory, Black Holes, and the Cosmological Constant",
        authors: "Cohen, A. G., Kaplan, D. B., Nelson, A. E.",
        year: 1999,
        venue: "Physical Review Letters",
        arxiv: "hep-th/9810169",
        doi: "10.1103/PhysRevLett.82.4971",
        annotation:
          "The CKN bound: any QFT in a volume L³ must have zero-point energy below M_P²/L² — otherwise the system collapses into a black hole. Setting the IR cutoff at the Hubble horizon L = H⁻¹ immediately gives ρ_vac ≤ M_P²H². The 10¹²¹ discrepancy is not a fine-tuning crisis; it is the result of using the wrong UV cutoff.",
      },
      {
        title:
          "Cosmological Event Horizons, Thermodynamics, and Particle Creation",
        authors: "Gibbons, G. W., Hawking, S. W.",
        year: 1977,
        venue: "Physical Review D",
        doi: "10.1103/PhysRevD.15.2738",
        annotation:
          "The de Sitter horizon radiates at the Gibbons–Hawking temperature T_GH = ℏH/(2πk_B c) — a thermodynamic quantity set entirely by the Hubble rate, not by M_P. CVC's interpretation of dark energy as the back-pressure of the cosmological causal boundary is grounded in this result. Dark energy is the thermodynamic equilibrium condition of the universe's own horizon.",
      },
      {
        title:
          "Running Vacuum in the Universe: Phenomenological Status in Light of the Latest Observations",
        authors: "Solà Peracaula, J., de Cruz Pérez, J.",
        year: 2022,
        venue: "Universe",
        annotation:
          "Systematic comparison of the Running Vacuum Model — ρ_Λ(H) = ρ_Λ₀ + 3νM_P²(H² − H₀²)/8π — against Planck, BAO, and CMB data. Finds a mild but consistent preference for ν ≠ 0. Sets the observational baseline that DESI subsequently sharpened, and is the primary RVM phenomenology reference used in the CVC solver.",
      },
      {
        title:
          "Running Vacuum in the Universe and the Hubble Tension: Comparison with Observational Data",
        authors: "Solà Peracaula, J., de Cruz Pérez, J.",
        year: 2024,
        venue: "arXiv preprint",
        annotation:
          "Analysis of the Running Vacuum Model in light of DESI DR1 constraints. Shows that RVM provides an improved fit to the DESI + Planck + SNIa combination, with ν strongly constrained by the BAO data. The observational grounding for the CVC-1.0 solver's predictions and the tension with the SM value |ν_SM| ~ 10⁻³.",
      },
    ],
  },
];

function ExternalLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-surface-light text-muted hover:text-accent hover:bg-accent/10 transition-colors"
    >
      {label} ↗
    </a>
  );
}

export default function PapersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ChapterNav current="papers" />

      <div className="max-w-4xl mx-auto w-full px-6 py-16">
        <header className="mb-16">
          <p className="text-sm font-mono tracking-widest uppercase text-accent mb-4">
            Bibliography
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Scientific Papers
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            The literature behind Imagined Cosmos — from Einstein&apos;s 1917
            cosmological constant to DESI&apos;s 2024 discovery that dark
            energy may be evolving. Annotated for context.
          </p>
        </header>

        <div className="space-y-20">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{section.heading}</h2>
                <p className="text-muted text-sm leading-relaxed max-w-2xl">
                  {section.description}
                </p>
              </div>
              <div className="space-y-5">
                {section.papers.map((paper) => (
                  <div
                    key={paper.title}
                    className="rounded-xl border border-surface-light bg-surface p-6 hover:border-accent-dim/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground leading-snug mb-1">
                          {paper.title}
                        </h3>
                        <p className="text-xs font-mono text-muted">
                          {paper.authors} · {paper.year} · {paper.venue}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {paper.arxiv && (
                          <ExternalLink
                            href={`https://arxiv.org/abs/${paper.arxiv}`}
                            label="arXiv"
                          />
                        )}
                        {paper.doi && (
                          <ExternalLink
                            href={`https://doi.org/${paper.doi}`}
                            label="DOI"
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {paper.annotation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

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
