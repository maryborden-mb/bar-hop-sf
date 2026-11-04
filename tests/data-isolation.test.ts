// PLAN.md section 4, test 1: data isolation.
//
// Given User A has saved Howell's and User B is a separate account, when
// User B opens their bar list (or Howell's detail page directly), then User B
// sees an empty list and "not found", never User A's bar.
//
// This runs against the real Supabase project in .env.local and checks the
// database's row-level security rules directly. The queries below
// deliberately leave out the app's own "only my bars" filter, so they prove
// the database itself keeps users apart.
//
// Run with: npm run test:isolation
// Needs "Confirm email" turned off in Supabase so test sign-ups get a session,
// and TEST_EMAIL in .env.local set to an address you own. Each run creates
// two throwaway accounts using "+" tags on it (you+bar-hop-test-a-…@domain),
// since Supabase rejects made-up domains like example.com.

import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const testEmail = process.env.TEST_EMAIL;

// A unique address for one test account: you+bar-hop-test-a-1234@domain.
function testAddress(label: string) {
  const [local, domain] = testEmail?.split("@") ?? [];
  if (!local || !domain) {
    throw new Error(
      "Set TEST_EMAIL in .env.local to an email address you own " +
        "(test accounts use + tags on it).",
    );
  }
  return `${local}+bar-hop-test-${label}-${randomUUID().slice(0, 8)}@${domain}`;
}

function newClient() {
  if (!url || !key) {
    throw new Error("Missing Supabase settings. Copy .env.example to .env.local.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Signs up a brand-new account and returns a client logged in as it.
async function newUser(label: string) {
  const client = newClient();
  const email = testAddress(label);
  const { data, error } = await client.auth.signUp({
    email,
    password: randomUUID(),
  });
  if (error) {
    throw new Error(`Couldn't create test user ${label}: ${error.message}`);
  }
  if (!data.session || !data.user) {
    throw new Error(
      'Test sign-up needs a confirmation email. Turn off "Confirm email" in ' +
        "Supabase (Authentication → Sign In / Providers → Email) and run again.",
    );
  }
  return { client, id: data.user.id };
}

describe("data isolation (PLAN.md test 1)", () => {
  let userA: { client: SupabaseClient; id: string };
  let userB: { client: SupabaseClient; id: string };
  let howellsId: number;

  beforeAll(async () => {
    userA = await newUser("a");
    userB = await newUser("b");

    const { data: marina, error: hoodError } = await userA.client
      .from("neighborhoods")
      .select("id")
      .eq("name", "Marina")
      .single();
    if (hoodError) throw hoodError;

    // User A saves Howell's.
    const { data: bar, error } = await userA.client
      .from("bars")
      .insert({
        user_id: userA.id,
        neighborhood_id: marina.id,
        name: "Howell's",
        type: "Wine",
        visit_status: "visited",
        rating: 5,
        would_return: true,
      })
      .select("id")
      .single();
    if (error) throw error;
    howellsId = bar.id;
  });

  afterAll(async () => {
    if (howellsId) {
      await userA.client.from("bars").delete().eq("id", howellsId);
    }
    await Promise.all([userA?.client.auth.signOut(), userB?.client.auth.signOut()]);
  });

  it("lets User A see their own bar", async () => {
    const { data, error } = await userA.client.from("bars").select("id, name");
    expect(error).toBeNull();
    expect(data).toEqual([{ id: howellsId, name: "Howell's" }]);
  });

  it("shows User B an empty bar list", async () => {
    const { data, error } = await userB.client.from("bars").select("id, name");
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("finds nothing when User B looks up Howell's by its id (the detail page shows Not found)", async () => {
    const { data, error } = await userB.client
      .from("bars")
      .select("id, name")
      .eq("id", howellsId)
      .maybeSingle();
    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("doesn't let User B edit Howell's", async () => {
    const { data } = await userB.client
      .from("bars")
      .update({ name: "Hacked" })
      .eq("id", howellsId)
      .select("id");
    expect(data ?? []).toEqual([]);

    const { data: still } = await userA.client
      .from("bars")
      .select("name")
      .eq("id", howellsId)
      .single();
    expect(still?.name).toBe("Howell's");
  });

  it("doesn't let User B delete Howell's", async () => {
    const { data } = await userB.client
      .from("bars")
      .delete()
      .eq("id", howellsId)
      .select("id");
    expect(data ?? []).toEqual([]);

    const { data: still } = await userA.client
      .from("bars")
      .select("id")
      .eq("id", howellsId);
    expect(still).toHaveLength(1);
  });

  it("doesn't let User B add a bar to User A's journal", async () => {
    const { error } = await userB.client.from("bars").insert({
      user_id: userA.id,
      neighborhood_id: 1,
      name: "Sneaky bar",
      type: "Dive",
      visit_status: "want_to_try",
    });
    expect(error).not.toBeNull();
  });

  it("doesn't let User B star Howell's", async () => {
    const { error } = await userB.client
      .from("stars")
      .insert({ user_id: userB.id, bar_id: howellsId });
    expect(error).not.toBeNull();
  });

  it("doesn't let a logged-out visitor read any bars", async () => {
    const { data, error } = await newClient().from("bars").select("id");
    expect(data).toBeNull();
    expect(error?.code).toBe("42501"); // permission denied
  });
});
