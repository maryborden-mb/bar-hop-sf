import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type User = {
  id: string;
  email: string;
};

// The logged-in user, or null. Checks the session with Supabase Auth rather
// than trusting the cookie alone.
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }
  return { id: data.user.id, email: data.user.email ?? "" };
}

// The logged-in user. Sends logged-out visitors to /login.
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
