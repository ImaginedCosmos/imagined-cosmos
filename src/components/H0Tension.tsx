"use client";

import { useEffect, useRef } from "react";

const MEASUREMENTS = [
  // CMB / early-universe methods (violet)
  { label: "Planck 2018 (CMB)", H0: 67.4, err: 0.5, type: "early", ref: "arXiv:1807.06209" },
  { label: "WMAP9 (CMB)", H0: 69.3, err: 0.8, type: "early", ref: "Hinshaw+ 2013" },
  { label: "DES Y3 (BAO+CMB)", H0: 67.8, err: 1.3, type: "early", ref: "Abbott+ 2022" },
  // Distance ladder / late-universe (amber)
  { label: "SH0ES 2022 (Cepheids)", H0: 73.04, err: 1.04, type: "late", ref: "Riess+ 2022" },
  { label: "H0LiCOW (lensing)", H0: 73.3, err: 1.8, type: "late", ref: "Wong+ 2020" },
  { label: "TRGB (Freedman)", H0: 69.8, err: 2.1, type: "calib", ref: "Freedman+ 2021" },
  // CVC prediction (emerald)
  { label: "CVC-1.0 prediction", H0: 68.5, err: 1.5, type: "cvc", ref: "ΔH₀ ≈ +1–2 km/s/Mpc from ν running" },
] as const;

type MeasurementType = "early" | "late" | "calib" | "cvc";

const TYPE_COLOR: Record<MeasurementType, { line: string; fill: string; label: string }> = {
  early: { line: "rgba(139,92,246,0.85)", fill: "rgba(139,92,246,0.25)", label: "CMB / early-universe" },
  late:  { line: "rgba(251,191,36,0.85)",  fill: "rgba(251,191,36,0.20)",  label: "Distance ladder" },
  calib: { line: "rgba(148,163,184,0.7)",  fill: "rgba(148,163,184,0.15)", label: "Calibration-sensitive" },
  cvc:   { line: "rgba(52,211,153,0.85)",  fill: "rgba(52,211,153,0.20)",  label: "CVC-1.0 prediction" },
};

export default function H0Tension() {
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
    const pL = 200, pR = 28, pT = 24, pB = 48;
    const plotW = W - pL - pR, plotH = H - pT - pB;

    const H0_MIN = 63, H0_MAX = 78;
    const toX = (h0: number) => pL + ((h0 - H0_MIN) / (H0_MAX - H0_MIN)) * plotW;

    const rowH = plotH / (MEASUREMENTS.length + 1);
    const toY = (i: number) => pT + (i + 0.5) * rowH + rowH * 0.25;

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Tension zone: between CMB and SH0ES, shaded red
    const planckX = toX(67.4), shoesX = toX(73.04);
    const grad = ctx.createLinearGradient(planckX, 0, shoesX, 0);
    grad.addColorStop(0, "rgba(248,113,113,0.04)");
    grad.addColorStop(0.5, "rgba(248,113,113,0.08)");
    grad.addColorStop(1, "rgba(248,113,113,0.04)");
    ctx.fillStyle = grad;
    ctx.fillRect(planckX, pT, shoesX - planckX, plotH);

    // Tension label
    ctx.fillStyle = "rgba(248,113,113,0.35)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("5σ gap", (planckX + shoesX) / 2, pT + 12);

    // Grid lines at H0 values
    ctx.strokeStyle = "rgba(26,17,69,0.8)";
    ctx.lineWidth = 1;
    for (let h = 64; h <= 78; h += 2) {
      ctx.beginPath(); ctx.moveTo(toX(h), pT); ctx.lineTo(toX(h), pT + plotH); ctx.stroke();
    }

    // Axis
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pL, pT + plotH); ctx.lineTo(pL + plotW, pT + plotH); ctx.stroke();

    // Draw each measurement
    MEASUREMENTS.forEach((m, i) => {
      const y = toY(i);
      const cx = toX(m.H0);
      const errL = toX(m.H0 - m.err);
      const errR = toX(m.H0 + m.err);
      const c = TYPE_COLOR[m.type];

      // 1σ error band
      ctx.fillStyle = c.fill;
      ctx.fillRect(errL, y - 7, errR - errL, 14);

      // Error bar
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(errL, y); ctx.lineTo(errR, y); ctx.stroke();

      // End caps
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(errL, y - 5); ctx.lineTo(errL, y + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(errR, y - 5); ctx.lineTo(errR, y + 5); ctx.stroke();

      // Central point
      ctx.beginPath();
      ctx.arc(cx, y, m.type === "cvc" ? 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = c.line;
      ctx.fill();

      // Label (left side)
      ctx.fillStyle = m.type === "cvc" ? c.line : "rgba(148,163,184,0.7)";
      ctx.font = m.type === "cvc" ? "bold 10px monospace" : "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(m.label, pL - 8, y + 4);

      // Value (right of bar)
      ctx.fillStyle = "rgba(148,163,184,0.45)";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${m.H0.toFixed(1)} ± ${m.err.toFixed(1)}`, errR + 6, y + 3);
    });

    // X-axis ticks
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    for (let h = 64; h <= 78; h += 2) {
      ctx.fillText(String(h), toX(h), pT + plotH + 14);
    }

    // Axis label
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("H₀  (km/s/Mpc)", pL + plotW / 2, H - 5);

    // Legend
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    const legendEntries: [MeasurementType, string][] = [
      ["early", "CMB / early-universe"],
      ["late", "Distance ladder (late)"],
      ["cvc", "CVC-1.0 prediction"],
    ];
    legendEntries.forEach(([type, label], i) => {
      const c = TYPE_COLOR[type];
      ctx.fillStyle = c.fill;
      ctx.fillRect(pL, pT + i * 16, 16, 9);
      ctx.strokeStyle = c.line;
      ctx.lineWidth = 1;
      ctx.strokeRect(pL, pT + i * 16, 16, 9);
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.fillText(label, pL + 20, pT + 8 + i * 16);
    });
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
        style={{ height: "300px" }}
      />
      <div className="px-5 py-3 border-t border-surface-light bg-surface/40">
        <p className="text-xs font-mono text-muted/55 leading-relaxed">
          CMB-derived H₀ (violet) clusters around 67–68. Distance-ladder measurements (amber) cluster
          around 73. The gap is 5σ and grows with better data. CVC-1.0 (green) shifts Planck&apos;s value
          by ≈+1–2 km/s/Mpc — reducing but not resolving the tension.
        </p>
      </div>
    </div>
  );
}
