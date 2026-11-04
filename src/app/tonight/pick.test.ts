import { describe, expect, it } from "vitest";
import type { Bar } from "@/lib/types";
import { eligibleBars, pickBar } from "./pick";

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
    rating: 4,
    would_return: true,
    has_outdoor_seating: false,
    vibe: null,
    good_for: [],
    notes: null,
    created_at: "2026-11-01T00:00:00Z",
    ...overrides,
  };
}

// My 5 starting bars, plus one I haven't been to yet.
const bars: Bar[] = [
  bar({ id: 1, name: "Greens", neighborhood_id: 28, rating: 4 }),
  bar({ id: 2, name: "Zeitgeist", neighborhood_id: MISSION, rating: 4 }),
  bar({ id: 3, name: "Howell's", rating: 5 }),
  bar({ id: 4, name: "Boardroom", neighborhood_id: 22, rating: 3 }),
  bar({ id: 5, name: "Monaghan's", rating: 5 }),
  bar({ id: 6, name: "Zam Zam", visit_status: "want_to_try", rating: null, would_return: null }),
];

const names = (list: Bar[]) => list.map((b) => b.name);

describe("eligibleBars", () => {
  it("keeps only visited bars rated 4 or more", () => {
    expect(names(eligibleBars(bars, null))).toEqual([
      "Greens",
      "Zeitgeist",
      "Howell's",
      "Monaghan's",
    ]);
  });

  it("narrows to a neighborhood when one is chosen", () => {
    expect(names(eligibleBars(bars, MARINA))).toEqual(["Howell's", "Monaghan's"]);
  });

  it("is empty when nothing in that neighborhood qualifies", () => {
    expect(eligibleBars(bars, 22)).toEqual([]); // only Boardroom, rated 3
  });
});

describe("pickBar", () => {
  const marina = eligibleBars(bars, MARINA);

  it("picks using the random number", () => {
    expect(pickBar(marina, null, () => 0)?.name).toBe("Howell's");
    expect(pickBar(marina, null, () => 0.99)?.name).toBe("Monaghan's");
  });

  it("doesn't repeat the last pick when there's another choice", () => {
    expect(pickBar(marina, 3, () => 0)?.name).toBe("Monaghan's");
    expect(pickBar(marina, 5, () => 0.99)?.name).toBe("Howell's");
  });

  it("can repeat when there's only one choice", () => {
    const onlyOne = eligibleBars(bars, MISSION);
    expect(pickBar(onlyOne, 2)?.name).toBe("Zeitgeist");
  });

  it("returns null when there's nothing to pick", () => {
    expect(pickBar([])).toBeNull();
  });
});
