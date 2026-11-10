import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Bookmark, BookOpen, Code2, Hammer, Check, GitBranch, Users } from "lucide-react";

// Brand tokens from web/app/globals.css
const C = { paper: "#fbfaf5", sheet: "#fffdf7", ink: "#24262b", mute: "#66655f", rule: "#dcd7c9", grid: "#e3e8ef", red: "#d9534f", margin: "#e9a6a6", blue: "#3b6fd8", green: "#2f9e66" };
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, sans-serif";

const FIELDS = ["Foundations", "Classical AI", "Data Science", "Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Reinforcement Learning", "Robotics", "Generative AI", "Agentic AI", "Applied AI", "MLOps", "Future & Safety"];

// Scene lengths (frames @30fps). Effective = sum - 8 * T.
const S = [80, 55, 75, 85, 115, 115, 100, 90, 120];
const T = 10;
export const DURATION = S.reduce((a, b) => a + b, 0) - (S.length - 1) * T; // 755 ≈ 25.2s

const useP = () => {
  const { width, height } = useVideoConfig();
  return { portrait: height > width, w: width, h: height };
};
const useSpring = (delay = 0, damping = 14) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping } });
};

// Notebook paper background with red margin line
const Paper: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => {
  const { portrait } = useP();
  return (
    <AbsoluteFill
      style={{
        background: dark ? C.ink : C.paper,
        backgroundImage: dark ? undefined : `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        fontFamily: SANS,
        color: dark ? C.paper : C.ink,
        justifyContent: "center",
        alignItems: "center",
        padding: portrait ? 70 : 100,
      }}
    >
      {!dark && <div style={{ position: "absolute", left: portrait ? 50 : 120, top: 0, bottom: 0, width: 3, background: C.margin }} />}
      {children}
    </AbsoluteFill>
  );
};

const Headline: React.FC<{ children: React.ReactNode; size?: number; delay?: number; color?: string }> = ({ children, size = 96, delay = 0, color }) => {
  const s = useSpring(delay);
  const { portrait } = useP();
  return (
    <div style={{ fontFamily: SERIF, fontSize: portrait ? size * 0.82 : size, fontWeight: 700, lineHeight: 1.08, textAlign: "center", letterSpacing: -1, color, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
      {children}
    </div>
  );
};

// 1. Hook: bookmarked courses pile up, counter races to 47
const SBookmarks: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait, w, h } = useP();
  const n = Math.round(interpolate(f, [0, 55], [0, 47], { extrapolateRight: "clamp" }));
  const titles = ["Intro to ML", "Deep Learning A–Z", "LLM Bootcamp", "Math for AI", "PyTorch Masterclass", "CV Crash Course", "RL Fundamentals", "Agents 101", "NLP Zero to Hero", "MLOps Pro"];
  return (
    <Paper>
      {Array.from({ length: 22 }).map((_, i) => {
        const d = i * 2.4;
        const s = spring({ frame: f - d, fps: 30, config: { damping: 16 } });
        const x = ((i * 397) % 100) / 100;
        const y = ((i * 211) % 100) / 100;
        const rot = ((i * 53) % 30) - 15;
        return (
          <div key={i} style={{ position: "absolute", left: x * (w - 420), top: y * (h - 120), opacity: s * 0.9, transform: `scale(${0.6 + s * 0.4}) rotate(${rot}deg)`, background: C.sheet, border: `2px solid ${C.rule}`, borderRadius: 14, padding: "14px 22px", display: "flex", gap: 12, alignItems: "center", fontSize: 28, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
            <Bookmark size={28} color={C.blue} fill={C.blue} /> {titles[i % titles.length]}
          </div>
        );
      })}
      <div style={{ zIndex: 2, background: C.paper, padding: "30px 60px", borderRadius: 28, boxShadow: "0 30px 80px rgba(0,0,0,.18)", textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: portrait ? 220 : 260, lineHeight: 1, color: C.blue }}>{n}</div>
        <div style={{ fontSize: portrait ? 46 : 54, fontWeight: 600 }}>AI courses bookmarked</div>
      </div>
    </Paper>
  );
};

// 2. Hook payoff: 0 finished
const SZero: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 9);
  const strike = interpolate(f, [12, 26], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Paper dark>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 380, lineHeight: 1, color: C.red, transform: `scale(${0.4 + s * 0.6})` }}>0</div>
        <div style={{ position: "relative", fontSize: 64, fontWeight: 600, display: "inline-block" }}>
          finished.
          <div style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${strike}%`, background: C.red }} />
        </div>
      </div>
    </Paper>
  );
};

// 3. Chaos: where do you start?
const SChaos: React.FC = () => {
  const f = useCurrentFrame();
  const { w, h } = useP();
  return (
    <Paper>
      {FIELDS.map((t, i) => {
        const a = (i / FIELDS.length) * Math.PI * 2 + f * 0.012;
        const r = Math.min(w, h) * (0.33 + ((i * 7) % 5) * 0.03);
        const o = interpolate(f, [i * 2, i * 2 + 10], [0, 0.55], { extrapolateRight: "clamp" });
        return (
          <div key={t} style={{ position: "absolute", left: w / 2 + Math.cos(a) * r * (w > h ? 1.5 : 1), top: h / 2 + Math.sin(a) * r, transform: "translate(-50%,-50%)", fontSize: 30, color: C.mute, opacity: o, whiteSpace: "nowrap" }}>
            {t}?
          </div>
        );
      })}
      <Headline size={104}>Where do you<br />even start?</Headline>
    </Paper>
  );
};

// 4. Reveal
const SReveal: React.FC = () => {
  const s = useSpring(0, 12);
  const line = interpolate(useCurrentFrame(), [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Paper>
      <div style={{ textAlign: "center", transform: `scale(${0.85 + s * 0.15})`, opacity: s }}>
        <div style={{ fontFamily: SERIF, fontSize: 170, fontWeight: 700, letterSpacing: -4 }}>
          Learn<span style={{ color: C.red }}>Stuff</span>
        </div>
        <div style={{ height: 6, background: C.red, width: `${line * 100}%`, margin: "0 auto 30px", borderRadius: 3 }} />
        <Headline size={58} delay={18} color={C.mute}>One free map for all of AI.</Headline>
      </div>
    </Paper>
  );
};

// 5. The map: 14 fields light up as a dependency tree, with 3D tilt
const SMap: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait } = useP();
  
  return (
    <Paper>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Headline size={76}>14 fields. ~150 lessons.</Headline>
        <div style={{ perspective: 1600 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: portrait ? 900 : 1640, gap: 20, transform: `rotateX(${interpolate(f, [0, 115], [22, 8])}deg)` }}>
            {FIELDS.map((t, i) => {
              const s = spring({ frame: f - 8 - i * 4, fps: 30, config: { damping: 13 } });
              const lit = f > 20 + i * 4;
              return (
                <div key={t} style={{ opacity: s, transform: `translateY(${(1 - s) * 60}px)`, background: lit ? C.sheet : C.paper, border: `2px solid ${lit ? C.ink : C.rule}`, borderRadius: 16, padding: "18px 20px", fontSize: portrait ? 40 : 30, fontWeight: 600, display: "flex", alignItems: "center", gap: 14, boxShadow: lit ? "0 14px 30px rgba(0,0,0,.10)" : "none" }}>
                  <span style={{ fontFamily: SERIF, color: C.red, fontSize: 26 }}>{String(i).padStart(2, "0")}</span>
                  {t}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Paper>
  );
};

// 6. The loop: Learn -> Solve -> Build
const SLoop: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait } = useP();
  const steps = [
    { icon: BookOpen, label: "Learn", sub: "the concept", c: C.blue },
    { icon: Code2, label: "Solve", sub: "real problems", c: C.red },
    { icon: Hammer, label: "Build", sub: "a project", c: C.green },
  ];
  return (
    <Paper>
      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 50 : 70, alignItems: "center" }}>
        {steps.map((st, i) => {
          const s = spring({ frame: f - i * 22, fps: 30, config: { damping: 12 } });
          const Icon = st.icon;
          return (
            <React.Fragment key={st.label}>
              {i > 0 && <div style={{ fontSize: 80, color: C.rule, opacity: s }}>{portrait ? "↓" : "→"}</div>}
              <div style={{ textAlign: "center", opacity: s, transform: `scale(${0.6 + s * 0.4})` }}>
                <div style={{ width: 210, height: 210, borderRadius: 50, background: st.c, display: "grid", placeItems: "center", margin: "0 auto 22px", boxShadow: `0 24px 50px ${st.c}55` }}>
                  <Icon size={110} color="#fff" strokeWidth={2.2} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 84, fontWeight: 700 }}>{st.label}</div>
                <div style={{ fontSize: 36, color: C.mute }}>{st.sub}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Paper>
  );
};

// 7. Progress: 3D browser mockup with checkboxes ticking
const SProgress: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait } = useP();
  const enter = useSpring(0, 16);
  const rows = ["Vectors & matrix multiplication", "Gradient descent from scratch", "Bayes' theorem", "A* search on the 8-puzzle", "Build: SVD image compression"];
  const done = Math.floor(interpolate(f, [20, 85], [0, rows.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pct = Math.round((done / rows.length) * 100);
  return (
    <Paper>
      <div style={{ perspective: 1800 }}>
        <div style={{ width: portrait ? 900 : 1300, background: C.sheet, borderRadius: 22, border: `2px solid ${C.rule}`, boxShadow: "0 50px 100px rgba(0,0,0,.18)", overflow: "hidden", transform: `rotateY(${(1 - enter) * -25 + (portrait ? 0 : -8)}deg) rotateX(6deg) translateY(${(1 - enter) * 80}px)`, opacity: enter }}>
          <div style={{ height: 56, background: C.paper, borderBottom: `2px solid ${C.rule}`, display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>
            {[C.red, "#e5b93b", C.green].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
            <div style={{ marginLeft: 20, fontSize: 22, color: C.mute }}>learnstuff-zeta.vercel.app</div>
          </div>
          <div style={{ padding: "34px 44px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 700 }}>00 · Foundations</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: C.green }}>{pct}%</div>
            </div>
            <div style={{ height: 14, background: C.grid, borderRadius: 7, marginBottom: 26 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: C.green, borderRadius: 7 }} />
            </div>
            {rows.map((r, i) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderBottom: `1px solid ${C.rule}`, fontSize: 32, color: i < done ? C.mute : C.ink, textDecoration: i < done ? "line-through" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, border: `3px solid ${i < done ? C.green : C.rule}`, background: i < done ? C.green : "transparent", display: "grid", placeItems: "center" }}>
                  {i < done && <Check size={28} color="#fff" strokeWidth={3.5} />}
                </div>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Paper>
  );
};

// 8. Together
const STogether: React.FC = () => {
  const s = useSpring(4, 12);
  return (
    <Paper dark>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginBottom: 40, opacity: s, transform: `scale(${0.7 + s * 0.3})` }}>
          <GitBranch size={130} color={C.paper} />
          <Users size={130} color={C.margin} />
        </div>
        <Headline size={92}>Open source.</Headline>
        <Headline size={92} delay={14} color={C.margin}>Built to learn together.</Headline>
      </div>
    </Paper>
  );
};

// 9. CTA
const SCta: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(10, 12);
  const pulse = 1 + Math.sin(f / 8) * 0.015;
  const { portrait } = useP();
  return (
    <Paper>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontSize: 150, fontWeight: 700, letterSpacing: -4 }}>
          Learn<span style={{ color: C.red }}>Stuff</span>
        </div>
        <Headline size={64} delay={4} color={C.mute}>Start today. It's free.</Headline>
        <div style={{ marginTop: 50, display: "inline-block", background: C.ink, color: C.paper, fontSize: portrait ? 40 : 52, fontWeight: 600, padding: "26px 54px", borderRadius: 20, opacity: s, transform: `scale(${(0.8 + s * 0.2) * pulse})`, boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
          learnstuff-zeta.vercel.app
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: C.mute, opacity: s }}>github.com/hp-8/LearnStuff</div>
      </div>
    </Paper>
  );
};

const SCENES = [SBookmarks, SZero, SChaos, SReveal, SMap, SLoop, SProgress, STogether, SCta];
// Hard cut style for the hook (fast fade), slide for the "story" beats
const TRANS = [fade(), fade(), fade(), slide({ direction: "from-right" }), slide({ direction: "from-right" }), slide({ direction: "from-right" }), fade(), fade()];

export const Promo: React.FC = () => (
  <TransitionSeries>
    {SCENES.map((Scene, i) => (
      <React.Fragment key={i}>
        <TransitionSeries.Sequence durationInFrames={S[i]}>
          <Scene />
        </TransitionSeries.Sequence>
        {i < SCENES.length - 1 && <TransitionSeries.Transition presentation={TRANS[i]} timing={linearTiming({ durationInFrames: T })} />}
      </React.Fragment>
    ))}
  </TransitionSeries>
);
