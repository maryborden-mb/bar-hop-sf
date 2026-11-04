import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars, listNeighborhoods } from "@/lib/bars";
import { SfMap } from "./sf-map";

export const metadata: Metadata = { title: "Map · Bar Hop SF" };

export default function MapPage() {
  return (
    <main className="page wide">
      <h1>Map</h1>
      <p className="muted">
        Tap a neighborhood to see your bars there. Gold circles show how many
        you&apos;ve been to.
      </p>
      <Suspense fallback={<p className="muted">Loading the map…</p>}>
        <NeighborhoodMap />
      </Suspense>
    </main>
  );
}

async function NeighborhoodMap() {
  const [neighborhoods, bars] = await Promise.all([
    listNeighborhoods(),
    listBars("visited"),
  ]);

  // Journal bars per neighborhood.
  const counts = new Map<number, number>();
  for (const bar of bars) {
    counts.set(bar.neighborhood_id, (counts.get(bar.neighborhood_id) ?? 0) + 1);
  }
  const withBars = neighborhoods.filter((n) => counts.has(n.id));

  return (
    <div className="stack">
      <SfMap neighborhoods={neighborhoods} counts={counts} />

      <details className="table-view">
        <summary>Show as a list</summary>
        {withBars.length === 0 ? (
          <p className="muted">No bars in your journal yet.</p>
        ) : (
          <ul className="map-list">
            {withBars.map((n) => (
              <li key={n.id}>
                <Link href={`/journal?neighborhood=${n.id}`}>{n.name}</Link>
                <span className="muted">
                  {counts.get(n.id)} {counts.get(n.id) === 1 ? "bar" : "bars"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
}
