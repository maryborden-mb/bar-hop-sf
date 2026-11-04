import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { listNeighborhoods } from "@/lib/bars";
import { createBar } from "@/app/bars/actions";
import { BarForm } from "@/app/bars/bar-form";
import { EMPTY_BAR_FORM } from "@/app/bars/form-values";

export const metadata: Metadata = { title: "Add bar · Bar Hop SF" };

export default function NewBarPage({ searchParams }: PageProps<"/bars/new">) {
  return (
    <main className="page narrow-form">
      <h1>Add a bar</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        {searchParams.then(({ status }) => (
          <NewBarForm status={status} />
        ))}
      </Suspense>
    </main>
  );
}

// `status` comes from the link that opened this page: the Wishlist starts
// the form as "Want to try", the Journal as "Visited".
async function NewBarForm({ status }: { status?: string | string[] }) {
  await requireUser();
  const neighborhoods = await listNeighborhoods();
  const visitStatus =
    status === "visited" || status === "want_to_try" ? status : "";

  return (
    <BarForm
      action={createBar}
      neighborhoods={neighborhoods}
      initialValues={{ ...EMPTY_BAR_FORM, visit_status: visitStatus }}
      submitLabel="Save bar"
      cancelHref={visitStatus === "want_to_try" ? "/wishlist" : "/journal"}
    />
  );
}
