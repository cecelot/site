import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const blog = (await getCollection("blog")).filter((post) => !post.data.draft);
  return new Response(JSON.stringify(blog), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
