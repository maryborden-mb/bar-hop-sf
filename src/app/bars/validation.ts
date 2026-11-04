import { BAR_TYPES, VISIT_STATUSES } from "@/lib/types";
import type { BarFormValues } from "./form-values";

export type BarFieldErrors = Partial<Record<keyof BarFormValues, string>>;

// Checks the bar form and returns a friendly message for each problem.
// An empty object means the bar is ready to save.
export function validateBar(values: BarFormValues): BarFieldErrors {
  const errors: BarFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please give this bar a name.";
  }

  if (!values.neighborhood_id) {
    errors.neighborhood_id = "Please choose a neighborhood.";
  } else if (!(Number(values.neighborhood_id) > 0)) {
    errors.neighborhood_id = "Please choose a neighborhood from the list.";
  }

  if (!values.type) {
    errors.type = "Please choose a type of bar.";
  } else if (!(BAR_TYPES as readonly string[]).includes(values.type)) {
    errors.type = "Please choose a type from the list.";
  }

  if (!values.visit_status) {
    errors.visit_status = "Have you been here yet? Choose Visited or Want to try.";
  } else if (!(VISIT_STATUSES as readonly string[]).includes(values.visit_status)) {
    errors.visit_status = "Choose Visited or Want to try.";
  }

  if (values.visit_status === "visited") {
    Object.assign(errors, validateVisit(values));
  }

  return errors;
}

export type VisitFieldErrors = Pick<BarFieldErrors, "rating" | "would_return">;

// The extra answers a visited bar needs: used by the bar form and by
// "mark as visited" on a want-to-try bar.
export function validateVisit(
  values: Pick<BarFormValues, "rating" | "would_return">,
): VisitFieldErrors {
  const errors: VisitFieldErrors = {};

  const rating = Number(values.rating);
  if (!values.rating) {
    errors.rating = "You've been here, so give it a rating from 1 to 5 stars.";
  } else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Ratings go from 1 to 5 stars.";
  }

  if (values.would_return !== "yes" && values.would_return !== "no") {
    errors.would_return = "Would you go back? Choose Yes or No.";
  }

  return errors;
}
