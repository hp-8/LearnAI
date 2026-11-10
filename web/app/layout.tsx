import type { Metadata } from "next";
import Script from "next/script";
import { Atkinson_Hyperlegible, Kalam } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE, GA_ID, CLARITY_ID } from "./site";
import "./globals.css";

const body = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });
const hand = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-hand" });

const description =
  "Free AI roadmap to learn AI from scratch: math, machine learning, deep learning, NLP, agents. Solve hands-on problems and ship a project per topic.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Free AI Roadmap: Learn AI From Scratch | LearnAI", template: "%s | LearnAI" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "LearnAI", url: "/", title: "LearnAI: Learn AI From Scratch", description },
  twitter: { card: "summary_large_image", title: "LearnAI: Learn AI From Scratch", description },
  verification: { google: process.env.NEXT_PUBLIC_GSC_TOKEN ?? "vEFqzcjXGmJZVqRD9RlkauTQ65YSH96JvpeH9AckYc8" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "LearnAI", url: SITE },
    {
      "@type": "Course",
      name: "LearnAI: Learn AI From Scratch",
      description,
      url: SITE,
      isAccessibleForFree: true,
      provider: { "@type": "Person", name: "Harsh Patadia", sameAs: ["https://github.com/hp-8"] },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT200H" },
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${hand.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <SpeedInsights />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      </body>
    </html>
  );
}
