import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  site: "https://alainacn.dev",
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkToc],
  },
});
