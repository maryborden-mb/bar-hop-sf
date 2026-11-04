import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars } from "@/lib/bars";
import { BarList } from "@/app/bars/bar-list";

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
        <JournalBars />
      </Suspense>
    </main>
  );
}

async function JournalBars() {
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

  return <BarList bars={bars} />;
}
