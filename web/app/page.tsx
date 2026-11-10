"use client";

import { useEffect, useState } from "react";
import { FIELDS, KIND, DIFF, W as wiki, linkKind, type Field, type Step } from "./curriculum";
import s from "./page.module.css";
import { track } from "./site";

const STORE = "ai-atlas-v3", NOTES = "ai-atlas-notes-v3";
const WIDTH = 1000, ROW = 250, TOP = 90;

type Star = Step & { k: string; n: number; x: number; y: number; ux: number; uy: number; sub: number };
type Geo = { cx: number; cy: number; span: number };

// Seeded RNG so every field keeps the same shape across reloads.
function rng(id: string) {
  let a = [...id].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Segments ab and cd properly intersect?
const cross = (a: number[], b: number[], c: number[], d: number[]) => {
  const o = (p: number[], q: number[], r: number[]) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b);
};

// Constellation shape: a seeded self-avoiding walk in learning order. Each step turns sharply and varies in length,
// never crosses an earlier segment, keeps stars apart, and prefers staying compact. Returns points centred on 0.
function shape(id: string, n: number) {
  const r = rng(id);
  const pts: number[][] = [[0, 0]];
  let heading = r() * 2 * Math.PI;
  for (let j = 1; j < n; j++) {
    const last = pts[j - 1];
    const cx = pts.reduce((s, q) => s + q[0], 0) / j, cy = pts.reduce((s, q) => s + q[1], 0) / j;
    let best: { p: number[]; h: number; score: number } | null = null;
    for (let t = 0; t < 60; t++) {
      const h = heading + (r() - 0.5) * (t < 30 ? 2.2 : 6.28), len = 0.75 + 0.85 * r();
      const c = [last[0] + Math.cos(h) * len, last[1] + Math.sin(h) * len];
      if (pts.some(q => Math.hypot(q[0] - c[0], q[1] - c[1]) < 0.8)) continue;
      if (pts.slice(0, -2).some((q, i) => cross(q, pts[i + 1], last, c))) continue;
      const score = 0.35 * Math.hypot(c[0] - cx, c[1] - cy) + r();
      if (!best || score < best.score) best = { p: c, h, score };
    }
    const pick = best ?? { p: [last[0] + 1, last[1]], h: 0 };
    pts.push(pick.p);
    heading = pick.h;
  }
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  const hx = (Math.max(...xs) - Math.min(...xs)) / 2 || 1, hy = (Math.max(...ys) - Math.min(...ys)) / 2 || 1;
  return { pts: pts.map(([x, y]) => [x - mx, y - my]), hx, hy };
}

// Fields placed by prerequisite row.
function layout() {
  const rows: Record<number, Field[]> = {};
  FIELDS.forEach(f => (rows[f.row] ??= []).push(f));
  const geo: Record<string, Geo> = {}, stars: Record<string, Star[]> = {};
  Object.values(rows).forEach(fs =>
    fs.forEach((f, i) => {
      const steps = f.subs.flatMap((sb, si) => sb.steps.map((st, pi) => ({ ...st, sub: si, k: `${f.id}-${si}-${pi}` })));
      const span = fs.length === 1 ? 190 : 100;
      const jitter = fs.length === 1 ? 0 : ((f.id.charCodeAt(0) * 37) % 30) - 15;
      const cx = ((i + 0.5) * WIDTH) / fs.length + jitter, cy = TOP + f.row * ROW;
      const { pts, hx, hy } = shape(f.id, steps.length), fit = Math.min(span / hx, 60 / hy);
      geo[f.id] = { cx, cy, span };
      stars[f.id] = steps.map((st, j) => ({
        ...st, n: j + 1,
        x: cx + pts[j][0] * fit, y: cy + pts[j][1] * fit,
        ux: pts[j][0], uy: pts[j][1],
      }));
    }),
  );
  return { geo, stars, height: TOP + (Object.keys(rows).length - 1) * ROW + 120 };
}

// Star size by step type, like magnitude: theorems brightest.
const MAG = { T: 1.3, A: 1.15, C: 1, B: 0.88 } as const;

const { stars, height, geo } = layout();

const load = (k: string) => { try { return JSON.parse(localStorage.getItem(k) ?? "{}"); } catch { return {}; } };
const store = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const Ext = () => <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M3 1h6v6M9 1 1 9" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
const Chev = ({ flip }: { flip?: boolean }) => <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}><path d="M9 2 4 7l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;

export default function Atlas() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [sel, setSel] = useState("fnd");
  const [pick, setPick] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [flare, setFlare] = useState<string | null>(null);

  // localStorage is client-only; read after hydration so server and client markup match.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setDone(load(STORE)); setNotes(load(NOTES)); }, []);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (e.target as HTMLElement).tagName !== "TEXTAREA") setZoom(false);
    };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, []);

  // ← → move between fields while zoomed in.
  useEffect(() => {
    if (!zoom) return;
    const nav = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      const next = FIELDS[FIELDS.findIndex(f => f.id === sel) + (e.key === "ArrowLeft" ? -1 : 1)];
      if (next) { setSel(next.id); setPick(null); }
    };
    addEventListener("keydown", nav);
    return () => removeEventListener("keydown", nav);
  }, [zoom, sel]);

  const toggle = (k: string, star?: Star) => {
    const next = { ...done, [k]: !done[k] };
    // Solving every problem lights the star.
    if (star) next[star.k] = star.problems.every((_, i) => next[`${star.k}-x${i}`]);
    const sk = star?.k ?? k;
    if (next[k] && !done[k]) track(star ? "problem_solved" : "step_completed", { step: sk, problem: k });
    if (next[sk] && !done[sk]) setFlare(sk);
    setDone(next);
    store(STORE, next);
  };
  const writeNote = (k: string, v: string) => {
    const next = { ...notes, [k]: v };
    setNotes(next);
    store(NOTES, next);
  };
  const open = (id: string) => { setSel(id); setPick(null); setZoom(true); };

  const count = (id: string) => {
    const st = stars[id];
    return [st.filter(x => done[x.k]).length, st.length];
  };
  const all = FIELDS.map(f => count(f.id)).reduce((a, [d, n]) => [a[0] + d, a[1] + n], [0, 0]);
  const fi = FIELDS.findIndex(f => f.id === sel), field = FIELDS[fi];
  const [sd, sn] = count(sel);
  // Close-up: same shape, uniform scale.
  const Z = 52;
  const zst = stars[sel].map(a => ({ ...a, x: a.ux * Z, y: a.uy * Z }));
  const zx = zst.map(a => a.x), zy = zst.map(a => a.y);
  const zb = [Math.min(...zx) - 45, Math.min(...zy) - 45, Math.max(...zx) - Math.min(...zx) + 90, Math.max(...zy) - Math.min(...zy) + 90];
  const star = pick ? zst.find(x => x.k === pick) ?? null : null;
  const label = hover ?? pick;

  const lines = (st: Star[]) =>
    st.slice(0, -1).map((a, i) => {
      const b = st[i + 1];
      return <line key={a.k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={done[a.k] && done[b.k] ? s.linkLit : s.link} />;
    });

  return (
    <div className={s.app}>
      <header className={s.bar}>
        <h1 className={s.brand}>LearnAI</h1>
        <p className={s.total}><strong>{all[0]}</strong> of {all[1]} stars lit</p>
        <div className={s.meter} role="progressbar" aria-valuenow={all[0]} aria-valuemax={all[1]} aria-label="Overall progress">
          <i style={{ width: `${(all[0] / all[1]) * 100}%` }} />
        </div>
        <a href="/privacy" className={s.privacy}>Privacy</a>
      </header>

      <div className={s.skyWrap}>
        <main className={s.sky} aria-hidden={zoom}>
          <svg viewBox={`0 0 ${WIDTH} ${height}`} className={s.chart} role="group" aria-label="Star chart of AI fields">
            <g className={s.grid}>
              {Array.from({ length: Math.ceil(height / ROW) }, (_, i) => <line key={`h${i}`} x1={0} x2={WIDTH} y1={i * ROW + TOP - ROW / 2} y2={i * ROW + TOP - ROW / 2} />)}
              {[250, 500, 750].map(x => <line key={`v${x}`} x1={x} x2={x} y1={0} y2={height} />)}
            </g>
            {FIELDS.map((f, i) => {
              const st = stars[f.id], { cx, cy, span } = geo[f.id], [d, n] = count(f.id), on = f.id === sel;
              return (
                <g key={f.id} className={`${s.con} ${on ? s.on : ""}`} onClick={() => open(f.id)}
                   role="button" tabIndex={zoom ? -1 : 0} aria-label={`Field ${i + 1}: ${f.name}, ${d} of ${n} solved. Open.`}
                   onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(f.id))}>
                  <ellipse cx={cx} cy={cy} rx={span + 20} ry={72} className={s.hit} />
                  {lines(st)}
                  {st.map(a => <circle key={a.k} cx={a.x} cy={a.y} r={(done[a.k] ? 5 : 3.8) * MAG[a.kind]} className={done[a.k] ? s.starLit : s.star} />)}
                  <text x={cx} y={cy + 92} className={s.label}><tspan className={s.num}>{i + 1}</tspan>  {f.name}</text>
                  <text x={cx} y={cy + 110} className={s.sub}>{d} / {n}</text>
                </g>
              );
            })}
          </svg>
        </main>

        {zoom && (
          <section className={s.zoom} aria-label={`${field.name} close-up`}>
            <button className={s.back} onClick={() => setZoom(false)} autoFocus><Chev /> All fields</button>
            <svg key={sel} viewBox={zb.join(" ")} className={s.zchart}>
              {lines(zst)}
              {zst.map(a => {
                const lit = done[a.k], on = a.k === pick;
                return (
                  <g key={a.k} className={`${s.zstar} ${on ? s.zon : ""}`} onClick={() => setPick(a.k)}
                     onMouseEnter={() => setHover(a.k)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(a.k)} onBlur={() => setHover(null)}
                     role="button" tabIndex={0} aria-label={`Step ${a.n}: ${a.title}${lit ? ", solved" : ""}`}
                     onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setPick(a.k))}>
                    <circle cx={a.x} cy={a.y} r={7.5 * MAG[a.kind]} className={`${lit ? s.zdotLit : s.zdot} ${flare === a.k ? s.flare : ""}`}
                      onAnimationEnd={() => setFlare(null)} />
                    <text x={a.x} y={a.y + 2.2} className={lit ? s.znumLit : s.znum}>{a.n}</text>
                  </g>
                );
              })}
              {label && (() => {
                const a = zst.find(x => x.k === label);
                return a ? <text x={a.x} y={a.y - 12} className={s.ztip}>{a.title}</text> : null;
              })()}
            </svg>
            <nav className={s.fieldNav} aria-label="Fields">
              <button onClick={() => open(FIELDS[fi - 1].id)} disabled={fi === 0}>
                <Chev /> {fi > 0 && <span>{fi} · {FIELDS[fi - 1].name}</span>}
              </button>
              <p className={s.zname}>{fi + 1} · {field.name} <span>{sd} / {sn}</span></p>
              <button onClick={() => open(FIELDS[fi + 1].id)} disabled={fi === FIELDS.length - 1}>
                {fi < FIELDS.length - 1 && <span>{fi + 2} · {FIELDS[fi + 1].name}</span>} <Chev flip />
              </button>
            </nav>
            <p className={s.hint}>Follow the steps in order · click a star for details · ← → to change field · Esc to zoom out</p>
          </section>
        )}
      </div>

      <aside className={s.panel} aria-live="polite">
        {star ? (
          <Detail key={star.k} star={star} field={field} total={zst.length} done={done} note={notes[star.k] ?? ""}
            onBack={() => setPick(null)} onToggle={() => toggle(star.k)} onProblem={i => toggle(`${star.k}-x${i}`, star)}
            onNote={v => writeNote(star.k, v)} onStep={d => setPick(zst[star.n - 1 + d]?.k ?? star.k)} />
        ) : (
          <>
            <p className={s.step}>Field {fi + 1} of {FIELDS.length}</p>
            <h2 className={s.title}>{field.name}</h2>
            <p className={s.meta}>
              {sd} of {sn} stars lit
              {field.deps.length > 0 && <> · after {field.deps.map(d => FIELDS.find(f => f.id === d)!.name).join(", ")}</>}
            </p>
            {field.subs.map((sb, si) => {
              const nk = `${field.id}-${si}`;
              return (
                <section key={sb.name} className={s.group}>
                  <h3 className={s.gname}>{sb.name}{sb.elective ? <span className={s.tag}>Elective</span> : null}</h3>
                  <ul>
                    {zst.filter(a => a.sub === si).map(a => (
                      <li key={a.k} className={s.row}>
                        <input type="checkbox" checked={!!done[a.k]} onChange={() => toggle(a.k)} aria-label={`Mark ${a.title} solved`} />
                        <button className={s.open} onClick={() => { setPick(a.k); setZoom(true); }}>
                          <span className={s.n}>{a.n}</span>
                          <span className={done[a.k] ? s.solved : ""}>{a.title}</span>
                        </button>
                        <span className={s.kindTag}>{KIND[a.kind]}</span>
                      </li>
                    ))}
                  </ul>
                  <textarea className={s.note} placeholder={`Your notes on ${sb.name}…`} aria-label={`Notes for ${sb.name}`}
                    value={notes[nk] ?? ""} onChange={e => writeNote(nk, e.target.value)} rows={notes[nk] ? 4 : 1} />
                </section>
              );
            })}
            <section className={s.project}>
              <h3 className={s.gname}>Capstone project</h3>
              <p>{field.project}</p>
              <textarea className={s.note} placeholder="Project notes, repo link…" aria-label="Project notes"
                value={notes[`${field.id}-project`] ?? ""} onChange={e => writeNote(`${field.id}-project`, e.target.value)} rows={3} />
            </section>
          </>
        )}
      </aside>
    </div>
  );
}

function Detail({ star, field, total, done: all, note, onBack, onToggle, onProblem, onNote, onStep }: {
  star: Star; field: Field; total: number; done: Record<string, boolean>; note: string;
  onBack: () => void; onToggle: () => void; onProblem: (i: number) => void; onNote: (v: string) => void; onStep: (d: number) => void;
}) {
  const done = !!all[star.k];
  const sb = field.subs[star.sub];
  const links: [string, string][] = [...(star.wiki ? [[`Wikipedia: ${star.wiki.replace(/_/g, " ")}`, wiki(star.wiki)] as [string, string]] : []), ...sb.links];
  const cs = star.caseStudy;
  return (
    <>
      <button className={s.crumb} onClick={onBack}><Chev /> {field.name}</button>
      <p className={s.step}>Step {star.n} of {total} · {sb.name}</p>
      <h2 className={s.title}>{star.title}</h2>
      <p className={s.diffLine}>
        <span className={s.kindTag}>{KIND[star.kind]}</span>
        <span className={s[star.diff]}>{DIFF[star.diff]}</span>
      </p>
      <p className={s.explain}>{star.explain}</p>

      <h3 className={s.gname}>Learn it</h3>
      <ul className={s.links}>
        {links.map(([label, url]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer"><span>{label}</span><Ext /></a>
            <span className={s.kind}>{url.includes("wikipedia.org") ? "Article" : linkKind(url)}</span>
          </li>
        ))}
      </ul>

      <h3 className={s.gname}>Problems</h3>
      <ol className={s.exes}>
        {star.problems.map(([title, task, check], i) => {
          const xk = `${star.k}-x${i}`;
          return (
            <li key={xk} className={all[xk] ? s.exDone : s.ex}>
              <label className={s.exHead}>
                <input type="checkbox" checked={!!all[xk]} onChange={() => onProblem(i)} />
                <span>{i + 1}. {title}</span>
              </label>
              <p>{task}</p>
              <p className={s.check}><b>Done when:</b> {check}</p>
            </li>
          );
        })}
      </ol>

      {cs && (
        <>
          <h3 className={s.gname}>Case study</h3>
          <div className={s.case}>
            <a href={cs[1]} target="_blank" rel="noreferrer" className={s.caseTitle}><span>{cs[0]}</span><Ext /></a>
            <p className={s.caseLead}>What to notice</p>
            <ul>{cs[2].map(p => <li key={p}>{p}</li>)}</ul>
          </div>
        </>
      )}

      <h3 className={s.gname}>Your notes</h3>
      <textarea className={s.note} rows={6} placeholder="What you learned, formulas, gotchas, links to your code…"
        aria-label={`Notes for ${star.title}`} value={note} onChange={e => onNote(e.target.value)} />

      <button className={done ? s.solveDone : s.solve} onClick={onToggle} aria-pressed={done}>
        {done ? "Solved · undo" : "Mark as solved"}
      </button>

      <nav className={s.steps} aria-label="Steps">
        <button onClick={() => onStep(-1)} disabled={star.n === 1}><Chev /> Previous</button>
        <button onClick={() => onStep(1)} disabled={star.n === total}>Next step <Chev flip /></button>
      </nav>
    </>
  );
}
