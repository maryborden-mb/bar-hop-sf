import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars } from "@/lib/bars";
import type { Neighborhood } from "@/lib/types";
import { BarList } from "@/app/bars/bar-list";
import { applyFilters, parseFilters } from "./filters";
import { JournalFilterBar } from "./journal-filters";

export const metadata: Metadata = { title: "Journal · Bar Hop SF" };

export default function JournalPage({ searchParams }: PageProps<"/journal">) {
  return (
    <main className="page">
      <div className="page-heading">
        <h1>My journal</h1>
        <Link href="/bars/new?status=visited" className="button">
          Add bar
        </Link>
      </div>
      <Suspense fallback={<p className="muted">Loading your journal…</p>}>
        {searchParams.then((params) => (
          <JournalBars params={params} />
        ))}
      </Suspense>
    </main>
  );
}

async function JournalBars({
  params,
}: {
  params: Awaited<PageProps<"/journal">["searchParams"]>;
}) {
  // The Journal is the bars you've been to; want-to-try bars live on the
  // Wishlist until you mark them visited.
  const bars = await listBars("visited");

  if (bars.length === 0) {
    return (
      <div className="card empty">
        <p>No visited bars yet.</p>
        <p>
          <Link href="/bars/new?status=visited">Add a bar you&apos;ve been to</Link>
          , or check your <Link href="/wishlist">wishlist</Link>.
        </p>
      </div>
    );
  }

  const filters = parseFilters(params);
  const matches = applyFilters(bars, filters);

  // Only offer neighborhoods you have bars in.
  const neighborhoods = [
    ...new Map(bars.map((b) => [b.neighborhood.id, b.neighborhood])).values(),
  ].sort((a: Neighborhood, b: Neighborhood) => a.name.localeCompare(b.name));

  return (
    <>
      <JournalFilterBar filters={filters} neighborhoods={neighborhoods} />
      <p className="muted result-count" aria-live="polite">
        {matches.length === bars.length
          ? `${bars.length} ${bars.length === 1 ? "bar" : "bars"}`
          : `Showing ${matches.length} of ${bars.length} bars`}
      </p>
      {matches.length > 0 ? (
        <BarList bars={matches} />
      ) : (
        <div className="card empty">
          <p>No bars match that search.</p>
          <p>
            <Link href="/journal">Show all bars</Link>
          </p>
        </div>
      )}
    </>
  );
}
