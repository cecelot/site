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
    homepage: z.optional(z.string()),
    post: z.optional(z.string()),
    repo: z.string(),
    position: z.number(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
