"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { optimizationTrace, bestFit, optimizationTraceCVC2, bestFitCVC2 } from "@/lib/physics/optimizer";
import { computeResiduals, convergenceStatus, statusLabel, statusColor } from "@/lib/physics/likelihood";
import { computePredictions } from "@/lib/physics/theory";
import { CONSTRAINTS } from "@/lib/physics/data";
import IterationPanel from "./IterationPanel";
import Chi2Chart from "./Chi2Chart";
import WoWaTrajectory from "./WoWaTrajectory";

type LoopPhase = "idle" | "running" | "done";
type RevisionPhase = "idle" | "running" | "done";

const STEP_INTERVAL_MS = 380;

export default function SolverLoop() {
  const [phase, setPhase] = useState<LoopPhase>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revisionPhase, setRevisionPhase] = useState<RevisionPhase>("idle");
  const [revisionIndex, setRevisionIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-compute full optimization traces (deterministic, runs once)
  const trace = optimizationTrace(CONSTRAINTS, 0, 40);
  const best = bestFit(CONSTRAINTS);
  const best2 = bestFitCVC2(CONSTRAINTS);
  const trace2 = optimizationTraceCVC2(CONSTRAINTS, best.nu, 20);

  const currentStep = trace[currentIndex] ?? trace[0];
  const currentPred = computePredictions({ nu: currentStep.nu });
  const currentResid = computeResiduals(currentPred, CONSTRAINTS);
  const status = convergenceStatus(currentResid, currentStep.nu, best.nu);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const stopRevision = useCallback(() => {
    if (revTimerRef.current) clearInterval(revTimerRef.current);
    revTimerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();
    stopRevision();
    setCurrentIndex(0);
    setPhase("idle");
    setRevisionIndex(0);
    setRevisionPhase("idle");
  }, [stop, stopRevision]);

  const start = useCallback(() => {
    setPhase("running");
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= trace.length) {
          stop();
          setPhase("done");
          return prev;
        }
        return next;
      });
    }, STEP_INTERVAL_MS);
  }, [trace.length, stop]);

  const startRevision = useCallback(() => {
    setRevisionPhase("running");
    revTimerRef.current = setInterval(() => {
      setRevisionIndex((prev) => {
        const next = prev + 1;
        if (next >= trace2.length) {
          stopRevision();
          setRevisionPhase("done");
          return prev;
        }
        return next;
      });
    }, STEP_INTERVAL_MS);
  }, [trace2.length, stopRevision]);

  useEffect(() => () => { stop(); stopRevision(); }, [stop, stopRevision]);

  // Auto-stop when converged or falsified
  useEffect(() => {
    if (phase === "running" && (status === "converged" || status === "falsified")) {
      stop();
      setPhase("done");
    }
  }, [phase, status, stop]);

  const isDone = phase === "done";
  const isRunning = phase === "running";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={isRunning ? stop : start}
          disabled={isDone}
          className={`px-5 py-2 rounded-lg text-sm font-mono transition-colors ${
            isDone
              ? "bg-surface-light text-muted/40 cursor-not-allowed"
              : isRunning
              ? "bg-surface-light text-muted hover:bg-surface-light"
              : "bg-accent/20 text-violet-300 hover:bg-accent/30"
          }`}
        >
          {isRunning ? "⏸ Pause" : isDone ? "✓ Complete" : "▶ Run Loop"}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg text-sm font-mono text-muted hover:text-foreground transition-colors border border-surface-light"
        >
          ↺ Reset
        </button>

        {/* Progress bar */}
        <div className="flex-1 min-w-32 h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500/60 transition-all duration-300"
            style={{ width: `${(currentIndex / (trace.length - 1)) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-muted/50">
          {currentIndex}/{trace.length - 1}
        </span>
      </div>

      {/* Current iteration display */}
      <IterationPanel
        step={currentStep}
        status={status}
        bestNu={best.nu}
        targetW0={CONSTRAINTS.w0}
        targetWa={CONSTRAINTS.wa}
      />

      {/* Side-by-side charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-mono text-muted/50 uppercase tracking-wider mb-2">
            χ² convergence
          </p>
          <Chi2Chart steps={trace} currentIndex={currentIndex} />
        </div>
        <div>
          <p className="text-xs font-mono text-muted/50 uppercase tracking-wider mb-2">
            w₀–wₐ trajectory
          </p>
          <WoWaTrajectory
            cvc1Steps={trace}
            currentIndex={currentIndex}
            cvc2Steps={revisionPhase !== "idle" ? trace2 : undefined}
            revisionIndex={revisionIndex}
          />
        </div>
      </div>

      {/* Final verdict */}
      {isDone && (
        <div
          className={`rounded-xl border p-6 ${
            status === "converged"
              ? "border-emerald-700/50 bg-emerald-950/20"
              : status === "falsified"
              ? "border-red-700/50 bg-red-950/20"
              : "border-amber-700/50 bg-amber-950/20"
          }`}
        >
          <p className={`text-xs font-mono uppercase tracking-wider mb-3 ${statusColor(status)}`}>
            {statusLabel(status)}
          </p>

          {status === "converged" && (
            <>
              <p className="text-foreground font-semibold mb-2">
                Best-fit ν = {best.nu.toFixed(4)}
              </p>
              <p className="text-sm text-muted leading-relaxed mb-4">
                The H²-line model is disfavoured: its best fit reaches only χ² ={" "}
                {best.chi2_desi.toFixed(2)} at ({best.w0.toFixed(3)}, {best.wa.toFixed(3)}) —{" "}
                {best.sigma_desi.toFixed(1)}σ from DESI. The fit collapses toward ΛCDM
                (ν → {best.nu.toFixed(2)}), and on the CVC ray wₐ = +3(1 + w₀) the model
                gives wₐ &gt; 0, whereas DESI prefers wₐ &lt; 0. Reaching the DESI best-fit
                requires the off-line CVC-2.0 / H⁴ extension.
              </p>
              <div className="text-xs font-mono text-emerald-400/70 space-y-1">
                <p>ν_best = {best.nu.toFixed(4)}</p>
                <p>w₀ = {best.w0.toFixed(4)}  (DESI: {CONSTRAINTS.w0})</p>
                <p>wₐ = {best.wa.toFixed(4)}  (DESI: {CONSTRAINTS.wa})</p>
                <p>wₐ − 3(1+w₀) = {(best.wa - 3 * (1 + best.w0)).toFixed(6)}  [CVC residual]</p>
              </div>
            </>
          )}

          {status === "needs_revision" && (
            <>
              <p className="text-foreground font-semibold mb-2">
                Best-fit ν₁ = {best.nu.toFixed(4)}, χ² = {best.chi2_desi.toFixed(2)} — revision triggered
              </p>
              <p className="text-sm text-muted leading-relaxed mb-4">
                CVC-1.0 finds its minimum inside the DESI ellipse for w₀ but not the
                full (w₀, wₐ) combination. The loop advances to CVC-2.0: an H⁴ correction
                term ν₂ is added, breaking the wₐ = +3(1+w₀) constraint line and giving
                the theory an extra degree of freedom to approach the DESI best-fit.
              </p>
            </>
          )}

          {status === "falsified" && (
            <>
              <p className="text-foreground font-semibold mb-2">
                Theory falsified at best-fit ν = {best.nu.toFixed(4)}
              </p>
              <p className="text-sm text-muted leading-relaxed">
                No value of ν produces χ² ≤ 25 against the current data. The
                CVC constraint line does not pass through the observational ellipse.
                The loop must return to the Theory Engine and revise the underlying
                mechanism.
              </p>
            </>
          )}
        </div>
      )}

      {/* CVC-2.0 Revision Loop — shown when CVC-1.0 needs revision */}
      {isDone && status === "needs_revision" && (
        <div className="rounded-xl border border-amber-700/40 bg-amber-950/10 p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                CVC-2.0 — Theory Revision
              </p>
              <p className="text-sm text-muted leading-relaxed">
                H⁴ correction: ρ_Λ(H) = ρ_Λ₀ + ν₁M_P²(H²−H₀²) + ν₂M_P²(H⁴−H₀⁴)/H₀²
              </p>
            </div>
            {revisionPhase === "idle" && (
              <button
                onClick={startRevision}
                className="px-4 py-2 rounded-lg text-sm font-mono bg-amber-900/30 text-amber-300 border border-amber-700/40 hover:bg-amber-900/50 transition-colors"
              >
                ▶ Run CVC-2.0
              </button>
            )}
            {revisionPhase === "running" && (
              <button
                onClick={stopRevision}
                className="px-4 py-2 rounded-lg text-sm font-mono bg-surface-light text-muted hover:bg-surface-light transition-colors"
              >
                ⏸ Pause
              </button>
            )}
          </div>

          {revisionPhase !== "idle" && (
            <>
              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500/50 transition-all duration-300"
                    style={{ width: `${(revisionIndex / Math.max(trace2.length - 1, 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-muted/50">
                  {revisionIndex}/{trace2.length - 1}
                </span>
              </div>

              {/* Current CVC-2.0 step */}
              {(() => {
                const step2 = trace2[revisionIndex] ?? trace2[0];
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "ν₁ (fixed)", value: step2.nu1.toFixed(4), sub: "CVC-1.0 best" },
                      { label: "ν₂ (H⁴)", value: step2.nu2.toFixed(4), sub: "correction term" },
                      { label: "χ² (DESI)", value: step2.chi2_desi.toFixed(3), sub: `${step2.sigma_desi.toFixed(2)}σ from DESI` },
                      { label: "wₐ−CVC line", value: step2.wa !== undefined ? (step2.wa - 3 * (1 + step2.w0)).toFixed(4) : "—", sub: "off-line offset" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-surface-light bg-surface px-4 py-3">
                        <p className="text-xs font-mono text-muted/60 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-xl font-bold font-mono text-foreground">{s.value}</p>
                        <p className="text-xs text-muted/50 mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* CVC-2.0 chi2 chart */}
              <div>
                <p className="text-xs font-mono text-muted/50 uppercase tracking-wider mb-2">
                  χ² convergence — CVC-2.0 (ν₂ iteration)
                </p>
                <Chi2Chart steps={trace2} currentIndex={revisionIndex} />
              </div>
            </>
          )}

          {/* CVC-2.0 final verdict */}
          {revisionPhase === "done" && (() => {
            const finalStep = trace2[trace2.length - 1];
            const improved = finalStep.chi2_desi < best.chi2_desi;
            const converged2 = finalStep.chi2_desi <= 4.0;
            return (
              <div className={`rounded-xl border p-5 ${converged2 ? "border-emerald-700/50 bg-emerald-950/20" : "border-amber-700/40 bg-amber-950/10"}`}>
                <p className={`text-xs font-mono uppercase tracking-wider mb-3 ${converged2 ? "text-emerald-400" : "text-amber-400"}`}>
                  {converged2 ? "CVC-2.0 Converged" : "CVC-2.0 — Partial Improvement"}
                </p>
                <p className="text-foreground font-semibold mb-2">
                  ν₁ = {best2.nu1.toFixed(4)}, ν₂ = {best2.nu2.toFixed(4)} → χ² = {best2.chi2_desi.toFixed(2)} ({best2.sigma_desi.toFixed(2)}σ)
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  {improved
                    ? `CVC-2.0 reduces χ² from ${best.chi2_desi.toFixed(2)} to ${best2.chi2_desi.toFixed(2)} — a ${(best.chi2_desi - best2.chi2_desi).toFixed(2)} improvement. `
                    : `χ² unchanged — ν₂ ≈ 0, the H⁴ correction is negligible for this dataset. `}
                  {converged2
                    ? "The two-parameter theory converges. DESI DR2 will test whether ν₂ ≠ 0 is real signal or noise."
                    : "The theory still needs revision — the w₀–wₐ combination requires a mechanism beyond H⁴ running. Loop continues to deeper revision."}
                </p>
                <div className="text-xs font-mono text-amber-400/60 space-y-1 mt-3">
                  <p>CVC-1.0: w₀={best.w0.toFixed(4)}, wₐ={best.wa.toFixed(4)}, χ²={best.chi2_desi.toFixed(3)}</p>
                  <p>CVC-2.0: w₀={best2.w0.toFixed(4)}, wₐ={best2.wa.toFixed(4)}, χ²={best2.chi2_desi.toFixed(3)}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Architecture legend */}
      <div className="rounded-xl border border-surface-light/40 bg-surface/20 p-5">
        <p className="text-xs font-mono text-muted/50 uppercase tracking-wider mb-3">
          Loop architecture
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {[
            ["Theory Engine", "lib/physics/theory.ts", "violet"],
            ["Data Engine", "lib/physics/data.ts", "blue"],
            ["Likelihood", "lib/physics/likelihood.ts", "amber"],
            ["Optimizer", "lib/physics/optimizer.ts", "emerald"],
            ["Loop UI", "components/solver/", "slate"],
          ].map(([label, path, color]) => (
            <div
              key={label}
              className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border border-surface-light bg-surface`}
            >
              <span className={`text-${color}-400/80`}>{label}</span>
              <span className="text-muted/40">{path}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted/40 mt-3 leading-relaxed">
          Each component is isolated — zero coupling between engines. The loop
          controller holds all state; engines are pure functions. Swap any engine
          without touching the others.
        </p>
      </div>
    </div>
  );
}
