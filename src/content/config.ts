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

const datedItemCollection = defineCollection({
  type: "data",
  schema: z.object({
    position: z.number(),
    title: z.string(),
    location: z.optional(z.string()),
    date: z.optional(
      z.object({
        range: z.string(),
        additionalInfo: z.optional(z.array(z.string())),
      })
    ),
    items: z.optional(
      z.object({
        general: z.optional(z.array(z.string())),
        bulleted: z.optional(z.array(z.string())),
      })
    ),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
  // resumé
  education: datedItemCollection,
  resumeProjects: datedItemCollection,
  extracurriculars: datedItemCollection,
};
