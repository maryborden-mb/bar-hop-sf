"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { BarFormValues } from "./form-values";
import {
  validateBar,
  validateVisit,
  type BarFieldErrors,
  type VisitFieldErrors,
} from "./validation";

export type BarFormState = {
  error?: string;
  fieldErrors?: BarFieldErrors;
  // What was typed, so the form keeps it when saving fails.
  values?: BarFormValues;
};

// Shown when the form looks fine but the database still refuses the save.
const SAVE_ERROR =
  "Something went wrong saving this bar. Please try again.";

function checkForm(values: BarFormValues): BarFormState | null {
  const fieldErrors = validateBar(values);
  if (Object.keys(fieldErrors).length === 0) {
    return null;
  }
  return {
    error: "A few things need fixing before this bar can be saved.",
    fieldErrors,
    values,
  };
}

function readValues(formData: FormData): BarFormValues {
  const text = (key: string) => String(formData.get(key) ?? "").trim();
  return {
    name: text("name"),
    neighborhood_id: text("neighborhood_id"),
    type: text("type"),
    visit_status: text("visit_status"),
    rating: text("rating"),
    would_return: text("would_return"),
    has_outdoor_seating: formData.get("has_outdoor_seating") === "on",
    good_for: formData.getAll("good_for").map(String),
    vibe: text("vibe"),
    notes: text("notes"),
  };
}

// Turns form values into a row for the bars table.
function toRow(values: BarFormValues) {
  const visited = values.visit_status === "visited";
  return {
    name: values.name,
    neighborhood_id: Number(values.neighborhood_id) || null,
    type: values.type,
    visit_status: values.visit_status,
    // Rating and would-return only apply to bars you've been to.
    rating: visited && values.rating ? Number(values.rating) : null,
    would_return:
      visited && values.would_return ? values.would_return === "yes" : null,
    has_outdoor_seating: values.has_outdoor_seating,
    good_for: [...new Set(values.good_for)],
    vibe: values.vibe || null,
    notes: values.notes || null,
  };
}

export async function createBar(
  _prev: BarFormState,
  formData: FormData,
): Promise<BarFormState> {
  const user = await requireUser();
  const values = readValues(formData);
  const invalid = checkForm(values);
  if (invalid) {
    return invalid;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bars")
    .insert({ ...toRow(values), user_id: user.id })
    .select("id")
    .single();
  if (error) {
    return { error: SAVE_ERROR, values };
  }
  revalidatePath("/", "layout");
  redirect(`/bars/${data.id}`);
}

export async function updateBar(
  id: number,
  _prev: BarFormState,
  formData: FormData,
): Promise<BarFormState> {
  const user = await requireUser();
  const values = readValues(formData);
  const invalid = checkForm(values);
  if (invalid) {
    return invalid;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bars")
    .update(toRow(values))
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || data.length === 0) {
    return { error: SAVE_ERROR, values };
  }
  revalidatePath("/", "layout");
  redirect(`/bars/${id}`);
}

export type MarkVisitedState = {
  error?: string;
  fieldErrors?: VisitFieldErrors;
  values?: { rating: string; would_return: string };
};

// Moves a want-to-try bar into the Journal with a rating and a
// would-you-go-back answer.
export async function markVisited(
  id: number,
  _prev: MarkVisitedState,
  formData: FormData,
): Promise<MarkVisitedState> {
  const user = await requireUser();
  const values = {
    rating: String(formData.get("rating") ?? ""),
    would_return: String(formData.get("would_return") ?? ""),
  };
  const fieldErrors = validateVisit(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bars")
    .update({
      visit_status: "visited",
      rating: Number(values.rating),
      would_return: values.would_return === "yes",
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || data.length === 0) {
    return { error: SAVE_ERROR, values };
  }
  revalidatePath("/", "layout");
  redirect(`/bars/${id}`);
}

// Stars or unstars one of your bars. The database only lets you star your
// own bars, and starring twice is ignored.
export async function setStarred(barId: number, starred: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = starred
    ? await supabase
        .from("stars")
        .upsert(
          { user_id: user.id, bar_id: barId },
          { onConflict: "user_id,bar_id", ignoreDuplicates: true },
        )
    : await supabase
        .from("stars")
        .delete()
        .eq("user_id", user.id)
        .eq("bar_id", barId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

// After deleting, go back to the list the bar was on.
export async function deleteBar(id: number, returnTo: "/journal" | "/wishlist") {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("bars")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
  revalidatePath("/", "layout");
  redirect(returnTo === "/wishlist" ? "/wishlist" : "/journal");
}
