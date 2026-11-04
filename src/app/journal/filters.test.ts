import { describe, expect, it } from "vitest";
import type { Bar } from "@/lib/types";
import {
  DEFAULT_FILTERS,
  applyFilters,
  filtersToQuery,
  parseFilters,
} from "./filters";

const MARINA = 17;
const MISSION = 18;

function bar(overrides: Partial<Bar>): Bar {
  return {
    id: 1,
    user_id: "user-a",
    neighborhood_id: MARINA,
    name: "Bar",
    type: "Sports",
    visit_status: "visited",
    rating: 3,
    would_return: true,
    has_outdoor_seating: false,
    vibe: null,
    good_for: [],
    notes: null,
    created_at: "2026-11-01T00:00:00Z",
    ...overrides,
  };
}

const bars: Bar[] = [
  bar({ id: 1, name: "Greens", rating: 4, notes: "Pool table", created_at: "2026-11-01T00:00:00Z" }),
  bar({ id: 2, name: "Zeitgeist", neighborhood_id: MISSION, type: "Dive", rating: 4, notes: "Good for big groups", created_at: "2026-11-02T00:00:00Z" }),
  bar({ id: 3, name: "Howell's", type: "Wine", rating: 5, notes: "Parklet in the sun", created_at: "2026-11-03T00:00:00Z" }),
  bar({ id: 4, name: "boardroom", rating: 3, created_at: "2026-11-04T00:00:00Z" }),
  bar({ id: 5, name: "Zam Zam", neighborhood_id: MISSION, type: "Cocktail", visit_status: "want_to_try", rating: null, would_return: null, created_at: "2026-11-05T00:00:00Z" }),
];

const ids = (list: Bar[]) => list.map((b) => b.id);

describe("applyFilters", () => {
  it("shows every bar, newest first, by default", () => {
    expect(ids(applyFilters(bars, DEFAULT_FILTERS))).toEqual([5, 4, 3, 2, 1]);
  });

  it("searches names, ignoring capital letters", () => {
    expect(ids(applyFilters(bars, { ...DEFAULT_FILTERS, q: "ZEIT" }))).toEqual([2]);
  });

  it("searches notes too", () => {
    expect(ids(applyFilters(bars, { ...DEFAULT_FILTERS, q: "parklet" }))).toEqual([3]);
  });

  it("filters by neighborhood", () => {
    expect(ids(applyFilters(bars, { ...DEFAULT_FILTERS, neighborhood: MISSION }))).toEqual([5, 2]);
  });

  it("filters by type", () => {
    expect(ids(applyFilters(bars, { ...DEFAULT_FILTERS, type: "Sports" }))).toEqual([4, 1]);
  });

  it("combines search and filters", () => {
    const filters = { ...DEFAULT_FILTERS, q: "z", neighborhood: MISSION, type: "Dive" as const };
    expect(ids(applyFilters(bars, filters))).toEqual([2]);
  });

  it("sorts by highest rating, with ties A–Z and unrated bars last", () => {
    expect(ids(applyFilters(bars, { ...DEFAULT_FILTERS, sort: "rating" }))).toEqual([3, 1, 2, 4, 5]);
  });

  it("sorts A–Z, ignoring capital letters", () => {
    expect(applyFilters(bars, { ...DEFAULT_FILTERS, sort: "name" }).map((b) => b.name)).toEqual([
      "boardroom",
      "Greens",
      "Howell's",
      "Zam Zam",
      "Zeitgeist",
    ]);
  });

  it("doesn't change the original list", () => {
    const before = ids(bars);
    applyFilters(bars, { ...DEFAULT_FILTERS, sort: "name" });
    expect(ids(bars)).toEqual(before);
  });
});

describe("parseFilters", () => {
  it("reads filters from the URL", () => {
    expect(parseFilters({ q: " pool ", neighborhood: "17", type: "Dive", sort: "rating" })).toEqual({
      q: "pool",
      neighborhood: 17,
      type: "Dive",
      sort: "rating",
    });
  });

  it("falls back to defaults for missing or made-up values", () => {
    expect(parseFilters({ neighborhood: "abc", type: "Karaoke", sort: "random" })).toEqual(DEFAULT_FILTERS);
  });

  it("round-trips through the URL", () => {
    const filters = { q: "sun", neighborhood: 17, type: "Wine" as const, sort: "name" as const };
    expect(parseFilters(Object.fromEntries(new URLSearchParams(filtersToQuery(filters))))).toEqual(filters);
  });

  it("leaves defaults out of the URL", () => {
    expect(filtersToQuery(DEFAULT_FILTERS)).toBe("");
  });
});
