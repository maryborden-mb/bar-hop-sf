import type { Bar } from "@/lib/types";

// The bar form's fields, as the form holds them (mostly strings).
export type BarFormValues = {
  name: string;
  neighborhood_id: string;
  type: string;
  visit_status: string;
  rating: string;
  would_return: string; // "yes", "no", or ""
  has_outdoor_seating: boolean;
  vibe: string;
  notes: string;
};

export const EMPTY_BAR_FORM: BarFormValues = {
  name: "",
  neighborhood_id: "",
  type: "",
  visit_status: "",
  rating: "",
  would_return: "",
  has_outdoor_seating: false,
  vibe: "",
  notes: "",
};

export function barToFormValues(bar: Bar): BarFormValues {
  return {
    name: bar.name,
    neighborhood_id: String(bar.neighborhood_id),
    type: bar.type,
    visit_status: bar.visit_status,
    rating: bar.rating ? String(bar.rating) : "",
    would_return:
      bar.would_return === null ? "" : bar.would_return ? "yes" : "no",
    has_outdoor_seating: bar.has_outdoor_seating,
    vibe: bar.vibe ?? "",
    notes: bar.notes ?? "",
  };
}
