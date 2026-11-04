"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  BAR_TYPES,
  GOOD_FOR_LABELS,
  GOOD_FOR_TAGS,
  type BarType,
  type GoodForTag,
  type Neighborhood,
} from "@/lib/types";
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  filtersToQuery,
  hasActiveFilters,
  type JournalFilters,
  type SortOption,
} from "./filters";

type Props = {
  filters: JournalFilters;
  neighborhoods: Neighborhood[];
};

// Search box, filters, and sort for the Journal. Choices go into the URL, so
// the page re-renders with matching bars and a refresh keeps them.
export function JournalFilterBar({ filters, neighborhoods }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(filters);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  function apply(next: JournalFilters) {
    setCurrent(next);
    const query = filtersToQuery(next);
    startTransition(() => {
      router.replace(query ? `/journal?${query}` : "/journal", { scroll: false });
    });
  }

  function toggleTag(tag: GoodForTag) {
    const tags = current.tags.includes(tag)
      ? current.tags.filter((t) => t !== tag)
      : GOOD_FOR_TAGS.filter((t) => t === tag || current.tags.includes(t));
    apply({ ...current, tags });
  }

  // Wait until typing pauses before searching.
  function onSearch(q: string) {
    setCurrent((prev) => ({ ...prev, q }));
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => apply({ ...current, q: q.trim() }), 300);
  }

  return (
    <div className="filter-bar" aria-busy={pending}>
      <label className="field search">
        <span className="visually-hidden">Search</span>
        <input
          type="search"
          placeholder="Search names and notes"
          value={current.q}
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>

      <div className="filter-row">
        <label className="field">
          <span>Neighborhood</span>
          <select
            value={current.neighborhood ?? ""}
            onChange={(e) =>
              apply({ ...current, neighborhood: Number(e.target.value) || null })
            }
          >
            <option value="">All</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Type</span>
          <select
            value={current.type ?? ""}
            onChange={(e) =>
              apply({ ...current, type: (e.target.value || null) as BarType | null })
            }
          >
            <option value="">All</option>
            {BAR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sort by</span>
          <select
            value={current.sort}
            onChange={(e) => apply({ ...current, sort: e.target.value as SortOption })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tag-filter" role="group" aria-label="Good for">
        <span className="tag-filter-label">Good for</span>
        {GOOD_FOR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="tag-toggle"
            aria-pressed={current.tags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {GOOD_FOR_LABELS[tag]}
          </button>
        ))}
      </div>

      {hasActiveFilters(current) && (
        <button
          type="button"
          className="link-button"
          onClick={() => apply({ ...DEFAULT_FILTERS, sort: current.sort })}
        >
          Clear search and filters
        </button>
      )}
    </div>
  );
}
