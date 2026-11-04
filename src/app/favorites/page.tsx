import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listStarredBars } from "@/lib/bars";
import { BarList } from "@/app/bars/bar-list";

export const metadata: Metadata = { title: "Favorites · Bar Hop SF" };

export default function FavoritesPage() {
  return (
    <main className="page">
      <h1>Favorites</h1>
      <p className="muted">Your starred go-to bars.</p>
      <Suspense fallback={<p className="muted">Loading your favorites…</p>}>
        <FavoriteBars />
      </Suspense>
    </main>
  );
}

async function FavoriteBars() {
  const bars = await listStarredBars();

  if (bars.length === 0) {
    return (
      <div className="card empty">
        <p>No favorites yet.</p>
        <p>
          Tap the ☆ next to a bar in <Link href="/journal">your journal</Link>{" "}
          to add it here.
        </p>
      </div>
    );
  }

  return <BarList bars={bars} />;
}
