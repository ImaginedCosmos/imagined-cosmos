"use client";

import { useEffect, useRef } from "react";

// Show ρ_Λ(H) for three scenarios:
// 1. QFT (naive): ρ ~ M_P^4  (flat — catastrophically high)
// 2. CVC (CKN corrected): ρ ~ M_P^2 H^2  (quadratic — tracks H)
// 3. Observed: ρ_Λ0 at H = H_0
//
// X-axis: H/H_0 (log scale, 1 to ~10^18 for Planck era)
// Y-axis: log10(ρ_Λ / ρ_observed)

export default function VacuumRunning() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width, H = rect.height;
    const pL = 60, pR = 20, pT = 24, pB = 48;
    const plotW = W - pL - pR, plotH = H - pT - pB;

    // Log axes
    const LOG_H_MIN = 0;     // H/H0 = 1  (today)
    const LOG_H_MAX = 61;    // H/H0 = 10^61 ~ Planck scale (M_P/H_0)
    const LOG_RHO_MIN = -2;  // slightly below observed (= 0 by definition)
    const LOG_RHO_MAX = 122; // QFT prediction is ~10^121 above observed

    const toX = (logH: number) => pL + ((logH - LOG_H_MIN) / (LOG_H_MAX - LOG_H_MIN)) * plotW;
    const toY = (logRho: number) => pT + ((LOG_RHO_MAX - logRho) / (LOG_RHO_MAX - LOG_RHO_MIN)) * plotH;

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Subtle grid (selected decades)
    ctx.strokeStyle = "rgba(26,17,69,0.8)";
    ctx.lineWidth = 1;
    [0, 10, 20, 30, 40, 50, 60].forEach((lH) => {
      ctx.beginPath(); ctx.moveTo(toX(lH), pT); ctx.lineTo(toX(lH), pT + plotH); ctx.stroke();
    });
    [0, 20, 40, 60, 80, 100, 120].forEach((lR) => {
      ctx.beginPath(); ctx.moveTo(pL, toY(lR)); ctx.lineTo(pL + plotW, toY(lR)); ctx.stroke();
    });

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pL, pT + plotH); ctx.lineTo(pL + plotW, pT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pL, pT); ctx.lineTo(pL, pT + plotH); ctx.stroke();

    const N = 400;

    // QFT line: ρ_QFT = M_P^4 → log10(ρ_QFT/ρ_obs) ≈ 121  (flat, H-independent)
    // Draw as a thick horizontal band at y ≈ 121
    ctx.beginPath();
    ctx.strokeStyle = "rgba(248,113,113,0.7)";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.moveTo(toX(LOG_H_MIN), toY(121));
    ctx.lineTo(toX(LOG_H_MAX), toY(121));
    ctx.stroke();
    ctx.setLineDash([]);

    // Shaded region: QFT value extends to "infinity"
    ctx.fillStyle = "rgba(248,113,113,0.04)";
    ctx.fillRect(pL, pT, plotW, toY(121) - pT);

    // CVC line: ρ_CVC ∝ H^2  → log10(ρ_CVC/ρ_obs) = 2·log10(H/H_0)
    // At H = H_0: ρ_CVC = ρ_obs (by construction of ν)
    // At H = M_P/H_0 ~ 10^61 H_0: ρ_CVC ~ M_P^4... no, it's M_P^2 H^2
    // The CVC value at H_Planck ≈ 10^61 H_0 → log10(ρ_CVC/ρ_obs) = 2*61 = 122
    // But M_P^4 is constant, so CVC tracks QFT at Planck scale (they meet)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(52,211,153,0.8)";
    ctx.lineWidth = 2.5;
    for (let i = 0; i <= N; i++) {
      const logH = LOG_H_MIN + (i / N) * (LOG_H_MAX - LOG_H_MIN);
      const logRho = 2 * logH; // ρ_CVC ∝ H^2
      const x = toX(logH);
      const y = toY(logRho);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Observed value: horizontal at logRho = 0  (by definition)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(250,204,21,0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.moveTo(toX(LOG_H_MIN), toY(0));
    ctx.lineTo(toX(LOG_H_MAX), toY(0));
    ctx.stroke();
    ctx.setLineDash([]);

    // Observed point at H = H_0
    const obsX = toX(0), obsY = toY(0);
    ctx.beginPath();
    ctx.arc(obsX, obsY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,204,21,0.9)";
    ctx.fill();

    // CVC at H = H_0
    ctx.beginPath();
    ctx.arc(obsX, obsY, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(52,211,153,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // QFT prediction mark (arrow down from QFT line to observed)
    const arrowX = toX(2);
    const arrowTop = toY(121) + 4;
    const arrowBot = toY(3);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(248,113,113,0.5)";
    ctx.lineWidth = 1.5;
    ctx.moveTo(arrowX, arrowTop);
    ctx.lineTo(arrowX, arrowBot + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(arrowX - 5, arrowBot + 8);
    ctx.lineTo(arrowX, arrowBot);
    ctx.lineTo(arrowX + 5, arrowBot + 8);
    ctx.strokeStyle = "rgba(248,113,113,0.5)";
    ctx.stroke();

    // Gap label
    ctx.fillStyle = "rgba(248,113,113,0.65)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("10¹²¹ gap", arrowX + 7, (arrowTop + arrowBot) / 2 + 4);

    // Labels on lines
    ctx.font = "10px monospace";
    ctx.textAlign = "left";

    ctx.fillStyle = "rgba(248,113,113,0.7)";
    ctx.fillText("ρ_QFT ≈ M_P⁴  (constant)", toX(8), toY(121) - 7);

    ctx.fillStyle = "rgba(52,211,153,0.8)";
    ctx.fillText("ρ_CVC ∝ M_P²H²  (running)", toX(20), toY(40) - 7);

    ctx.fillStyle = "rgba(250,204,21,0.7)";
    ctx.fillText("ρ_obs  (today)", toX(4), toY(0) - 8);

    // Today marker
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(toX(0), pT); ctx.lineTo(toX(0), pT + plotH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("today", toX(0), pT + plotH + 14);

    // Planck scale marker
    ctx.strokeStyle = "rgba(148,163,184,0.15)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(toX(61), pT); ctx.lineTo(toX(61), pT + plotH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(148,163,184,0.35)";
    ctx.fillText("Planck scale", toX(61), pT + plotH + 14);

    // Tick labels
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    [0, 20, 40, 60, 80, 100, 120].forEach((lR) => {
      ctx.fillText(`10^${lR}`, pL - 4, toY(lR) + 4);
    });

    // Axis labels
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "10px monospace";
    ctx.fillText("H / H₀  (log scale →  early universe)", pL + plotW / 2, H - 6);
    ctx.save();
    ctx.translate(11, pT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("ρ_Λ / ρ_observed  (log₁₀)", 0, 0);
    ctx.restore();
  }, []);

  useEffect(() => {
    const handle = () => { const c = canvasRef.current; if (c) c.width = 0; };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div className="rounded-xl border border-surface-light overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full bg-[#030014]"
        style={{ height: "320px" }}
      />
      <div className="px-5 py-3 border-t border-surface-light bg-surface/40">
        <p className="text-xs font-mono text-muted/55 leading-relaxed">
          At H = H₀ (today), ρ_CVC = ρ_obs by construction. At earlier epochs (larger H), ρ_CVC ∝ H² grows —
          but so does the matter density, maintaining tracking. ρ_QFT ∼ M_P⁴ is H-independent: the
          10¹²¹ discrepancy is not a cancellation that needs to happen — it is the result of using the wrong UV cutoff.
        </p>
      </div>
    </div>
  );
}
