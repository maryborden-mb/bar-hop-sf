import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBar, parseBarId } from "@/lib/bars";
import { DeleteBarButton } from "@/app/bars/delete-bar-button";
import { Stars } from "@/app/bars/stars";

export default function BarPage({ params }: PageProps<"/bars/[id]">) {
  return (
    <main className="page">
      <p>
        <Link href="/journal">← My journal</Link>
      </p>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        {params.then(({ id }) => (
          <BarDetail id={id} />
        ))}
      </Suspense>
    </main>
  );
}

async function BarDetail({ id }: { id: string }) {
  const barId = parseBarId(id);
  const bar = barId ? await getBar(barId) : null;
  if (!bar) {
    notFound();
  }

  const visited = bar.visit_status === "visited";

  return (
    <article className="stack">
      <div>
        <h1>{bar.name}</h1>
        <p className="muted">
          {bar.neighborhood.name} · {bar.type}
        </p>
      </div>

      <dl className="details card">
        <div>
          <dt>Status</dt>
          <dd>{visited ? "Visited" : "Want to try"}</dd>
        </div>
        {visited && bar.rating && (
          <div>
            <dt>Rating</dt>
            <dd>
              <Stars rating={bar.rating} />
            </dd>
          </div>
        )}
        {visited && bar.would_return !== null && (
          <div>
            <dt>Would go back</dt>
            <dd>{bar.would_return ? "Yes" : "No"}</dd>
          </div>
        )}
        <div>
          <dt>Outdoor seating</dt>
          <dd>{bar.has_outdoor_seating ? "Yes" : "No"}</dd>
        </div>
        {bar.vibe && (
          <div>
            <dt>Vibe</dt>
            <dd>{bar.vibe}</dd>
          </div>
        )}
        {bar.notes && (
          <div>
            <dt>Notes</dt>
            <dd className="notes">{bar.notes}</dd>
          </div>
        )}
      </dl>

      <div className="actions">
        <Link href={`/bars/${bar.id}/edit`} className="button">
          Edit
        </Link>
        <DeleteBarButton id={bar.id} name={bar.name} />
      </div>
    </article>
  );
}
