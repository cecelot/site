import rss, { type RSSFeedItem } from "@astrojs/rss";
import { domain } from "../../data/config.json";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const blog = (await getCollection("blog")).filter((post) => !post.data.draft);
  return rss({
    title: domain,
    description:
      "In my corner of the internet, I write about my projects and experiences in tech and elsewhere.",
    site: context.site,
    items: blog.map(
      (post: any) =>
        ({
          title: post.data.title,
          author: post.data.author,
          pubDate: new Date(post.data.pubDate),
          description: post.data.description,
          categories: post.data.tags,
          link: `/p/${post.slug}`,
        }) satisfies RSSFeedItem
    ),
    customData: `<language>en-us</language>`,
    trailingSlash: false,
  });
}
