"use client";

import { useEffect, useRef, useState } from "react";

// DESI 2024 DR1 best-fit (DESI + CMB + DES-SN5YR, arXiv:2404.03002 Table 3)
const DESI_W0 = -0.727;
const DESI_WA = -1.05;
const DESI_W0_ERR = 0.067;
const DESI_WA_ERR = 0.27;

// CPL parametrization: w(z) = w0 + wa × z/(1+z)
function wOfZ(z: number, w0: number, wa: number): number {
  return w0 + wa * (z / (1 + z));
}

export default function EquationOfState() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [w0, setW0] = useState(DESI_W0);
  const [wa, setWa] = useState(DESI_WA);
  const [showBand, setShowBand] = useState(true);

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

    const W = rect.width;
    const H = rect.height;
    const padL = 56;
    const padR = 20;
    const padT = 28;
    const padB = 44;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const Z_MAX = 3.5;
    const W_MIN = -2.6;
    const W_MAX = 0.3;

    const toX = (z: number) => padL + (z / Z_MAX) * plotW;
    const toY = (w: number) =>
      padT + ((W_MAX - w) / (W_MAX - W_MIN)) * plotH;
    const clampY = (w: number) =>
      toY(Math.max(W_MIN, Math.min(W_MAX, w)));

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(26,17,69,0.9)";
    ctx.lineWidth = 1;
    for (let wg = -2.5; wg <= 0; wg += 0.5) {
      ctx.beginPath();
      ctx.moveTo(padL, toY(wg));
      ctx.lineTo(padL + plotW, toY(wg));
      ctx.stroke();
    }
    for (let zg = 0; zg <= 3.5; zg += 0.5) {
      ctx.beginPath();
      ctx.moveTo(toX(zg), padT);
      ctx.lineTo(toX(zg), padT + plotH);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.stroke();

    // Tick labels
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    ctx.font = `${11 * Math.min(1, W / 400)}px monospace`;
    ctx.textAlign = "center";
    for (let zg = 0; zg <= 3; zg++) {
      ctx.fillText(`${zg}`, toX(zg), padT + plotH + 16);
    }
    ctx.textAlign = "right";
    for (let wg = -2.0; wg <= 0; wg += 0.5) {
      ctx.fillText(wg.toFixed(1), padL - 6, toY(wg) + 4);
    }

    // w = -1 reference line (cosmological constant)
    ctx.strokeStyle = "rgba(248,113,113,0.65)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(-1));
    ctx.lineTo(toX(Z_MAX), toY(-1));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(248,113,113,0.65)";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("w = −1   (cosmological constant)", toX(0.08), toY(-1) - 7);

    // 1σ uncertainty band — envelope of the four corner (w0±err, wa±err) curves
    if (showBand) {
      const steps = 300;
      const upper: [number, number][] = [];
      const lower: [number, number][] = [];

      for (let i = 0; i <= steps; i++) {
        const z = (i / steps) * Z_MAX;
        const corners = [
          wOfZ(z, DESI_W0 + DESI_W0_ERR, DESI_WA + DESI_WA_ERR),
          wOfZ(z, DESI_W0 + DESI_W0_ERR, DESI_WA - DESI_WA_ERR),
          wOfZ(z, DESI_W0 - DESI_W0_ERR, DESI_WA + DESI_WA_ERR),
          wOfZ(z, DESI_W0 - DESI_W0_ERR, DESI_WA - DESI_WA_ERR),
        ];
        upper.push([toX(z), clampY(Math.max(...corners))]);
        lower.push([toX(z), clampY(Math.min(...corners))]);
      }

      ctx.beginPath();
      upper.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      [...lower].reverse().forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fillStyle = "rgba(124,58,237,0.13)";
      ctx.fill();
    }

    // Current w(z) curve
    ctx.strokeStyle = "rgba(167,139,250,0.95)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const z = (i / 300) * Z_MAX;
      const y = clampY(wOfZ(z, w0, wa));
      i === 0 ? ctx.moveTo(toX(z), y) : ctx.lineTo(toX(z), y);
    }
    ctx.stroke();

    // Today dot
    const todayW = wOfZ(0, w0, wa);
    ctx.beginPath();
    ctx.arc(toX(0), toY(todayW), 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,204,21,0.9)";
    ctx.fill();
    ctx.fillStyle = "rgba(250,204,21,0.75)";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`z=0  w=${todayW.toFixed(2)}`, toX(0.1), toY(todayW) - 9);

    // Y-axis label
    ctx.save();
    ctx.translate(12, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.font = "10px monospace";
    ctx.fillText("w(z)  equation of state", 0, 0);
    ctx.restore();

    // X-axis label
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.font = "10px monospace";
    ctx.fillText("redshift  z", padL + plotW / 2, H - 6);
  }, [w0, wa, showBand]);

  // Redraw on window resize
  useEffect(() => {
    const handle = () => {
      // Trigger redraw by toggling a no-op state update
      setShowBand((v) => v);
    };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div className="rounded-xl border border-surface-light overflow-hidden">
      <canvas ref={canvasRef} className="w-full bg-[#030014]" style={{ height: "360px" }} />
      <div className="px-5 py-4 border-t border-surface-light bg-surface/40 space-y-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="w-8">w₀</span>
            <input
              type="range"
              min={-1.5}
              max={0}
              step={0.01}
              value={w0}
              onChange={(e) => setW0(Number(e.target.value))}
              className="w-28 accent-accent"
            />
            <span className="w-12 text-foreground">{w0.toFixed(2)}</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="w-8">wₐ</span>
            <input
              type="range"
              min={-2.5}
              max={1}
              step={0.01}
              value={wa}
              onChange={(e) => setWa(Number(e.target.value))}
              className="w-28 accent-accent"
            />
            <span className="w-12 text-foreground">{wa.toFixed(2)}</span>
          </label>
          <button
            onClick={() => {
              setW0(DESI_W0);
              setWa(DESI_WA);
            }}
            className="text-xs font-mono px-3 py-1 rounded-lg bg-accent/20 text-violet-300 hover:bg-accent/30 transition-colors"
          >
            DESI 2024
          </button>
          <button
            onClick={() => {
              setW0(-1);
              setWa(0);
            }}
            className="text-xs font-mono px-3 py-1 rounded-lg bg-red-900/20 text-red-300 hover:bg-red-900/30 transition-colors"
          >
            Λ = const
          </button>
          <label className="flex items-center gap-2 text-xs font-mono text-muted">
            <input
              type="checkbox"
              checked={showBand}
              onChange={(e) => setShowBand(e.target.checked)}
              className="accent-accent"
            />
            1σ band
          </label>
        </div>
        <p className="text-xs font-mono text-muted/50 leading-relaxed">
          CPL: w(z) = w₀ + wₐ·z/(1+z). DESI DR1: w₀ = {DESI_W0}, wₐ = {DESI_WA} — {Math.round(2.5 * 10) / 10}–3.9σ from w = −1.
        </p>
      </div>
    </div>
  );
}
