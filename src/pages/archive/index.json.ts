import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const blog = await getCollection("blog");
  return new Response(JSON.stringify(blog), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
