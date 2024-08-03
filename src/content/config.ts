import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean(),
  }),
});

const projectsCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string(),
    post: z.string(),
    homepage: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
