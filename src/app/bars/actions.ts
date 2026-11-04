"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { BarFormValues } from "./form-values";
import { validateBar, type BarFieldErrors } from "./validation";

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

export async function deleteBar(id: number) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("bars")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
  revalidatePath("/", "layout");
  redirect("/journal");
}
