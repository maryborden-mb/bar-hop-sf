import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/app/auth/auth-form";
import { logIn } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Log in · Bar Hop SF" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="page narrow">
      <h1>Log in</h1>
      <Suspense>
        <ConfirmFailedNotice searchParams={searchParams} />
      </Suspense>
      <AuthForm mode="login" action={logIn} />
    </main>
  );
}

// Shown when an email confirmation link has expired or was already used.
async function ConfirmFailedNotice({
  searchParams,
}: Pick<PageProps<"/login">, "searchParams">) {
  const { confirm } = await searchParams;
  if (confirm !== "failed") {
    return null;
  }
  return (
    <p className="error" role="alert">
      That confirmation link didn&apos;t work. It may have expired. Try logging
      in, or sign up again for a new link.
    </p>
  );
}
