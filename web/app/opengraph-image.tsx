import { ImageResponse } from "next/og";

export const alt = "LearnAI: a free roadmap to learn AI from scratch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#14181c", color: "#f2efe6" }}>
        <div style={{ fontSize: 112, fontWeight: 700 }}>LearnAI</div>
        <div style={{ fontSize: 48, marginTop: 20, color: "#c9c4b6" }}>Learn AI from scratch.</div>
        <div style={{ fontSize: 36, marginTop: 36, color: "#e8b04a" }}>Learn → Solve → Build. Free.</div>
      </div>
    ),
    size,
  );
}
