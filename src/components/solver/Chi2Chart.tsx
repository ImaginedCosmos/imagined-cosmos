"use client";

import { useEffect, useRef } from "react";

type Props = {
  steps: { chi2_desi: number }[];
  currentIndex: number;
};

export default function Chi2Chart({ steps, currentIndex }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || steps.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const pL = 44, pR = 16, pT = 16, pB = 36;
    const plotW = W - pL - pR;
    const plotH = H - pT - pB;

    const maxChi2 = Math.max(...steps.map((s) => s.chi2_desi), 30);
    const toX = (i: number) => pL + (i / (steps.length - 1 || 1)) * plotW;
    const toY = (chi2: number) => pT + (1 - chi2 / maxChi2) * plotH;

    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Convergence threshold line (χ² = 4, 2σ)
    ctx.strokeStyle = "rgba(52,211,153,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(pL, toY(4));
    ctx.lineTo(pL + plotW, toY(4));
    ctx.stroke();
    ctx.fillStyle = "rgba(52,211,153,0.4)";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    ctx.fillText("2σ", pL - 4, toY(4) + 3);

    // Falsified line (χ² = 25, 5σ)
    ctx.strokeStyle = "rgba(248,113,113,0.25)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(pL, toY(25));
    ctx.lineTo(pL + plotW, toY(25));
    ctx.stroke();
    ctx.fillStyle = "rgba(248,113,113,0.35)";
    ctx.fillText("5σ", pL - 4, toY(25) + 3);
    ctx.setLineDash([]);

    // χ² curve (up to currentIndex)
    const visible = steps.slice(0, currentIndex + 1);
    if (visible.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(167,139,250,0.7)";
      ctx.lineWidth = 2;
      visible.forEach((s, i) => {
        const x = toX(i);
        const y = toY(s.chi2_desi);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Current point
    if (visible.length > 0) {
      const cur = visible[visible.length - 1];
      const cx = toX(visible.length - 1);
      const cy = toY(cur.chi2_desi);
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      const isConverged = cur.chi2_desi <= 4;
      ctx.fillStyle = isConverged ? "rgba(52,211,153,0.9)" : "rgba(167,139,250,0.9)";
      ctx.fill();
    }

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pL, pT);
    ctx.lineTo(pL, pT + plotH);
    ctx.lineTo(pL + plotW, pT + plotH);
    ctx.stroke();

    // Tick labels
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    [0, 10, 20, 30].forEach((v) => {
      if (v <= maxChi2) {
        ctx.fillText(String(v), pL - 4, toY(v) + 3);
      }
    });

    // X-axis label
    ctx.textAlign = "center";
    ctx.fillText("iteration", pL + plotW / 2, H - 4);

    // Y-axis label
    ctx.save();
    ctx.translate(10, pT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("χ²  (DESI)", 0, 0);
    ctx.restore();
  }, [steps, currentIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl bg-[#030014]"
      style={{ height: "180px" }}
    />
  );
}
