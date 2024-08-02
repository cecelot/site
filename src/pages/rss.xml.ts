import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const blog = await getCollection("blog");
  return rss({
    title: "sydneyn.dev",
    description:
      "In my corner of the internet, I write about my projects and experiences in tech and elsewhere.",
    site: context.site,
    items: blog.map(
      (post) =>
        ({
          title: post.data.title,
          author: post.data.author,
          pubDate: new Date(post.data.pubDate),
          description: post.data.description,
          categories: post.data.tags,
          link: `/p/${post.slug}`,
        } satisfies RSSFeedItem)
    ),
    customData: `<language>en-us</language>`,
    trailingSlash: false,
  });
}
