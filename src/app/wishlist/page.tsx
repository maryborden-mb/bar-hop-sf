import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars } from "@/lib/bars";
import { BarList } from "@/app/bars/bar-list";

export const metadata: Metadata = { title: "Wishlist · Bar Hop SF" };

export default function WishlistPage() {
  return (
    <main className="page">
      <div className="page-heading">
        <h1>Wishlist</h1>
        <Link href="/bars/new?status=want_to_try" className="button">
          Add a bar to try
        </Link>
      </div>
      <p className="muted">
        Bars you haven&apos;t been to yet. Open one and mark it visited once
        you&apos;ve gone.
      </p>
      <Suspense fallback={<p className="muted">Loading your wishlist…</p>}>
        <WishlistBars />
      </Suspense>
    </main>
  );
}

async function WishlistBars() {
  const bars = await listBars("want_to_try");

  if (bars.length === 0) {
    return (
      <div className="card empty">
        <p>Nothing on your wishlist yet.</p>
        <p>
          Heard about a good spot?{" "}
          <Link href="/bars/new?status=want_to_try">Save it here</Link> so you
          don&apos;t forget.
        </p>
      </div>
    );
  }

  return <BarList bars={bars} />;
}
