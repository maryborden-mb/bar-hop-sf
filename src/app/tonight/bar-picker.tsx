"use client";

import Link from "next/link";
import { useState } from "react";
import type { BarWithNeighborhood } from "@/lib/bars";
import { Stars } from "@/app/bars/stars";
import { TagList } from "@/app/bars/tag-list";
import { eligibleBars, pickBar } from "./pick";

// Picks happen in the browser: the page sends over your 4+ bars once, and
// each tap of the button just picks from them.
export function BarPicker({ bars }: { bars: BarWithNeighborhood[] }) {
  const [neighborhoodId, setNeighborhoodId] = useState<number | null>(null);
  const [pick, setPick] = useState<BarWithNeighborhood | null>(null);

  const neighborhoods = [
    ...new Map(bars.map((b) => [b.neighborhood.id, b.neighborhood])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));
  const candidates = eligibleBars(bars, neighborhoodId);
  const neighborhoodName = neighborhoods.find((n) => n.id === neighborhoodId)?.name;

  function choose() {
    setPick(pickBar(candidates, pick?.id ?? null));
  }

  return (
    <div className="stack">
      <div className="picker-controls">
        <label className="field">
          <span>Neighborhood</span>
          <select
            value={neighborhoodId ?? ""}
            onChange={(e) => {
              setNeighborhoodId(Number(e.target.value) || null);
              setPick(null);
            }}
          >
            <option value="">Anywhere</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="button" onClick={choose}>
          {pick ? "Pick again" : "Pick a bar"}
        </button>
      </div>

      <p className="muted">
        Choosing from {candidates.length}{" "}
        {candidates.length === 1 ? "bar" : "bars"} rated 4★ or more
        {neighborhoodName ? ` in ${neighborhoodName}` : ""}.
      </p>

      <div aria-live="polite">
        {pick && (
          <article className="card pick-result">
            <p className="eyebrow">Tonight, go to</p>
            <h2>{pick.name}</h2>
            <p className="muted">
              {pick.neighborhood.name} · {pick.type}
              {pick.has_outdoor_seating && " · Outdoor seating"}
            </p>
            {pick.rating && <Stars rating={pick.rating} />}
            <TagList tags={pick.good_for} />
            {pick.vibe && <p className="pick-vibe">“{pick.vibe}”</p>}
            <p>
              <Link href={`/bars/${pick.id}`}>See your notes →</Link>
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
