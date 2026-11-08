export type Difficulty = "E" | "M" | "H";
/** C = concept, T = theorem/theory, B = build it, A = apply / real world */
export type Kind = "C" | "T" | "B" | "A";
export type Link = [label: string, url: string];
/** [title, what to build, done when] */
export type Exercise = [title: string, task: string, done: string];
/** [title, url, specific things to notice] */
export type CaseStudy = [title: string, url: string, notice: string[]];

export type Step = {
  title: string;
  kind: Kind;
  diff: Difficulty;
  explain: string;
  wiki?: string;
  problems: Exercise[];
  caseStudy?: CaseStudy;
};

export type Sub = { name: string; elective?: boolean; links: Link[]; steps: Step[] };
export type Field = { id: string; name: string; row: number; deps: string[]; project: string; subs: Sub[] };

export const step = (
  title: string, kind: Kind, diff: Difficulty, explain: string, wiki: string | undefined,
  problems: Exercise[], caseStudy?: CaseStudy,
): Step => ({ title, kind, diff, explain, wiki, problems, caseStudy });

export const sub = (name: string, links: Link[], steps: Step[], elective = false): Sub => ({ name, links, steps, elective });

export const W = (slug: string) => "https://en.wikipedia.org/wiki/" + slug;
export const YT = "https://www.youtube.com/playlist?list=";
