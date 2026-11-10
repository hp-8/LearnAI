import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Kalam } from "next/font/google";
import "./globals.css";

const body = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });
const hand = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-hand" });

export const metadata: Metadata = {
  title: "LearnAI",
  description: "A notebook star chart of everything in AI: solve problems, light the sky.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
