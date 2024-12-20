import { remarkReadingTime } from "./src/readingTime";
import { baseUrl } from "./data/config.json";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: baseUrl,
  integrations: [tailwind(), sitemap(), react(), icon(), mdx()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
    syntaxHighlight: "shiki",
    remarkRehype: {
      footnoteBackContent: "^",
    },
    remarkPlugins: [
      remarkMath,
      [
        remarkToc,
        {
          ordered: true,
        },
      ],
      remarkReadingTime,
    ],
    rehypePlugins: [rehypeKatex],
  },
});
