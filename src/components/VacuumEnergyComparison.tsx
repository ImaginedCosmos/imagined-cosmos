"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Interactive visualization comparing the QFT-predicted vacuum energy
 * with the observed value — showing the 120 orders of magnitude gap.
 *
 * Renders two bars: one for the predicted value (impossibly tall) and
 * one for the observed value (barely visible), with a slider to
 * explore different scales.
 */

const OBSERVED_LOG = -47; // log10 of observed vacuum energy density (GeV^4)
const QFT_LOG = 74; // log10 of QFT predicted vacuum energy density (GeV^4)
const DISCREPANCY = QFT_LOG - OBSERVED_LOG; // 121 orders of magnitude

export default function VacuumEnergyComparison() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logScale, setLogScale] = useState(0); // 0 = show observed, 121 = show predicted

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, w, h);

    const barWidth = 80;
    const maxBarHeight = h - 100;
    const baseY = h - 40;

    // Current view range
    const viewMin = OBSERVED_LOG;
    const viewMax = OBSERVED_LOG + Math.max(1, logScale);
    const viewRange = viewMax - viewMin;

    // Observed bar (always full height at its own scale)
    const observedHeight = ((OBSERVED_LOG - viewMin) / viewRange) * maxBarHeight;
    const observedX = w * 0.3;

    // QFT predicted bar
    const predictedHeight = Math.min(
      ((QFT_LOG - viewMin) / viewRange) * maxBarHeight,
      maxBarHeight
    );
    const predictedX = w * 0.7;

    // Draw observed bar
    const obsBarH = Math.max(2, (1 / viewRange) * maxBarHeight * 0.5);
    const obsGrad = ctx.createLinearGradient(0, baseY - obsBarH, 0, baseY);
    obsGrad.addColorStop(0, "rgba(99, 102, 241, 0.9)");
    obsGrad.addColorStop(1, "rgba(99, 102, 241, 0.3)");
    ctx.fillStyle = obsGrad;
    ctx.fillRect(observedX - barWidth / 2, baseY - obsBarH, barWidth, obsBarH);

    // Draw predicted bar
    const predBarH = Math.min(predictedHeight, maxBarHeight);
    if (predBarH > 0) {
      const predGrad = ctx.createLinearGradient(0, baseY - predBarH, 0, baseY);
      predGrad.addColorStop(0, "rgba(239, 68, 68, 0.9)");
      predGrad.addColorStop(1, "rgba(239, 68, 68, 0.3)");
      ctx.fillStyle = predGrad;
      ctx.fillRect(
        predictedX - barWidth / 2,
        baseY - predBarH,
        barWidth,
        predBarH
      );

      // Arrow if bar exceeds canvas
      if (predictedHeight > maxBarHeight) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
        ctx.beginPath();
        ctx.moveTo(predictedX, 20);
        ctx.lineTo(predictedX - 15, 45);
        ctx.lineTo(predictedX + 15, 45);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(239, 68, 68, 0.6)";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("extends far beyond view", predictedX, 60);
      }
    }

    // Labels
    ctx.textAlign = "center";
    ctx.font = "13px monospace";

    ctx.fillStyle = "rgba(99, 102, 241, 0.9)";
    ctx.fillText("Observed", observedX, baseY + 18);
    ctx.font = "11px monospace";
    ctx.fillText(`10^${OBSERVED_LOG} GeV⁴`, observedX, baseY + 34);

    ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
    ctx.font = "13px monospace";
    ctx.fillText("QFT Predicted", predictedX, baseY + 18);
    ctx.font = "11px monospace";
    ctx.fillText(`10^${QFT_LOG} GeV⁴`, predictedX, baseY + 34);

    // Scale indicator
    ctx.fillStyle = "rgba(226, 232, 240, 0.5)";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      `Zoom: 10^${Math.round(viewRange)} orders of magnitude`,
      16,
      24
    );

    // Discrepancy label
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(250, 204, 21, 0.9)";
    ctx.font = "bold 16px monospace";
    ctx.fillText(
      `${DISCREPANCY} orders of magnitude apart`,
      w / 2,
      h / 2 - 20
    );
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
    ctx.fillText("The worst prediction in physics", w / 2, h / 2 + 4);
  }, [logScale]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-surface-light">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "400px" }}
      />
      <div className="absolute bottom-12 left-4 right-4 flex items-center gap-4">
        <span className="text-xs font-mono text-muted whitespace-nowrap">
          Observed
        </span>
        <input
          type="range"
          min={1}
          max={DISCREPANCY + 10}
          value={logScale}
          onChange={(e) => setLogScale(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
        <span className="text-xs font-mono text-muted whitespace-nowrap">
          Predicted
        </span>
      </div>
    </div>
  );
}
