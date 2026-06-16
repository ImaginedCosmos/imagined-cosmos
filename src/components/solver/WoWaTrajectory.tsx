"use client";

import { useEffect, useRef } from "react";

// DESI DR1 observational ground truth
const DESI_W0 = -0.727;
const DESI_WA = -1.05;
const DESI_W0_SIG = 0.067;
const DESI_WA_SIG = 0.27;
const DESI_RHO = -0.90;

function buildEllipseParams() {
  const s1 = DESI_W0_SIG, s2 = DESI_WA_SIG, rho = DESI_RHO;
  const cov00 = s1 * s1, cov11 = s2 * s2, cov01 = rho * s1 * s2;
  const trace = cov00 + cov11;
  const det = cov00 * cov11 - cov01 * cov01;
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det));
  const l1 = (trace + disc) / 2, l2 = (trace - disc) / 2;
  const v1x = cov01, v1y = l1 - cov00;
  const mag = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
  return { sigMajor: Math.sqrt(l1), sigMinor: Math.sqrt(l2), angle: Math.atan2(v1y / mag, v1x / mag) };
}

const ELLIPSE = buildEllipseParams();

function drawEllipse(
  ctx: CanvasRenderingContext2D,
  toX: (w: number) => number,
  toY: (wa: number) => number,
  scale: number
) {
  ctx.beginPath();
  const N = 200;
  const { sigMajor, sigMinor, angle } = ELLIPSE;
  for (let i = 0; i <= N; i++) {
    const phi = (i / N) * 2 * Math.PI;
    const ex = sigMajor * scale * Math.cos(phi);
    const ey = sigMinor * scale * Math.sin(phi);
    const dw0 = ex * Math.cos(angle) - ey * Math.sin(angle);
    const dwa = ex * Math.sin(angle) + ey * Math.cos(angle);
    const px = toX(DESI_W0 + dw0);
    const py = toY(DESI_WA + dwa);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

type Props = {
  cvc1Steps: { w0: number; wa: number }[];
  currentIndex: number;
  cvc2Steps?: { w0: number; wa: number }[];
  revisionIndex?: number;
};

export default function WoWaTrajectory({ cvc1Steps, currentIndex, cvc2Steps, revisionIndex = 0 }: Props) {
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
    const pL = 52, pR = 18, pT = 22, pB = 40;
    const plotW = W - pL - pR, plotH = H - pT - pB;

    const W0_MIN = -1.55, W0_MAX = -0.2;
    const WA_MIN = -2.8, WA_MAX = 1.5;
    const toX = (w0: number) => pL + ((w0 - W0_MIN) / (W0_MAX - W0_MIN)) * plotW;
    const toY = (wa: number) => pT + ((WA_MAX - wa) / (WA_MAX - WA_MIN)) * plotH;

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(26,17,69,0.9)";
    ctx.lineWidth = 1;
    for (let wa = -2.5; wa <= 1.5; wa += 0.5) {
      ctx.beginPath(); ctx.moveTo(pL, toY(wa)); ctx.lineTo(pL + plotW, toY(wa)); ctx.stroke();
    }
    for (let w0 = -1.5; w0 <= -0.25; w0 += 0.25) {
      ctx.beginPath(); ctx.moveTo(toX(w0), pT); ctx.lineTo(toX(w0), pT + plotH); ctx.stroke();
    }

    // ΛCDM dashed cross
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = "rgba(248,113,113,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(toX(-1), pT); ctx.lineTo(toX(-1), pT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pL, toY(0)); ctx.lineTo(pL + plotW, toY(0)); ctx.stroke();
    ctx.setLineDash([]);

    // 2σ ellipse
    drawEllipse(ctx, toX, toY, Math.sqrt(6.17));
    ctx.fillStyle = "rgba(124,58,237,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 1σ ellipse
    drawEllipse(ctx, toX, toY, Math.sqrt(2.30));
    ctx.fillStyle = "rgba(124,58,237,0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.50)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // CVC-1.0 constraint ray: wₐ = -3(1+w₀)
    ctx.save();
    ctx.beginPath(); ctx.rect(pL, pT, plotW, plotH); ctx.clip();
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = "rgba(52,211,153,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toX(-1.55), toY(-3 * (1 + -1.55)));
    ctx.lineTo(toX(-0.25), toY(-3 * (1 + -0.25)));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // CVC-1.0 trajectory (violet trail)
    const visible1 = cvc1Steps.slice(0, currentIndex + 1);
    if (visible1.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(167,139,250,0.35)";
      ctx.lineWidth = 1.5;
      visible1.forEach((s, i) => {
        const px = toX(s.w0), py = toY(s.wa);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
    // Trail dots (fading)
    visible1.forEach((s, i) => {
      const alpha = 0.1 + 0.5 * (i / Math.max(visible1.length - 1, 1));
      ctx.beginPath();
      ctx.arc(toX(s.w0), toY(s.wa), 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${alpha.toFixed(2)})`;
      ctx.fill();
    });

    // CVC-1.0 current point
    if (visible1.length > 0) {
      const cur = visible1[visible1.length - 1];
      const isConverged = Math.sqrt(
        (cur.w0 - DESI_W0) ** 2 / (DESI_W0_SIG ** 2) + (cur.wa - DESI_WA) ** 2 / (DESI_WA_SIG ** 2)
      ) <= 2;
      ctx.beginPath();
      ctx.arc(toX(cur.w0), toY(cur.wa), 6, 0, Math.PI * 2);
      ctx.fillStyle = isConverged ? "rgba(52,211,153,0.9)" : "rgba(167,139,250,0.9)";
      ctx.fill();
      ctx.strokeStyle = isConverged ? "rgba(52,211,153,0.5)" : "rgba(167,139,250,0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // CVC-2.0 trajectory (amber)
    if (cvc2Steps && cvc2Steps.length > 0) {
      const visible2 = cvc2Steps.slice(0, revisionIndex + 1);
      if (visible2.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251,191,36,0.4)";
        ctx.lineWidth = 1.5;
        visible2.forEach((s, i) => {
          const px = toX(s.w0), py = toY(s.wa);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
      if (visible2.length > 0) {
        const cur2 = visible2[visible2.length - 1];
        ctx.beginPath();
        ctx.arc(toX(cur2.w0), toY(cur2.wa), 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(251,191,36,0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(251,191,36,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // DESI best-fit point
    const dx = toX(DESI_W0), dy = toY(DESI_WA);
    ctx.beginPath();
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(167,139,250,0.95)";
    ctx.fill();

    // ΛCDM point
    const lx = toX(-1), ly = toY(0);
    ctx.beginPath();
    const s = 5;
    ctx.moveTo(lx, ly - s);
    ctx.lineTo(lx + s * 0.6, ly + s * 0.4);
    ctx.lineTo(lx - s * 0.6, ly + s * 0.4);
    ctx.closePath();
    ctx.fillStyle = "rgba(248,113,113,0.85)";
    ctx.fill();

    // Axis ticks
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    for (let w0 = -1.5; w0 <= -0.25; w0 += 0.25) {
      ctx.fillText(w0.toFixed(2), toX(w0), pT + plotH + 14);
    }
    ctx.textAlign = "right";
    for (let wa = -2.5; wa <= 1.5; wa += 1.0) {
      ctx.fillText(wa.toFixed(0), pL - 5, toY(wa) + 4);
    }

    // Axis labels
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "9px monospace";
    ctx.fillText("w₀", pL + plotW / 2, H - 4);
    ctx.save();
    ctx.translate(10, pT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("wₐ", 0, 0);
    ctx.restore();

    // Legend
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    const legends: [string, string][] = [
      ["rgba(167,139,250,0.8)", "CVC-1.0 trajectory"],
      ...(cvc2Steps && revisionIndex > 0 ? [["rgba(251,191,36,0.8)", "CVC-2.0 trajectory"] as [string, string]] : []),
      ["rgba(52,211,153,0.35)", "CVC ray  wₐ=−3(1+w₀)"],
    ];
    legends.forEach(([color, label], i) => {
      ctx.fillStyle = color;
      ctx.fillRect(pL + 5, pT + 5 + i * 16, 12, 8);
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.fillText(label, pL + 21, pT + 13 + i * 16);
    });
  }, [cvc1Steps, currentIndex, cvc2Steps, revisionIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl bg-[#030014]"
      style={{ height: "260px" }}
    />
  );
}
