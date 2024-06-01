import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import { remarkReadingTime } from "./src/readingTime";

// https://astro.build/config
export default defineConfig({
  site: "https://alainacn.dev",
  integrations: [tailwind(), sitemap()],
  markdown: {
    remarkRehype: {
      footnoteBackContent: "^",
    },
    remarkPlugins: [remarkToc, remarkReadingTime],
  },
});
