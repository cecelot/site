import { z, defineCollection } from "astro:content";

const nodeCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    collection: z.string(),
    pubDate: z.string(),
    tags: z.optional(z.array(z.string())),
    featured: z.optional(z.boolean()),
    draft: z.optional(z.boolean()),
  }),
});

const projectsCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    homepage: z.optional(z.string()),
    post: z.optional(z.string()),
    repo: z.optional(z.string()),
    position: z.number(),
  }),
});

const miscCollection = defineCollection({
  type: "content",
});

export const collections = {
  nodes: nodeCollection,
  projects: projectsCollection,
  misc: miscCollection,
};
