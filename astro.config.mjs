import { remarkReadingTime } from "./src/readingTime";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://sydneyn.dev",
  integrations: [tailwind(), sitemap(), react(), icon()],
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
