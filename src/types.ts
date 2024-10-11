export interface RobotsTxtRules {
  [key: string]: Rule;
}

export interface Rule {
  reasoning: string;
  bots: string[];
}

export interface Props {
  frontmatter: Frontmatter;
}

export interface Frontmatter {
  title: string;
  pubDate: string;
  description: string;
  author: string;
  tags: string[];
  minutesRead: string;
  featured: boolean;
  draft: boolean;
}

export interface Transform {
  width: number;
  height: number;
  quality: 50 | 75 | 100;
  format?: "auto" | "jpeg";
}
