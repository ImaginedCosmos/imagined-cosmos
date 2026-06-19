---
name: Bug report
about: Report a defect in the physics engine, eval harness, site, or docs
title: "[Bug]: "
labels: ["bug"]
assignees: []
---

<!--
Imagined Cosmos is a *reproduction* of published Running Vacuum Model (RVM)
physics, not a source of new results. If your report is about a physics value
that "looks wrong," please check it against the cited literature in the README
and /papers first, and link the relevant equation or paper if possible.

For security vulnerabilities, do NOT open an issue — see SECURITY.md.
-->

## Summary

A clear, concise description of the bug.

## Affected area

- [ ] Physics engine (`src/lib/physics/`)
- [ ] Eval / reproducibility harness (`eval/`)
- [ ] Site / UI (`src/app/`, `src/components/`)
- [ ] Docs / whitepaper
- [ ] Build / CI / tooling
- [ ] Other (describe below)

## Steps to reproduce

1.
2.
3.

## Expected behavior

What you expected to happen. If this concerns a numerical result, state the
expected value and its source (equation, paper, or eval assertion).

## Actual behavior

What actually happened. Include exact numbers, error messages, or stack traces.

## Reproduction details

- How were you running it? (`npm run dev` / `npm run build` / `npm run eval` / other)
- Node version (`node -v`):
- OS / browser (if a UI issue):
- Commit or version:

## Logs / screenshots

```
paste relevant output here
```

## Additional context

Anything else that helps — links to the relevant physics citation, a minimal
input that triggers the issue, etc.
