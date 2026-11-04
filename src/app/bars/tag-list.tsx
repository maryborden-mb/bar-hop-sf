import { GOOD_FOR_LABELS, GOOD_FOR_TAGS, type GoodForTag } from "@/lib/types";

// A bar's "good for" tags as small chips, in the same order everywhere.
export function TagList({ tags }: { tags: GoodForTag[] }) {
  const ordered = GOOD_FOR_TAGS.filter((tag) => tags.includes(tag));
  if (ordered.length === 0) return null;
  return (
    <ul className="tags" aria-label="Good for">
      {ordered.map((tag) => (
        <li key={tag} className="tag">
          {GOOD_FOR_LABELS[tag]}
        </li>
      ))}
    </ul>
  );
}
