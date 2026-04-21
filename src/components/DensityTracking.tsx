"use client";

import { useEffect, useRef } from "react";

// Show how ρ_Λ(H) ∝ H² tracks ρ_m ∝ a^-3 during matter domination
// Demonstrating the CVC resolution of the coincidence problem

const OMEGA_M0 = 0.315;
const OMEGA_L0 = 0.685;
const NU = 0.59; // best-fit from solver

// E²(a) in CVC-1.0 = [Ω_m a^-3 + Ω_Λ - ν] / (1-ν)
function E2(a: number): number {
  return Math.max(0, (OMEGA_M0 * Math.pow(a, -3) + OMEGA_L0 - NU) / (1 - NU));
}

// Matter density relative to today's critical density
function rhoM(a: number): number {
  return OMEGA_M0 * Math.pow(a, -3);
}

// CVC running vacuum density (ρ_Λ(H) / ρ_crit,0)
function rhoCVC(a: number): number {
  return OMEGA_L0 + NU * (E2(a) - 1);
}

// ΛCDM constant dark energy
function rhoLCDM(): number {
  return OMEGA_L0;
}

export default function DensityTracking() {
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
    const pL = 58, pR = 18, pT = 22, pB = 40;
    const plotW = W - pL - pR, plotH = H - pT - pB;

    // Log scale factor: a from 0.001 (early) to 3 (future)
    const LOG_A_MIN = Math.log10(0.001); // -3 (early matter era)
    const LOG_A_MAX = Math.log10(3.0);   // ~0.48 (future)

    // Density range
    const LOG_RHO_MAX = 4.5;  // ρ/ρ_crit,0 ~10^4 (early matter era)
    const LOG_RHO_MIN = -2.0; // ρ/ρ_crit,0 ~10^-2 (future CVC)

    const toX = (a: number) => pL + ((Math.log10(a) - LOG_A_MIN) / (LOG_A_MAX - LOG_A_MIN)) * plotW;
    const toY = (rho: number) => {
      const logR = Math.log10(Math.max(rho, 1e-4));
      return pT + ((LOG_RHO_MAX - logR) / (LOG_RHO_MAX - LOG_RHO_MIN)) * plotH;
    };

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Shaded eras
    const aEq = 0.00028;  // matter-radiation equality
    const aDE = 0.74;     // dark energy domination begins
    const aToday = 1.0;

    // Matter era background
    ctx.fillStyle = "rgba(99,102,241,0.04)";
    ctx.fillRect(toX(Math.max(0.001, aEq)), pT, toX(aDE) - toX(Math.max(0.001, aEq)), plotH);

    // Dark energy era background
    ctx.fillStyle = "rgba(52,211,153,0.04)";
    ctx.fillRect(toX(aDE), pT, plotW - (toX(aDE) - pL), plotH);

    // Grid lines
    ctx.strokeStyle = "rgba(26,17,69,0.8)";
    ctx.lineWidth = 1;
    [-3, -2, -1, 0].forEach((logA) => {
      const a = Math.pow(10, logA);
      if (a >= 0.001) {
        ctx.beginPath(); ctx.moveTo(toX(a), pT); ctx.lineTo(toX(a), pT + plotH); ctx.stroke();
      }
    });
    [-2, -1, 0, 1, 2, 3, 4].forEach((logR) => {
      ctx.beginPath(); ctx.moveTo(pL, toY(Math.pow(10, logR))); ctx.lineTo(pL + plotW, toY(Math.pow(10, logR))); ctx.stroke();
    });

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pL, pT + plotH); ctx.lineTo(pL + plotW, pT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pL, pT); ctx.lineTo(pL, pT + plotH); ctx.stroke();

    const N = 500;
    const aValues = Array.from({ length: N }, (_, i) => {
      const logA = LOG_A_MIN + (i / (N - 1)) * (LOG_A_MAX - LOG_A_MIN);
      return Math.pow(10, logA);
    });

    // Matter density line: ρ_m ∝ a^-3
    ctx.beginPath();
    ctx.strokeStyle = "rgba(250,204,21,0.75)";
    ctx.lineWidth = 2;
    aValues.forEach((a, i) => {
      const x = toX(a);
      const y = toY(rhoM(a));
      if (y < pT - 5 || y > pT + plotH + 5) { i === 0 ? ctx.moveTo(x, y) : null; return; }
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // ΛCDM dark energy: flat constant
    ctx.beginPath();
    ctx.strokeStyle = "rgba(248,113,113,0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.moveTo(toX(0.001), toY(rhoLCDM()));
    ctx.lineTo(toX(3.0), toY(rhoLCDM()));
    ctx.stroke();
    ctx.setLineDash([]);

    // CVC running vacuum: ρ_Λ(H) tracks H² ∝ ρ_m during matter era
    ctx.beginPath();
    ctx.strokeStyle = "rgba(52,211,153,0.85)";
    ctx.lineWidth = 2.5;
    let started = false;
    aValues.forEach((a) => {
      const x = toX(a);
      const y = toY(rhoCVC(a));
      if (y < pT - 10 || y > pT + plotH + 10) { started = false; return; }
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Today marker
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(toX(aToday), pT); ctx.lineTo(toX(aToday), pT + plotH); ctx.stroke();
    ctx.setLineDash([]);

    // Era labels
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(99,102,241,0.45)";
    ctx.fillText("matter era", toX(0.03), pT + 14);
    ctx.fillStyle = "rgba(52,211,153,0.45)";
    ctx.fillText("DE domination", toX(1.5), pT + 14);

    // "Tracking" annotation — where CVC ≈ ρ_m slope
    const aTrack = 0.015;
    const xT = toX(aTrack);
    const yT = toY(rhoCVC(aTrack));
    ctx.strokeStyle = "rgba(52,211,153,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xT, yT); ctx.lineTo(xT + 30, yT - 20); ctx.stroke();
    ctx.fillStyle = "rgba(52,211,153,0.7)";
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    ctx.fillText("CVC tracks ρ_m", xT + 32, yT - 22);

    // Coincidence marker: where CVC crosses ρ_m
    // ρ_CVC = ρ_m when ΛCDM+CVC ≈ matter density
    // Find a_cross numerically
    let aCross = NaN;
    for (let i = 1; i < aValues.length; i++) {
      const a = aValues[i];
      if (rhoCVC(a) <= rhoM(a) && rhoCVC(aValues[i-1]) > rhoM(aValues[i-1])) {
        aCross = a;
        break;
      }
    }
    if (!isNaN(aCross) && aCross >= 0.001 && aCross <= 3.0) {
      const cx = toX(aCross);
      const cy = toY(rhoCVC(aCross));
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(52,211,153,0.9)";
      ctx.fill();
      ctx.fillStyle = "rgba(52,211,153,0.7)";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`ρ_CVC = ρ_m  (z≈${(1/aCross - 1).toFixed(1)})`, cx + 7, cy + 3);
    }

    // Today dot on each line
    ctx.beginPath();
    ctx.arc(toX(1), toY(rhoM(1)), 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,204,21,0.9)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(toX(1), toY(rhoCVC(1)), 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(52,211,153,0.9)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(toX(1), toY(rhoLCDM()), 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,113,113,0.9)";
    ctx.fill();

    // Today label
    ctx.fillStyle = "rgba(148,163,184,0.5)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("today  (a=1)", toX(1), pT + plotH + 14);

    // Tick labels — Y axis (log rho)
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    [-2, -1, 0, 1, 2, 3, 4].forEach((logR) => {
      ctx.fillText(`10^${logR}`, pL - 4, toY(Math.pow(10, logR)) + 4);
    });

    // Tick labels — X axis (scale factor)
    ctx.textAlign = "center";
    [0.001, 0.01, 0.1, 1].forEach((a) => {
      ctx.fillStyle = "rgba(148,163,184,0.4)";
      ctx.font = "9px monospace";
      ctx.fillText(a < 1 ? `10^${Math.log10(a).toFixed(0)}` : "1", toX(a), pT + plotH + 14);
    });

    // Axis labels
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("scale factor  a  (log, early → today)", pL + plotW / 2, H - 5);
    ctx.save();
    ctx.translate(11, pT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("ρ / ρ_crit,0  (log₁₀)", 0, 0);
    ctx.restore();

    // Legend
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    [
      ["rgba(250,204,21,0.75)", "ρ_m ∝ a⁻³  (matter)"],
      ["rgba(248,113,113,0.5)", "ρ_Λ = const  (ΛCDM)"],
      ["rgba(52,211,153,0.85)", "ρ_Λ(H) ∝ H²  (CVC running)"],
    ].forEach(([color, label], i) => {
      ctx.fillStyle = color;
      ctx.fillRect(pL + 5, pT + 22 + i * 15, 12, 8);
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.fillText(label, pL + 21, pT + 30 + i * 15);
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
        style={{ height: "280px" }}
      />
      <div className="px-5 py-3 border-t border-surface-light bg-surface/40">
        <p className="text-xs font-mono text-muted/55 leading-relaxed">
          During matter domination, H² ∝ ρ_m — so the CVC running vacuum (green) tracks matter density (yellow).
          The "coincidence" ρ_Λ ≈ ρ_m today is not an accident: it marks the end of the tracking epoch,
          where H begins to stabilise toward H₀ and ρ_Λ(H) approaches ρ_Λ₀.
          ΛCDM (red dashed) has no tracking mechanism — the coincidence is pure accident.
        </p>
      </div>
    </div>
  );
}
