import { useEffect, useState } from "react";
import Fuse from "fuse.js";

interface TagListProps {
  tagNames: string[];
  tags: Record<string, number>;
}

export default function TagList({ tagNames, tags }: TagListProps) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>(tagNames);

  useEffect(() => {
    if (query) {
      const fuse = new Fuse(
        tagNames.map((tag) => ({ tag })),
        {
          keys: ["tag"],
        }
      );
      const results = fuse.search(query);
      setFiltered(results.map((result) => result.item.tag));
    } else {
      setFiltered(tagNames);
    }
  }, [query]);

  return (
    <div className="flex flex-col space-y-3">
      <input
        name="tag-search"
        placeholder="Search..."
        className="border-4 rounded-lg p-2 bg-mantle border-mantle placeholder:text-subtext0 text-subtext0"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div />
      {filtered.length === 0 && <p>{"No tags matched that query :("}</p>}
      {filtered
        .sort((a, b) => a.localeCompare(b))
        .map((tag) => (
          <div className="flex flex-row space-x-3" key={tag}>
            <a href={`/tags/${tag}`}>#{tag}</a>
            <span className="text-subtext1">·</span>
            <span className="text-subtext1">
              {tags[tag]} post{tags[tag] > 1 ? "s" : ""}
            </span>
          </div>
        ))}
    </div>
  );
}
