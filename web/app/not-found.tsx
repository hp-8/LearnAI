import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main style={{ maxWidth: 560, margin: "15vh auto", padding: "0 16px" }}>
      <h1>Page not found</h1>
      <p>This page doesn&apos;t exist. <a href="/">Back to the LearnAI roadmap</a>.</p>
    </main>
  );
}
