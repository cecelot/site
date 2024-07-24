import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "./src/readingTime";

// https://astro.build/config
export default defineConfig({
  site: "https://sydneyn.dev",
  integrations: [tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-macchiato",
      },
    },
    syntaxHighlight: "shiki",
    remarkRehype: {
      footnoteBackContent: "^",
    },
    remarkPlugins: [[remarkToc, { ordered: true }], remarkReadingTime],
  },
});
