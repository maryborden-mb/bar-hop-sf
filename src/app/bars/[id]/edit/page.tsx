import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBar, listNeighborhoods, parseBarId } from "@/lib/bars";
import { updateBar } from "@/app/bars/actions";
import { BarForm } from "@/app/bars/bar-form";
import { barToFormValues } from "@/app/bars/form-values";

export default function EditBarPage({ params }: PageProps<"/bars/[id]/edit">) {
  return (
    <main className="page narrow-form">
      <h1>Edit bar</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        {params.then(({ id }) => (
          <EditBarForm id={id} />
        ))}
      </Suspense>
    </main>
  );
}

async function EditBarForm({ id }: { id: string }) {
  const barId = parseBarId(id);
  const bar = barId ? await getBar(barId) : null;
  if (!bar) {
    notFound();
  }
  const neighborhoods = await listNeighborhoods();

  return (
    <BarForm
      action={updateBar.bind(null, bar.id)}
      neighborhoods={neighborhoods}
      initialValues={barToFormValues(bar)}
      submitLabel="Save changes"
      cancelHref={`/bars/${bar.id}`}
    />
  );
}
