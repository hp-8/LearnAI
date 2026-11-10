import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What LearnAI collects: anonymous usage analytics via Google Analytics and Microsoft Clarity, hosting by Vercel. Your progress stays in your browser.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <main style={{ maxWidth: 680, margin: "8vh auto", padding: "0 16px", lineHeight: 1.6 }}>
      <h1>Privacy</h1>
      <p>LearnAI has no accounts. Your progress and notes are saved only in your own browser (localStorage) and never sent to us.</p>
      <h2>Analytics</h2>
      <p>
        We use <strong>Google Analytics 4</strong> to count visits, traffic sources and which steps people complete, and{" "}
        <strong>Microsoft Clarity</strong> for heatmaps and anonymized session recordings. We use this only to improve the site.
        Both set cookies and process data such as your IP address, device and pages viewed.
      </p>
      <h2>Hosting</h2>
      <p><strong>Vercel</strong> hosts the site and measures page speed (Speed Insights) without cookies.</p>
      <h2>Your choices</h2>
      <p>
        Block analytics with any tracker blocker or the{" "}
        <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out</a>. If you are in the EU or UK you can ask
        about or delete data held by these providers through their own privacy pages.
      </p>
      <p><a href="/">Back to LearnAI</a></p>
    </main>
  );
}
