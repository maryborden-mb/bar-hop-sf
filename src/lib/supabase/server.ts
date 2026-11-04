import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Supabase client for Server Components, Server Actions and Route Handlers.
// The session lives in cookies, so each request gets its own client.
export async function createClient() {
  const cookieStore = await cookies();
  // Supabase reads the clock (to check token expiry) and calls the network,
  // so tell Next.js this work only happens at request time.
  await connection();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components can't set cookies. That's fine: the proxy
            // refreshes the session cookies before the page renders.
          }
        },
      },
    },
  );
}
