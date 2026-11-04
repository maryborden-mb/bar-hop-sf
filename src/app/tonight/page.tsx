import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars } from "@/lib/bars";
import { BarPicker } from "./bar-picker";
import { MIN_RATING, eligibleBars } from "./pick";

export const metadata: Metadata = { title: "Pick a bar · Bar Hop SF" };

export default function TonightPage() {
  return (
    <main className="page narrow-form">
      <h1>Pick a bar for tonight</h1>
      <p className="muted">
        Can&apos;t decide? Let us pick one of your favorites, rated{" "}
        {MIN_RATING}★ or more.
      </p>
      <Suspense fallback={<p className="muted">Loading your bars…</p>}>
        <Picker />
      </Suspense>
    </main>
  );
}

async function Picker() {
  const bars = eligibleBars(await listBars("visited"), null);

  if (bars.length === 0) {
    return (
      <div className="card empty">
        <p>No bars rated {MIN_RATING}★ or more yet.</p>
        <p>
          Rate the bars you&apos;ve been to in{" "}
          <Link href="/journal">your journal</Link>, and your top spots will show
          up here.
        </p>
      </div>
    );
  }

  return <BarPicker bars={bars} />;
}
