import { describe, expect, it } from "vitest";
import type { Bar, Neighborhood } from "@/lib/types";
import { computeStats } from "./stats";

const MARINA: Neighborhood = { id: 17, name: "Marina" };
const MISSION: Neighborhood = { id: 18, name: "Mission" };
const NORTH_BEACH: Neighborhood = { id: 22, name: "North Beach" };
const RUSSIAN_HILL: Neighborhood = { id: 28, name: "Russian Hill" };

let nextId = 1;
function bar(
  neighborhood: Neighborhood,
  overrides: Partial<Bar>,
): Bar & { neighborhood: Neighborhood } {
  return {
    id: nextId++,
    user_id: "user-a",
    neighborhood_id: neighborhood.id,
    neighborhood,
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

const wantToTry = (neighborhood: Neighborhood) =>
  bar(neighborhood, { visit_status: "want_to_try", rating: null, would_return: null });

describe("computeStats", () => {
  // PLAN.md section 4, test 2.
  it("averages 4, 4, 5, 3, 5 to 4.2 and leaves the want-to-try bar out", () => {
    const bars = [
      bar(RUSSIAN_HILL, { rating: 4 }),
      bar(MISSION, { rating: 4 }),
      bar(MARINA, { rating: 5 }),
      bar(NORTH_BEACH, { rating: 3 }),
      bar(MARINA, { rating: 5 }),
      wantToTry(MISSION),
    ];

    const stats = computeStats(bars);

    expect(stats.averageRating).toBe(4.2);
    expect(stats.totalBars).toBe(6);
    expect(stats.visitedBars).toBe(5);
  });

  it("counts bars per neighborhood, most first, ties A–Z", () => {
    const stats = computeStats([
      bar(MISSION, {}),
      bar(MARINA, {}),
      bar(MARINA, {}),
      wantToTry(NORTH_BEACH),
    ]);
    expect(stats.perNeighborhood).toEqual([
      { name: "Marina", count: 2 },
      { name: "Mission", count: 1 },
      { name: "North Beach", count: 1 },
    ]);
  });

  it("works out the percent you'd go back to, from visited bars only", () => {
    const stats = computeStats([
      bar(MARINA, { would_return: true }),
      bar(MARINA, { would_return: true }),
      bar(MARINA, { would_return: false }),
      wantToTry(MARINA),
    ]);
    expect(stats.returnPercent).toBe(67);
  });

  it("shows no average or percent when nothing has been visited", () => {
    const stats = computeStats([wantToTry(MARINA)]);
    expect(stats.averageRating).toBeNull();
    expect(stats.returnPercent).toBeNull();
    expect(stats.totalBars).toBe(1);
  });

  it("handles an empty journal", () => {
    expect(computeStats([])).toEqual({
      totalBars: 0,
      visitedBars: 0,
      averageRating: null,
      returnPercent: null,
      perNeighborhood: [],
    });
  });
});
