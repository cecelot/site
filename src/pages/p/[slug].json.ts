import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";

export const getStaticPaths = async () => {
  const blog = await getCollection("blog");
  return blog.map((entry) => ({ params: { slug: entry.slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  //@ts-ignore
  const post = await getEntry("blog", params.slug);
  return new Response(JSON.stringify(post), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
