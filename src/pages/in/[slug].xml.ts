import { domain, collections } from "../../../data/config.json";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection } from "astro:content";

export const getStaticPaths = async () => {
  return Object.keys(collections).map((slug) => ({
    params: { slug },
  }));
};

export async function GET(context: any) {
  const { slug } = context.params as { slug: "blog" | "notes" | "drafts" };
  const items = (await getCollection("nodes")).filter(
    (item) => item.data.collection === slug
  );
  return rss({
    title: domain,
    description: collections[slug],
    site: context.site,
    items: items.map(
      (item: any) =>
        ({
          title: item.data.title,
          author: item.data.author,
          pubDate: new Date(item.data.pubDate),
          description: item.data.description,
          categories: item.data.tags,
          link: `/node/${item.slug}`,
        }) satisfies RSSFeedItem
    ),
    customData: `<language>en-us</language>`,
    trailingSlash: false,
  });
}
