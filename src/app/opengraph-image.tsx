import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Imagined Cosmos — Continuing where Einstein left us";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#030014",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.22) 0%, transparent 65%)",
          }}
        />

        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orbital rings */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: "50%",
            transform: "translateY(-50%)",
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 360,
              height: 360,
              borderRadius: "50%",
              border: "1px solid rgba(124,58,237,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "1px solid rgba(124,58,237,0.4)",
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ position: "relative", maxWidth: 680 }}>
          <div
            style={{
              fontSize: 13,
              fontFamily: "monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#7c3aed",
              marginBottom: 20,
            }}
          >
            Computational Physics + Generative AI
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#e2e8f0",
              marginBottom: 24,
            }}
          >
            Imagined{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #818cf8)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Cosmos
            </span>
          </div>

          <div
            style={{
              fontSize: 22,
              color: "#94a3b8",
              lineHeight: 1.5,
              marginBottom: 40,
            }}
          >
            Continuing where Einstein left us — dark energy, the cosmological
            constant, and a proposed solution.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            {["10¹²¹ discrepancy", "DESI 2024", "w(z) ≠ −1", "Hubble tension"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "#94a3b8",
                    background: "#1a1145",
                    border: "1px solid #2d1f6e",
                    borderRadius: 6,
                    padding: "5px 10px",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            fontSize: 13,
            fontFamily: "monospace",
            color: "rgba(148,163,184,0.45)",
          }}
        >
          imagined-cosmos.example.com
        </div>
      </div>
    ),
    { ...size }
  );
}
