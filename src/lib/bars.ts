import "server-only";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Bar, Neighborhood } from "@/lib/types";

export type BarWithNeighborhood = Bar & { neighborhood: Neighborhood };

const BAR_COLUMNS = "*, neighborhood:neighborhoods(id, name)";

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
  return data as BarWithNeighborhood[];
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
  return data as BarWithNeighborhood | null;
}

// Turns the "id" part of a URL like /bars/12 into a number, or null.
export function parseBarId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
