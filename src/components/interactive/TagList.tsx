import { useEffect, useState } from "react";
import Fuse from "fuse.js";

interface TagListProps {
  tagNames: string[];
  tags: Record<string, number>;
}

export default function TagList({ tagNames }: TagListProps) {
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
    <section className="flex flex-col space-y-3">
      <input
        name="tag-filter"
        placeholder="Filter..."
        className="rounded-lg p-3 bg-mantle placeholder:text-subtext0 text-subtext0"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div />
      {filtered.length === 0 && <p>{"No tags matched that query :("}</p>}
      <ul className="my-5 flex flex-wrap gap-y-5">
        {filtered
          .sort((a, b) => a.localeCompare(b))
          .map((tag) => (
            <li key={tag}>
              <span>
                <a
                  className="ignored-link bg-mantle p-2 mr-2 mx-auto rounded-lg hover:bg-crust transition-all"
                  href={`/tags/${tag}`}
                >
                  #{tag}
                </a>
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
}
