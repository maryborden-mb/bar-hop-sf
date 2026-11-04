"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { BAR_TYPES, type Neighborhood } from "@/lib/types";
import type { BarFormState } from "./actions";
import type { BarFormValues } from "./form-values";

type Props = {
  action: (prev: BarFormState, formData: FormData) => Promise<BarFormState>;
  neighborhoods: Neighborhood[];
  initialValues: BarFormValues;
  submitLabel: string;
  cancelHref: string;
};

// The message under a field, if it has a problem.
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="field-error">
      {message}
    </span>
  );
}

export function BarForm({
  action,
  neighborhoods,
  initialValues,
  submitLabel,
  cancelHref,
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? initialValues;
  const errors = state.fieldErrors ?? {};
  const [visitStatus, setVisitStatus] = useState(values.visit_status);

  // Props that link an input to its error message for screen readers.
  const errorProps = (field: keyof BarFormValues) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": `${field}-error` }
      : {};

  return (
    <form action={formAction} className="stack">
      {state.error && (
        <p className="error-summary" role="alert">
          {state.error}
        </p>
      )}

      <label className="field">
        <span>Name</span>
        <input name="name" defaultValue={values.name} {...errorProps("name")} />
        <FieldError id="name-error" message={errors.name} />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Neighborhood</span>
          <select
            name="neighborhood_id"
            defaultValue={values.neighborhood_id}
            {...errorProps("neighborhood_id")}
          >
            <option value="">Choose…</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
          <FieldError
            id="neighborhood_id-error"
            message={errors.neighborhood_id}
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select name="type" defaultValue={values.type} {...errorProps("type")}>
            <option value="">Choose…</option>
            {BAR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="type-error" message={errors.type} />
        </label>
      </div>

      <fieldset className="field" {...errorProps("visit_status")}>
        <legend>Status</legend>
        <div className="choices">
          <label>
            <input
              type="radio"
              name="visit_status"
              value="visited"
              checked={visitStatus === "visited"}
              onChange={() => setVisitStatus("visited")}
            />
            Visited
          </label>
          <label>
            <input
              type="radio"
              name="visit_status"
              value="want_to_try"
              checked={visitStatus === "want_to_try"}
              onChange={() => setVisitStatus("want_to_try")}
            />
            Want to try
          </label>
        </div>
        <FieldError id="visit_status-error" message={errors.visit_status} />
      </fieldset>

      {visitStatus === "visited" && (
        <div className="field-row">
          <label className="field">
            <span>Rating</span>
            <select
              name="rating"
              defaultValue={values.rating}
              {...errorProps("rating")}
            >
              <option value="">Choose…</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
            <FieldError id="rating-error" message={errors.rating} />
          </label>

          <fieldset className="field" {...errorProps("would_return")}>
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
            <FieldError id="would_return-error" message={errors.would_return} />
          </fieldset>
        </div>
      )}

      <label className="checkbox">
        <input
          type="checkbox"
          name="has_outdoor_seating"
          defaultChecked={values.has_outdoor_seating}
        />
        Has outdoor seating
      </label>

      <label className="field">
        <span>
          Vibe <span className="muted">(optional)</span>
        </span>
        <input
          name="vibe"
          defaultValue={values.vibe}
          placeholder="Casual, lively"
        />
      </label>

      <label className="field">
        <span>
          Notes <span className="muted">(optional)</span>
        </span>
        <textarea name="notes" rows={4} defaultValue={values.notes} />
      </label>

      <div className="actions">
        <button type="submit" className="button" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href={cancelHref} className="button ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
