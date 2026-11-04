"use client";

import { useActionState } from "react";
import { markVisited, type MarkVisitedState } from "./actions";

// Shown on a want-to-try bar's page: rate it and move it to the Journal.
export function MarkVisitedForm({ id, name }: { id: number; name: string }) {
  const [state, formAction, pending] = useActionState<MarkVisitedState, FormData>(
    markVisited.bind(null, id),
    {},
  );
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? { rating: "", would_return: "" };

  return (
    <section className="card mark-visited" id="mark-visited">
      <h2 className="section-title">Been to {name}?</h2>
      <p className="muted">Rate it to move it from your wishlist to your journal.</p>

      <form action={formAction} className="stack">
        <div className="field-row">
          <label className="field">
            <span>Rating</span>
            <select
              name="rating"
              defaultValue={values.rating}
              aria-invalid={errors.rating ? true : undefined}
              aria-describedby={errors.rating ? "visit-rating-error" : undefined}
            >
              <option value="">Choose…</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
            {errors.rating && (
              <span id="visit-rating-error" className="field-error">
                {errors.rating}
              </span>
            )}
          </label>

          <fieldset
            className="field"
            aria-invalid={errors.would_return ? true : undefined}
            aria-describedby={errors.would_return ? "visit-return-error" : undefined}
          >
            <legend>Would you go back?</legend>
            <div className="choices">
              <label>
                <input
                  type="radio"
                  name="would_return"
                  value="yes"
                  defaultChecked={values.would_return === "yes"}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="would_return"
                  value="no"
                  defaultChecked={values.would_return === "no"}
                />
                No
              </label>
            </div>
            {errors.would_return && (
              <span id="visit-return-error" className="field-error">
                {errors.would_return}
              </span>
            )}
          </fieldset>
        </div>

        {state.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}

        <div>
          <button type="submit" className="button" disabled={pending}>
            {pending ? "Saving…" : "Mark as visited"}
          </button>
        </div>
      </form>
    </section>
  );
}
