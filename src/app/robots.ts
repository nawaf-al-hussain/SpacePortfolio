import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data";

/**
 * Open the site to everyone, and explicitly welcome the major AI answer-engine
 * crawlers — being cited in ChatGPT / Claude / Perplexity / Google AI answers
 * (AEO / AI-SEO) means letting their bots read the content.
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bingbot",
    "DuckDuckBot",
    "Amazonbot",
    "Bytespider",
    "cohere-ai",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
