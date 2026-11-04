import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars } from "@/lib/bars";
import { Stars } from "@/app/bars/stars";

export const metadata: Metadata = { title: "Journal · Bar Hop SF" };

export default function JournalPage() {
  return (
    <main className="page">
      <div className="page-heading">
        <h1>My journal</h1>
        <Link href="/bars/new" className="button">
          Add bar
        </Link>
      </div>
      <Suspense fallback={<p className="muted">Loading your journal…</p>}>
        <BarList />
      </Suspense>
    </main>
  );
}

async function BarList() {
  const bars = await listBars();

  if (bars.length === 0) {
    return (
      <div className="card empty">
        <p>No bars yet.</p>
        <p>
          <Link href="/bars/new">Add your first bar</Link>
        </p>
      </div>
    );
  }

  return (
    <ul className="bar-list">
      {bars.map((bar) => (
        <li key={bar.id}>
          <Link href={`/bars/${bar.id}`} className="card bar-card">
            <div>
              <h2>{bar.name}</h2>
              <p className="muted">
                {bar.neighborhood.name} · {bar.type}
                {bar.has_outdoor_seating && " · Outdoor seating"}
              </p>
            </div>
            {bar.visit_status === "visited" && bar.rating ? (
              <Stars rating={bar.rating} />
            ) : (
              <span className="badge">Want to try</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
