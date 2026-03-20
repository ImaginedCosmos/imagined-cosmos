"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Friedmann equation solver + animated cosmic expansion visualization.
 *
 * Shows galaxies (dots) expanding from a center, with the expansion rate
 * governed by the actual Friedmann equations. Users can toggle dark energy
 * on/off to see its effect — with Λ the expansion accelerates, without
 * it decelerates and eventually halts.
 */

// Cosmological parameters (Planck 2018)
const OMEGA_M = 0.315;
const OMEGA_L = 0.685;
const OMEGA_R = 9.1e-5;

function hubbleSquared(a: number, omegaL: number): number {
  const omegaK = 1 - OMEGA_M - OMEGA_R - omegaL;
  return (
    OMEGA_R * Math.pow(a, -4) +
    OMEGA_M * Math.pow(a, -3) +
    omegaK * Math.pow(a, -2) +
    omegaL
  );
}

// Precompute scale factor evolution using RK4
function computeScaleFactors(omegaL: number, steps: number): number[] {
  const dt = 0.0003;
  const factors: number[] = [];
  let a = 0.08;

  for (let i = 0; i < steps; i++) {
    factors.push(a);
    const H2 = hubbleSquared(a, omegaL);
    if (H2 <= 0) break;
    // da/dt = a * H(a), where H = sqrt(H2) in units of H0
    const k1 = a * Math.sqrt(H2);
    const a2 = a + 0.5 * dt * k1;
    const k2 = a2 * Math.sqrt(Math.max(0, hubbleSquared(a2, omegaL)));
    const a3 = a + 0.5 * dt * k2;
    const k3 = a3 * Math.sqrt(Math.max(0, hubbleSquared(a3, omegaL)));
    const a4 = a + dt * k3;
    const k4 = a4 * Math.sqrt(Math.max(0, hubbleSquared(a4, omegaL)));
    a += (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  }

  return factors;
}

interface Galaxy {
  // Position at a=1 (comoving coordinates)
  cx: number;
  cy: number;
  size: number;
  hue: number;
  brightness: number;
}

function createGalaxies(count: number): Galaxy[] {
  const galaxies: Galaxy[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.1 + Math.random() * 0.42;
    galaxies.push({
      cx: Math.cos(angle) * r,
      cy: Math.sin(angle) * r,
      size: 1.2 + Math.random() * 2.5,
      hue: 200 + Math.random() * 80, // Blue to purple range
      brightness: 0.5 + Math.random() * 0.5,
    });
  }
  return galaxies;
}

export default function ExpansionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [darkEnergy, setDarkEnergy] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const frameRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const galaxiesRef = useRef<Galaxy[]>(createGalaxies(200));
  const scaleFactorsRef = useRef<{
    withDE: number[];
    withoutDE: number[];
  } | null>(null);

  // Precompute both scenarios
  useEffect(() => {
    const totalFrames = 12000;
    scaleFactorsRef.current = {
      withDE: computeScaleFactors(OMEGA_L, totalFrames),
      withoutDE: computeScaleFactors(0, totalFrames),
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const scales = scaleFactorsRef.current;
    if (!canvas || !ctx || !scales) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const centerX = w / 2;
    const centerY = h / 2;
    const maxR = Math.min(w, h) / 2;

    const factors = darkEnergy ? scales.withDE : scales.withoutDE;
    const frame = Math.min(frameRef.current, factors.length - 1);
    const a = factors[frame];

    // Background
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, w, h);

    // Subtle radial glow at center
    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      maxR * 0.3
    );
    glow.addColorStop(0, "rgba(124, 58, 237, 0.08)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Draw galaxies
    const galaxies = galaxiesRef.current;
    for (const g of galaxies) {
      const x = centerX + g.cx * a * maxR * 2;
      const y = centerY + g.cy * a * maxR * 2;

      // Skip if outside canvas
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;

      // Glow effect
      const glowR = g.size * 3;
      const galaxyGlow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      galaxyGlow.addColorStop(
        0,
        `hsla(${g.hue}, 80%, ${g.brightness * 70}%, 0.6)`
      );
      galaxyGlow.addColorStop(1, "transparent");
      ctx.fillStyle = galaxyGlow;
      ctx.fillRect(x - glowR, y - glowR, glowR * 2, glowR * 2);

      // Core
      ctx.beginPath();
      ctx.arc(x, y, g.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${g.hue}, 70%, ${g.brightness * 80}%, 0.9)`;
      ctx.fill();
    }

    // HUD overlay
    ctx.fillStyle = "rgba(226, 232, 240, 0.7)";
    ctx.font = "13px monospace";
    const redshift = a > 0.001 ? (1 / a - 1).toFixed(2) : "---";
    ctx.fillText(`Scale factor a = ${a.toFixed(3)}`, 16, 28);
    ctx.fillText(`Redshift z = ${redshift}`, 16, 48);
    ctx.fillText(
      `Dark energy: ${darkEnergy ? "ON (Ω_Λ = 0.685)" : "OFF (Ω_Λ = 0)"}`,
      16,
      68
    );

    // Deceleration parameter
    const H2 = hubbleSquared(a, darkEnergy ? OMEGA_L : 0);
    if (H2 > 0) {
      const oL = darkEnergy ? OMEGA_L : 0;
      const q =
        (OMEGA_R * Math.pow(a, -4) + 0.5 * OMEGA_M * Math.pow(a, -3) - oL) /
        H2;
      ctx.fillStyle =
        q < 0
          ? "rgba(167, 139, 250, 0.9)"
          : "rgba(248, 113, 113, 0.9)";
      ctx.fillText(
        `${q < 0 ? "Accelerating" : "Decelerating"} (q = ${q.toFixed(3)})`,
        16,
        88
      );
    }

    // Time indicator bar
    const progress = frame / (factors.length - 1);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(16, h - 24, w - 32, 4);
    ctx.fillStyle = darkEnergy
      ? "rgba(124, 58, 237, 0.8)"
      : "rgba(248, 113, 113, 0.8)";
    ctx.fillRect(16, h - 24, (w - 32) * progress, 4);
    ctx.fillStyle = "rgba(226, 232, 240, 0.5)";
    ctx.font = "11px monospace";
    ctx.fillText("Big Bang", 16, h - 30);
    ctx.textAlign = "right";
    ctx.fillText("Future", w - 16, h - 30);
    ctx.textAlign = "left";
  }, [darkEnergy]);

  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;
      draw();
      if (isPlaying) {
        frameRef.current += 3;
        const factors = darkEnergy
          ? scaleFactorsRef.current?.withDE
          : scaleFactorsRef.current?.withoutDE;
        if (factors && frameRef.current >= factors.length) {
          frameRef.current = 0;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw, isPlaying, darkEnergy]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-surface-light">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "480px" }}
      />
      <div className="absolute bottom-10 right-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1.5 rounded-lg bg-surface-light/80 backdrop-blur text-sm font-mono text-foreground hover:bg-accent-dim/50 transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            frameRef.current = 0;
          }}
          className="px-3 py-1.5 rounded-lg bg-surface-light/80 backdrop-blur text-sm font-mono text-foreground hover:bg-accent-dim/50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => {
            setDarkEnergy(!darkEnergy);
            frameRef.current = 0;
          }}
          className={`px-3 py-1.5 rounded-lg backdrop-blur text-sm font-mono transition-colors ${
            darkEnergy
              ? "bg-accent/30 text-violet-200 hover:bg-accent/50"
              : "bg-red-900/30 text-red-200 hover:bg-red-900/50"
          }`}
        >
          {darkEnergy ? "Λ ON" : "Λ OFF"}
        </button>
      </div>
    </div>
  );
}
