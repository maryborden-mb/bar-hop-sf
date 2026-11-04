import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { listNeighborhoods } from "@/lib/bars";
import { createBar } from "@/app/bars/actions";
import { BarForm } from "@/app/bars/bar-form";
import { EMPTY_BAR_FORM } from "@/app/bars/form-values";

export const metadata: Metadata = { title: "Add bar · Bar Hop SF" };

export default function NewBarPage() {
  return (
    <main className="page narrow-form">
      <h1>Add a bar</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <NewBarForm />
      </Suspense>
    </main>
  );
}

async function NewBarForm() {
  await requireUser();
  const neighborhoods = await listNeighborhoods();
  return (
    <BarForm
      action={createBar}
      neighborhoods={neighborhoods}
      initialValues={EMPTY_BAR_FORM}
      submitLabel="Save bar"
      cancelHref="/journal"
    />
  );
}
