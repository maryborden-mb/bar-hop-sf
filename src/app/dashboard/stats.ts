import type { Bar, Neighborhood } from "@/lib/types";

export type NeighborhoodCount = { name: string; count: number };

export type DashboardStats = {
  totalBars: number;
  visitedBars: number;
  // Average of visited bars' ratings, to one decimal. Null if none are rated.
  averageRating: number | null;
  // Percent of visited bars you'd go back to, rounded. Null if none answered.
  returnPercent: number | null;
  // Bars per neighborhood, most first (ties A–Z).
  perNeighborhood: NeighborhoodCount[];
};

export function computeStats(
  bars: (Bar & { neighborhood: Neighborhood })[],
): DashboardStats {
  // Want-to-try bars have no rating or would-return answer, so they're left
  // out of those numbers.
  const visited = bars.filter((b) => b.visit_status === "visited");

  const ratings = visited
    .map((b) => b.rating)
    .filter((r): r is number => r !== null);
  const averageRating = ratings.length
    ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
    : null;

  const answered = visited.filter((b) => b.would_return !== null);
  const returnPercent = answered.length
    ? Math.round((answered.filter((b) => b.would_return).length / answered.length) * 100)
    : null;

  const counts = new Map<string, number>();
  for (const bar of bars) {
    counts.set(bar.neighborhood.name, (counts.get(bar.neighborhood.name) ?? 0) + 1);
  }
  const perNeighborhood = [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    totalBars: bars.length,
    visitedBars: visited.length,
    averageRating,
    returnPercent,
    perNeighborhood,
  };
}
