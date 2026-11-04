"use client";

import { useOptimistic, useTransition } from "react";
import { setStarred } from "./actions";

type Props = {
  barId: number;
  barName: string;
  starred: boolean;
  // "icon" for list cards, "full" adds a text label for the detail page.
  variant?: "icon" | "full";
};

// One tap to star or unstar a bar. The star changes right away and the save
// happens in the background.
export function StarButton({ barId, barName, starred, variant = "icon" }: Props) {
  const [optimisticStarred, setOptimisticStarred] = useOptimistic(starred);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !optimisticStarred;
    startTransition(async () => {
      setOptimisticStarred(next);
      await setStarred(barId, next);
    });
  }

  const label = optimisticStarred
    ? `Remove ${barName} from favorites`
    : `Add ${barName} to favorites`;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`star-button ${variant}`}
      aria-pressed={optimisticStarred}
      aria-label={variant === "icon" ? label : undefined}
      title={label}
    >
      <span aria-hidden="true">{optimisticStarred ? "★" : "☆"}</span>
      {variant === "full" && (optimisticStarred ? "Favorite" : "Add to favorites")}
    </button>
  );
}
