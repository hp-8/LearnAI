export const SITE = "https://learnai-hp.vercel.app";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-D5QHK19B3F";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "zbakp0b9ew";

type Gtag = (cmd: "event", name: string, params?: Record<string, unknown>) => void;

// No-op until GA has loaded.
export function track(name: string, params?: Record<string, unknown>) {
  (globalThis as { gtag?: Gtag }).gtag?.("event", name, params);
}
