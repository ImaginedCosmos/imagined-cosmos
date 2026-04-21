"use client";

import type { OptimizerStep } from "@/lib/physics/optimizer";
import type { ConvergenceStatus } from "@/lib/physics/likelihood";
import { statusLabel, statusColor } from "@/lib/physics/likelihood";

function StatBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 ${
        highlight
          ? "border-emerald-700/50 bg-emerald-950/20"
          : "border-surface-light bg-surface"
      }`}
    >
      <p className="text-xs font-mono text-muted/60 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold font-mono ${highlight ? "text-emerald-300" : "text-foreground"}`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-muted/50 mt-0.5">{sub}</p>}
    </div>
  );
}

type Props = {
  step: OptimizerStep;
  status: ConvergenceStatus;
  bestNu: number;
  targetW0: number;
  targetWa: number;
};

export default function IterationPanel({
  step,
  status,
  bestNu,
  targetW0,
  targetWa,
}: Props) {
  const sigmaStr =
    step.sigma_desi < 1
      ? `${step.sigma_desi.toFixed(2)}σ`
      : `${step.sigma_desi.toFixed(2)}σ`;

  const nuStr = step.nu.toFixed(4);
  const w0Str = step.w0.toFixed(4);
  const waStr = step.wa.toFixed(4);

  const deltaW0 = Math.abs(step.w0 - targetW0).toFixed(4);
  const deltaWa = Math.abs(step.wa - targetWa).toFixed(4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted/60">
            Iteration {step.iteration}
          </span>
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-full ${statusColor(status)} bg-surface-light`}
          >
            {statusLabel(status)}
          </span>
        </div>
        <span className="text-xs font-mono text-muted/40">
          ν* = {bestNu.toFixed(4)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="ν (current)" value={nuStr} sub="running coefficient" highlight={status === "converged"} />
        <StatBox label="χ² (DESI)" value={step.chi2_desi.toFixed(3)} sub={sigmaStr + " from DESI"} />
        <StatBox label="w₀ predicted" value={w0Str} sub={`Δ = ${deltaW0} from DESI`} />
        <StatBox label="wₐ predicted" value={waStr} sub={`Δ = ${deltaWa} from DESI`} />
      </div>

      {/* Gradient arrow */}
      <div className="rounded-xl border border-surface-light bg-surface px-5 py-4">
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="text-muted/60">∂χ²/∂ν</span>
          <span
            className={
              step.gradient > 0 ? "text-red-400" : step.gradient < 0 ? "text-emerald-400" : "text-muted"
            }
          >
            {step.gradient > 0 ? "▲" : step.gradient < 0 ? "▼" : "—"}{" "}
            {step.gradient.toFixed(4)}
          </span>
          <span className="text-muted/40 mx-2">→</span>
          <span className="text-muted/60">Δν</span>
          <span className="text-violet-300">{step.step_size.toFixed(5)}</span>
          <span className="text-muted/40 ml-auto text-xs">
            CVC residual: {(step.wa + 3 * (1 + step.w0)).toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
