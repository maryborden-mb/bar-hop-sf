import "server-only";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Bar, Neighborhood } from "@/lib/types";

export type BarWithNeighborhood = Bar & {
  neighborhood: Neighborhood;
  starred: boolean;
};

// Row-level security only returns your own stars, so a bar has a star row
// here exactly when you've starred it.
const BAR_COLUMNS = "*, neighborhood:neighborhoods(id, name), stars(user_id)";
const STARRED_BAR_COLUMNS =
  "*, neighborhood:neighborhoods(id, name), stars!inner(user_id)";

type BarRow = Bar & { neighborhood: Neighborhood; stars: { user_id: string }[] };

function toBar({ stars, ...bar }: BarRow): BarWithNeighborhood {
  return { ...bar, starred: stars.length > 0 };
}

// Every function here checks who is logged in. Row-level security in the
// database also limits each user to their own bars, so a bar that belongs to
// someone else simply isn't found.

export async function listNeighborhoods(): Promise<Neighborhood[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return data;
}

export async function listBars(): Promise<BarWithNeighborhood[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bars")
    .select(BAR_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BarRow[]).map(toBar);
}

// Only the bars you've starred, newest first.
export async function listStarredBars(): Promise<BarWithNeighborhood[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bars")
    .select(STARRED_BAR_COLUMNS)
    .eq("user_id", user.id)
    .eq("stars.user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BarRow[]).map(toBar);
}

// The bar with this id, or null if it doesn't exist or isn't yours.
export async function getBar(id: number): Promise<BarWithNeighborhood | null> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bars")
    .select(BAR_COLUMNS)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? toBar(data as BarRow) : null;
}

// Turns the "id" part of a URL like /bars/12 into a number, or null.
export function parseBarId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
