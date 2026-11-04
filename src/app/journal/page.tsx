import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Journal · Bar Hop SF" };

export default function JournalPage() {
  return (
    <main className="page">
      <h1>My journal</h1>
      <Suspense fallback={<p className="muted">Loading your journal…</p>}>
        <JournalContent />
      </Suspense>
    </main>
  );
}

async function JournalContent() {
  // The proxy already redirects logged-out visitors; this double-checks on
  // the server before showing anything private.
  const user = await requireUser();
  return (
    <>
      <p className="muted">Logged in as {user.email}</p>
      <div className="card empty">
        <p>No bars yet. Adding bars comes in a later feature.</p>
      </div>
    </>
  );
}
