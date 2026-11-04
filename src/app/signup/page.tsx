import type { Metadata } from "next";
import { AuthForm } from "@/app/auth/auth-form";
import { signUp } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Sign up · Bar Hop SF" };

export default function SignupPage() {
  return (
    <main className="page narrow">
      <h1>Create your account</h1>
      <p className="muted">Your bar journal is private to you.</p>
      <AuthForm mode="signup" action={signUp} />
    </main>
  );
}
