"use client";

import { useEffect, useRef } from "react";
import { analyticBestNu, computePredictions } from "@/lib/physics/theory";
import { computeResiduals } from "@/lib/physics/likelihood";
import { nuUncertainty } from "@/lib/physics/optimizer";
import { CONSTRAINTS } from "@/lib/physics/data";

const NU_MIN = -0.3;
const NU_MAX = 1.5;
const N_POINTS = 400;

// Pre-compute chi2 landscape at module load (pure, deterministic)
const NU_STAR = analyticBestNu(
  CONSTRAINTS.w0,
  CONSTRAINTS.wa,
  CONSTRAINTS.w0_err,
  CONSTRAINTS.wa_err,
  CONSTRAINTS.rho
);

const CHI2_MIN = (() => {
  const pred = computePredictions({ nu: NU_STAR });
  return computeResiduals(pred, CONSTRAINTS).chi2_desi;
})();

const NU_ERR = nuUncertainty(CONSTRAINTS);

const LANDSCAPE: { nu: number; chi2: number }[] = Array.from({ length: N_POINTS }, (_, i) => {
  const nu = NU_MIN + (i / (N_POINTS - 1)) * (NU_MAX - NU_MIN);
  const pred = computePredictions({ nu });
  const chi2 = computeResiduals(pred, CONSTRAINTS).chi2_desi;
  return { nu, chi2 };
});

export default function Chi2Landscape() {
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
    const pL = 50, pR = 20, pT = 20, pB = 36;
    const plotW = W - pL - pR, plotH = H - pT - pB;

    // Y range: 0 to max(30, chi2_at_edges+5)
    const CHI2_DISPLAY_MAX = 35;

    const toX = (nu: number) => pL + ((nu - NU_MIN) / (NU_MAX - NU_MIN)) * plotW;
    const toY = (chi2: number) => pT + (1 - Math.min(chi2, CHI2_DISPLAY_MAX) / CHI2_DISPLAY_MAX) * plotH;

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Shaded confidence regions (horizontal bands)
    const bands = [
      { lo: 25, hi: CHI2_DISPLAY_MAX, color: "rgba(248,113,113,0.08)", label: "falsified (>5σ)" },
      { lo: 9,  hi: 25, color: "rgba(251,191,36,0.06)", label: "needs revision" },
      { lo: 0,  hi: 4,  color: "rgba(52,211,153,0.06)", label: "converged (<2σ)" },
    ];

    bands.forEach(({ lo, hi, color }) => {
      ctx.fillStyle = color;
      const y1 = toY(hi);
      const y2 = toY(lo);
      ctx.fillRect(pL, y1, plotW, y2 - y1);
    });

    // Grid lines
    ctx.strokeStyle = "rgba(26,17,69,0.8)";
    ctx.lineWidth = 1;
    [0, 5, 10, 15, 20, 25, 30, 35].forEach((c) => {
      ctx.beginPath(); ctx.moveTo(pL, toY(c)); ctx.lineTo(pL + plotW, toY(c)); ctx.stroke();
    });

    // Threshold lines
    const THRESHOLDS = [
      { chi2: 4,  color: "rgba(52,211,153,0.5)",  label: "χ²=4 (2σ)" },
      { chi2: 9,  color: "rgba(251,191,36,0.4)",  label: "χ²=9 (3σ)" },
      { chi2: 25, color: "rgba(248,113,113,0.4)", label: "χ²=25 (5σ)" },
    ];

    ctx.setLineDash([4, 4]);
    THRESHOLDS.forEach(({ chi2, color, label }) => {
      const y = toY(chi2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(pL + plotW, y); ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillText(label, pL + 4, y - 3);
    });
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pL, pT + plotH); ctx.lineTo(pL + plotW, pT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pL, pT); ctx.lineTo(pL, pT + plotH); ctx.stroke();

    // χ²(ν) curve — colored by region
    const segments = [
      { maxChi2: 4,  color: "rgba(52,211,153,0.9)", width: 2.5 },
      { maxChi2: 9,  color: "rgba(251,191,36,0.7)", width: 2.0 },
      { maxChi2: 25, color: "rgba(248,113,113,0.5)", width: 1.5 },
      { maxChi2: CHI2_DISPLAY_MAX, color: "rgba(148,163,184,0.25)", width: 1.0 },
    ];

    for (const { maxChi2, color, width } of segments) {
      const minChi2 = maxChi2 === 4 ? 0 : maxChi2 === 9 ? 4 : maxChi2 === 25 ? 9 : 25;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      let started = false;
      LANDSCAPE.forEach(({ nu, chi2 }) => {
        if (chi2 < minChi2 || chi2 > maxChi2) { started = false; return; }
        const x = toX(nu);
        const y = toY(chi2);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // 1σ band around ν*
    const nuLo = NU_STAR - NU_ERR;
    const nuHi = NU_STAR + NU_ERR;
    if (nuLo >= NU_MIN && nuHi <= NU_MAX) {
      ctx.fillStyle = "rgba(52,211,153,0.07)";
      ctx.fillRect(toX(nuLo), pT, toX(nuHi) - toX(nuLo), plotH);
      ctx.strokeStyle = "rgba(52,211,153,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(toX(nuLo), pT); ctx.lineTo(toX(nuLo), pT + plotH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(toX(nuHi), pT); ctx.lineTo(toX(nuHi), pT + plotH); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(52,211,153,0.35)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("1σ", toX(NU_STAR), pT + plotH - 8);
    }

    // ν* vertical line
    ctx.strokeStyle = "rgba(52,211,153,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(toX(NU_STAR), pT); ctx.lineTo(toX(NU_STAR), pT + plotH); ctx.stroke();
    ctx.setLineDash([]);

    // ν* dot at minimum
    ctx.beginPath();
    ctx.arc(toX(NU_STAR), toY(CHI2_MIN), 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(52,211,153,0.9)";
    ctx.fill();

    // ν* label
    ctx.fillStyle = "rgba(52,211,153,0.8)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`ν* = ${NU_STAR.toFixed(3)} ± ${NU_ERR.toFixed(3)}`, toX(NU_STAR), pT + 14);
    ctx.fillStyle = "rgba(52,211,153,0.55)";
    ctx.font = "8px monospace";
    ctx.fillText(`χ²= ${CHI2_MIN.toFixed(2)}`, toX(NU_STAR), pT + 24);

    // X axis ticks
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    [-0.2, 0, 0.2, 0.4, 0.6, NU_STAR, 0.8, 1.0, 1.2, 1.4].forEach((nu) => {
      if (nu >= NU_MIN && nu <= NU_MAX) {
        ctx.fillText(nu.toFixed(1), toX(nu), pT + plotH + 14);
      }
    });

    // Y axis ticks
    ctx.textAlign = "right";
    [0, 5, 10, 15, 20, 25, 30, 35].forEach((c) => {
      ctx.fillText(String(c), pL - 4, toY(c) + 3);
    });

    // Axis labels
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("ν  (running vacuum coefficient)", pL + plotW / 2, H - 5);
    ctx.save();
    ctx.translate(11, pT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("χ²  (DESI DR1)", 0, 0);
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
        style={{ height: "240px" }}
      />
      <div className="px-5 py-3 border-t border-surface-light bg-surface/40">
        <p className="text-xs font-mono text-muted/55 leading-relaxed">
          χ²(ν) against DESI DR1 (w₀, wₐ) with ρ=−0.90 anti-correlation.
          Green: χ²≤4 (converged). Amber: 4–25 (needs revision). Red: &gt;25 (falsified).
          Best-fit ν* = {NU_STAR.toFixed(3)} ± {NU_ERR.toFixed(3)}  (1σ, DESI DR1). χ²_min = {CHI2_MIN.toFixed(2)}.
        </p>
      </div>
    </div>
  );
}
