import { ImageResponse } from "next/og";

export const alt = "SewaLink Nepal — Trusted Local Services, One Tap Away";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1A2440 0%, #23315A 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#E8A33D",
              color: "#1A2440",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            स
          </div>
          <div style={{ color: "#FBF9F4", fontSize: 32, fontWeight: 700 }}>
            SewaLink Nepal
          </div>
        </div>
        <div style={{ color: "#F2BB63", fontSize: 24, marginBottom: 24 }}>
          Trusted local help, verified before they knock on your door.
        </div>
        <div
          style={{
            color: "#FBF9F4",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 950,
          }}
        >
          Verified electricians, plumbers, tutors & more — across Kathmandu, Pokhara & beyond.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 80,
            color: "rgba(251,249,244,0.6)",
            fontSize: 22,
            fontFamily: "monospace",
          }}
        >
          sewalinknepal.com · 2,400+ verified pros · 38,000+ jobs completed
        </div>
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(232,163,61,0.15)",
            filter: "blur(80px)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
