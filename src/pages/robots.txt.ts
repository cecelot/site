import type { APIRoute } from "astro";
import type { RobotsTxtRules } from "../types";

const rules: RobotsTxtRules = {
  largeLanguageModels: {
    reasoning:
      `sydneyn.dev does not permit, without express permission by me, usage incl. 
      but not limited to: for large language models (LLMs), machine learning,
      and/or artificial intelligence-related purposes.`.trim(),
    bots: [
      "GPTBot",
      "cohere-ai",
      "Google-Extended",
      "ClaudeBot",
      "Claude-Web",
      "anthropic-ai",
      "Bytespider",
      "CCBot",
    ],
  },
};

const robotsTxt = `
${Object.keys(rules)
  .map((key) => {
    const { reasoning, bots } = rules[key];
    const comment = reasoning
      .split("\n")
      .map((line) => `# ${line.trim()}`)
      .join("\n");
    const disallow = bots
      .map((bot) => `User-agent: ${bot}\nDisallow: /`)
      .join("\n\n");
    return `${comment}\n\n${disallow}`;
  })
  .join("\n\n")}

# https://developers.cloudflare.com/fundamentals/reference/cdn-cgi-endpoint/#disallow-using-robotstxt
Disallow: /cdn-cgi/

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
