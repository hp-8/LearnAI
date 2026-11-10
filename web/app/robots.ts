import type { MetadataRoute } from "next";
import { SITE } from "./site";

const ai = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...ai.map(userAgent => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
