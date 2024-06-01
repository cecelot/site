export interface Props {
  frontmatter: Frontmatter;
}

export interface Frontmatter {
  title: string;
  pubDate: string;
  description: string;
  author: string;
  tags: string[];
  readingTime: number;
  featured: boolean;
}
