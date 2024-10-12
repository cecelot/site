import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

export default async function mdToHtml(input: string) {
  const processor = unified().use(remarkParse).use(remarkHtml);
  return processor.process(input);
}
