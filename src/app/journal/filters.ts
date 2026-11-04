import {
  BAR_TYPES,
  GOOD_FOR_TAGS,
  type Bar,
  type BarType,
  type GoodForTag,
} from "@/lib/types";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest rated" },
  { value: "name", label: "A–Z" },
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export type JournalFilters = {
  q: string; // search text for name or notes
  neighborhood: number | null; // neighborhood id
  type: BarType | null;
  tags: GoodForTag[]; // a bar must have every one of these
  sort: SortOption;
};

export const DEFAULT_FILTERS: JournalFilters = {
  q: "",
  neighborhood: null,
  type: null,
  tags: [],
  sort: "newest",
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

// Reads filters from the URL (?q=…&neighborhood=…&type=…&tags=…&sort=…).
// Anything missing or unrecognized falls back to the default.
export function parseFilters(params: SearchParams): JournalFilters {
  const neighborhood = Number(first(params.neighborhood));
  const type = first(params.type);
  const tags = first(params.tags).split(",");
  const sort = first(params.sort);
  return {
    q: first(params.q),
    neighborhood: Number.isInteger(neighborhood) && neighborhood > 0 ? neighborhood : null,
    type: (BAR_TYPES as readonly string[]).includes(type) ? (type as BarType) : null,
    tags: GOOD_FOR_TAGS.filter((tag) => tags.includes(tag)),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortOption) : "newest",
  };
}

// The URL query string for these filters, leaving out defaults.
export function filtersToQuery(filters: JournalFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.neighborhood) params.set("neighborhood", String(filters.neighborhood));
  if (filters.type) params.set("type", filters.type);
  if (filters.tags.length) params.set("tags", filters.tags.join(","));
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}

export function hasActiveFilters(filters: JournalFilters): boolean {
  return Boolean(
    filters.q || filters.neighborhood || filters.type || filters.tags.length,
  );
}

const byName = (a: Bar, b: Bar) =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" });

const byNewest = (a: Bar, b: Bar) => b.created_at.localeCompare(a.created_at);

// Highest rating first. Bars without a rating (want-to-try) go last.
const byRating = (a: Bar, b: Bar) =>
  (b.rating ?? 0) - (a.rating ?? 0) || byName(a, b);

const SORTERS: Record<SortOption, (a: Bar, b: Bar) => number> = {
  newest: byNewest,
  rating: byRating,
  name: byName,
};

// Returns the bars that match the filters, in the chosen order.
export function applyFilters<T extends Bar>(bars: T[], filters: JournalFilters): T[] {
  const q = filters.q.toLowerCase();
  return bars
    .filter(
      (bar) =>
        (!q ||
          bar.name.toLowerCase().includes(q) ||
          (bar.notes ?? "").toLowerCase().includes(q)) &&
        (!filters.neighborhood || bar.neighborhood_id === filters.neighborhood) &&
        (!filters.type || bar.type === filters.type) &&
        filters.tags.every((tag) => bar.good_for.includes(tag)),
    )
    .sort(SORTERS[filters.sort]);
}
