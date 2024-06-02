import type { APIRoute } from "astro";
import type { RobotsTxtRules } from "../types";

const rules: RobotsTxtRules = {
  largeLanguageModels: {
    reasoning:
      `alainacn.dev does not permit usage incl. but not limited to: for large language
      models (LLMs), machine learning and/or artificial intelligence-related purposes;
      and/or with any of the aforementioned technologies.`.trim(),
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
  turnitin: {
    reasoning:
      `Turnitin is plagirism detection software that works by indexing content
      without my consent and without providing any value to me.`.trim(),
    bots: ["TurnitinBot", "Turnitin"],
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

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
