import type { Bar } from "@/lib/types";

export const MIN_RATING = 4;

// Bars that can be picked: ones you've been to and rated 4 or more, in the
// chosen neighborhood if there is one.
export function eligibleBars<T extends Bar>(
  bars: T[],
  neighborhoodId: number | null,
): T[] {
  return bars.filter(
    (bar) =>
      bar.visit_status === "visited" &&
      (bar.rating ?? 0) >= MIN_RATING &&
      (!neighborhoodId || bar.neighborhood_id === neighborhoodId),
  );
}

// Picks one bar at random, or null if there are none. When picking again,
// pass the last pick so a different bar comes up (if there is one).
export function pickBar<T extends Bar>(
  candidates: T[],
  lastPickId: number | null = null,
  random: () => number = Math.random,
): T | null {
  const fresh =
    candidates.length > 1
      ? candidates.filter((bar) => bar.id !== lastPickId)
      : candidates;
  if (fresh.length === 0) return null;
  return fresh[Math.floor(random() * fresh.length)];
}
