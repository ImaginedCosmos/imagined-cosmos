"use client";

import { useEffect, useRef } from "react";

// DESI 2024 DR1 (DESI+CMB+DES-SN5YR, arXiv:2404.03002 Table 3)
const DESI_W0 = -0.727;
const DESI_WA = -1.05;
const DESI_W0_SIG = 0.067;
const DESI_WA_SIG = 0.27;
const DESI_RHO = -0.90; // correlation coefficient

// Covariance eigendecomposition for the rotated ellipse
function buildEllipseParams() {
  const s1 = DESI_W0_SIG, s2 = DESI_WA_SIG, rho = DESI_RHO;
  const cov00 = s1 * s1;
  const cov11 = s2 * s2;
  const cov01 = rho * s1 * s2;
  const trace = cov00 + cov11;
  const det = cov00 * cov11 - cov01 * cov01;
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det));
  const l1 = (trace + disc) / 2; // larger eigenvalue
  const l2 = (trace - disc) / 2;
  // Eigenvector for l1
  const v1x = cov01;
  const v1y = l1 - cov00;
  const mag = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
  const angle = Math.atan2(v1y / mag, v1x / mag);
  return { sigMajor: Math.sqrt(l1), sigMinor: Math.sqrt(l2), angle };
}

const ELLIPSE = buildEllipseParams();

function drawEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  aMajor: number,
  aMinor: number,
  angle: number,
  toX: (w: number) => number,
  toY: (wa: number) => number,
  w0Scale: number,
  waScale: number
) {
  ctx.beginPath();
  const N = 200;
  for (let i = 0; i <= N; i++) {
    const phi = (i / N) * 2 * Math.PI;
    // Unrotated ellipse point
    const ex = aMajor * Math.cos(phi);
    const ey = aMinor * Math.sin(phi);
    // Rotate by angle (angle is in w0-wa space)
    const dw0 = ex * Math.cos(angle) - ey * Math.sin(angle);
    const dwa = ex * Math.sin(angle) + ey * Math.cos(angle);
    const px = toX(DESI_W0 + dw0 * w0Scale);
    const py = toY(DESI_WA + dwa * waScale);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export default function WoWaPlane() {
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

    const W = rect.width;
    const H = rect.height;
    const padL = 56, padR = 20, padT = 28, padB = 44;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const W0_MIN = -1.55, W0_MAX = -0.2;
    const WA_MIN = -2.8, WA_MAX = 1.5;

    const toX = (w0: number) => padL + ((w0 - W0_MIN) / (W0_MAX - W0_MIN)) * plotW;
    const toY = (wa: number) => padT + ((WA_MAX - wa) / (WA_MAX - WA_MIN)) * plotH;

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(26,17,69,0.9)";
    ctx.lineWidth = 1;
    for (let wa = -2.5; wa <= 1.5; wa += 0.5) {
      ctx.beginPath(); ctx.moveTo(padL, toY(wa)); ctx.lineTo(padL + plotW, toY(wa)); ctx.stroke();
    }
    for (let w0 = -1.5; w0 <= -0.2; w0 += 0.25) {
      ctx.beginPath(); ctx.moveTo(toX(w0), padT); ctx.lineTo(toX(w0), padT + plotH); ctx.stroke();
    }

    // w0 = -1 vertical line
    ctx.strokeStyle = "rgba(248,113,113,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(toX(-1), padT); ctx.lineTo(toX(-1), padT + plotH); ctx.stroke();

    // wa = 0 horizontal line
    ctx.beginPath(); ctx.moveTo(padL, toY(0)); ctx.lineTo(padL + plotW, toY(0)); ctx.stroke();
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.stroke();

    // Region labels (subtle)
    ctx.font = "10px monospace";
    ctx.textAlign = "center";

    const regions: { label: string; w0: number; wa: number; color: string }[] = [
      { label: "Thawing quintessence", w0: -0.7, wa: 0.9, color: "rgba(99,102,241,0.35)" },
      { label: "Freezing quintessence", w0: -0.7, wa: -1.6, color: "rgba(99,102,241,0.35)" },
      { label: "Phantom", w0: -1.35, wa: -1.5, color: "rgba(239,68,68,0.25)" },
      { label: "Super-acceleration", w0: -1.35, wa: 0.8, color: "rgba(239,68,68,0.20)" },
    ];
    for (const r of regions) {
      ctx.fillStyle = r.color;
      ctx.fillText(r.label, toX(r.w0), toY(r.wa));
    }

    // 2σ ellipse (95.4%)
    const scale2s = Math.sqrt(6.17);
    drawEllipse(
      ctx, toX(DESI_W0), toY(DESI_WA),
      ELLIPSE.sigMajor * scale2s, ELLIPSE.sigMinor * scale2s, ELLIPSE.angle,
      toX, toY, 1, 1
    );
    ctx.fillStyle = "rgba(124,58,237,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 1σ ellipse (68.3%)
    const scale1s = Math.sqrt(2.30);
    drawEllipse(
      ctx, toX(DESI_W0), toY(DESI_WA),
      ELLIPSE.sigMajor * scale1s, ELLIPSE.sigMinor * scale1s, ELLIPSE.angle,
      toX, toY, 1, 1
    );
    ctx.fillStyle = "rgba(124,58,237,0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.50)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ΛCDM point
    const lx = toX(-1), ly = toY(0);
    ctx.beginPath();
    const s = 6;
    ctx.moveTo(lx, ly - s); ctx.lineTo(lx + s * 0.6, ly + s * 0.4);
    ctx.lineTo(lx - s * 0.6, ly + s * 0.4); ctx.closePath();
    ctx.fillStyle = "rgba(248,113,113,0.9)";
    ctx.fill();
    ctx.fillStyle = "rgba(248,113,113,0.75)";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("ΛCDM  (−1, 0)", lx + 9, ly + 4);

    // DESI best-fit point
    const dx = toX(DESI_W0), dy = toY(DESI_WA);
    ctx.beginPath();
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(167,139,250,0.95)";
    ctx.fill();
    ctx.fillStyle = "rgba(167,139,250,0.8)";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`DESI 2024  (${DESI_W0}, ${DESI_WA})`, dx + 8, dy - 6);

    // Distance indicator
    ctx.strokeStyle = "rgba(250,204,21,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(dx, dy); ctx.stroke();
    ctx.setLineDash([]);
    const mx = (lx + dx) / 2, my = (ly + dy) / 2;
    ctx.fillStyle = "rgba(250,204,21,0.6)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("2.5–3.9σ", mx + 20, my - 6);

    // CVC constraint ray: w_a = +3(1 + w0), passes through ΛCDM (-1, 0)
    // Clip to plot bounds
    ctx.save();
    ctx.beginPath();
    ctx.rect(padL, padT, plotW, plotH);
    ctx.clip();
    ctx.setLineDash([6, 3]);
    ctx.strokeStyle = "rgba(52,211,153,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // draw from w0=-1.55 to w0=-0.25
    const rayW0Start = -1.55, rayW0End = -0.25;
    ctx.moveTo(toX(rayW0Start), toY(3 * (1 + rayW0Start)));
    ctx.lineTo(toX(rayW0End), toY(3 * (1 + rayW0End)));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // CVC label on the ray
    ctx.fillStyle = "rgba(52,211,153,0.55)";
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    ctx.fillText("wₐ = +3(1+w₀)  [CVC]", toX(-1.45), toY(3*(1+-1.45)) - 6);

    // CVC prediction point: ν ≈ 0.02 (≈ΛCDM best fit); the CVC ray at w₀=-0.727 sits at w_a = +3(0.273) = +0.819, far from DESI's wa=-1.05
    const CVC_W0 = -0.727, CVC_WA = 3 * (1 + -0.727); // ≈ +0.819
    const sx = toX(CVC_W0), sy = toY(CVC_WA);
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(52,211,153,0.85)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "rgba(52,211,153,0.25)";
    ctx.fill();
    ctx.fillStyle = "rgba(52,211,153,0.8)";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("CVC  (−0.73, +0.82)", sx + 8, sy + 4);

    // Tick labels
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    for (let w0 = -1.5; w0 <= -0.25; w0 += 0.25) {
      ctx.fillText(w0.toFixed(2), toX(w0), padT + plotH + 16);
    }
    ctx.textAlign = "right";
    for (let wa = -2.5; wa <= 1.5; wa += 0.5) {
      ctx.fillText(wa.toFixed(1), padL - 6, toY(wa) + 4);
    }

    // Axis labels
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.font = "10px monospace";
    ctx.fillText("w₀  (today's equation of state)", padL + plotW / 2, H - 6);
    ctx.save();
    ctx.translate(12, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("wₐ  (time evolution)", 0, 0);
    ctx.restore();

    // Legend
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    [
      ["rgba(124,58,237,0.50)", "DESI 1σ (68.3%)"],
      ["rgba(124,58,237,0.25)", "DESI 2σ (95.4%)"],
    ].forEach(([color, label], i) => {
      ctx.fillStyle = color as string;
      ctx.fillRect(padL + 8, padT + 8 + i * 18, 14, 10);
      ctx.fillStyle = "rgba(148,163,184,0.55)";
      ctx.fillText(label, padL + 26, padT + 17 + i * 18);
    });
    // CVC legend entry
    ctx.strokeStyle = "rgba(52,211,153,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(padL + 8, padT + 8 + 2 * 18 + 5);
    ctx.lineTo(padL + 22, padT + 8 + 2 * 18 + 5);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    ctx.fillText("CVC prediction ray", padL + 26, padT + 17 + 2 * 18);
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
        style={{ height: "400px" }}
      />
      <div className="px-5 py-3 border-t border-surface-light bg-surface/40">
        <p className="text-xs font-mono text-muted/55 leading-relaxed">
          w₀–wₐ parameter space. DESI DR1 +CMB+DES-SN5YR confidence ellipses (arXiv:2404.03002, ρ ≈ −0.90).
          The CVC ray wₐ = +3(1+w₀) is the Causal Vacuum Correspondence prediction — a one-parameter family
          through ΛCDM. The CVC point at (−0.73, +0.82) falls far from the DESI ellipse (DESI prefers wₐ ≈ −1.05),
          so the H²-line model is disfavoured by DESI.
        </p>
      </div>
    </div>
  );
}
