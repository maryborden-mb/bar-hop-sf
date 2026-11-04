// Row types for the tables in supabase/migrations. Keep these in sync with
// the SQL when the schema changes.

export const BAR_TYPES = [
  "Sports",
  "Dive",
  "Wine",
  "Cocktail",
  "Brewery",
  "Other",
] as const;
export type BarType = (typeof BAR_TYPES)[number];

export const VISIT_STATUSES = ["visited", "want_to_try"] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

export const GOOD_FOR_TAGS = [
  "sunny",
  "sports",
  "big groups",
  "food",
] as const;
export type GoodForTag = (typeof GOOD_FOR_TAGS)[number];

// How each tag reads in the app.
export const GOOD_FOR_LABELS: Record<GoodForTag, string> = {
  sunny: "Sunny",
  sports: "Watching sports",
  "big groups": "Big groups",
  food: "Food",
};

export type Neighborhood = {
  id: number;
  name: string;
};

export type Bar = {
  id: number;
  user_id: string;
  neighborhood_id: number;
  name: string;
  type: BarType;
  visit_status: VisitStatus;
  rating: number | null; // 1–5, set when visited
  would_return: boolean | null; // set when visited
  has_outdoor_seating: boolean;
  vibe: string | null;
  good_for: GoodForTag[];
  notes: string | null;
  created_at: string;
};

export type Star = {
  user_id: string;
  bar_id: number;
  created_at: string;
};
