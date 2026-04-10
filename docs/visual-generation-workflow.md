# Visual generation workflow

Issue: `imagined-cosmos#3`

## Current shipping approach

The site now ships a first-pass visual system as repo-native SVG illustrations:

- `public/visuals/cosmic-hero.svg`
- `public/visuals/friedmann-expansion.svg`
- `public/visuals/friedmann-scale-factor.svg`

Why SVG first:

- deterministic and versionable in git
- no external asset hosting or opaque binaries
- fast rendering on dark backgrounds
- easy to refine alongside the copy and equations

## Preferred AI workflow for future raster variants

If we later want painterly or more cinematic assets, the preferred workflow is:

1. Keep the composition direction and prompt text in-repo.
2. Generate candidate images in a Flux-class model workflow.
3. Export approved images as WebP or AVIF.
4. Commit only the approved optimized asset, not the entire prompt experiment set.

## Prompt direction

### Landing page hero

`deep-space visualization, spacetime grid bending into a luminous cosmic core, rich indigo and ultraviolet palette, scientific not fantasy, elegant high-contrast composition, subtle equation texture, premium editorial illustration`

### Friedmann chapter

`expanding universe diagram, concentric cosmic shells, galaxy markers radiating outward, clean scientific composition, ultraviolet and magenta nebula glow, suitable for a physics article hero image`

### Scale-factor companion visual

`cosmic expansion curve, elegant chart-like composition, dark background, luminous violet and cyan trajectory, scientific editorial illustration, premium minimal style`

## Guardrails

- avoid generic astronaut / planet / stock-nebula imagery
- prioritize equation-led and geometry-led compositions
- keep the palette within the existing dark-indigo brand system
- every visual should feel like computational cosmology, not sci-fi poster art
