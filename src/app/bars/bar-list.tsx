import Link from "next/link";
import type { BarWithNeighborhood } from "@/lib/bars";
import { StarButton } from "./star-button";
import { Stars } from "./stars";

// A list of bar cards, used by the Journal and Favorites pages.
export function BarList({ bars }: { bars: BarWithNeighborhood[] }) {
  return (
    <ul className="bar-list">
      {bars.map((bar) => (
        <li key={bar.id} className="card bar-card">
          <StarButton barId={bar.id} barName={bar.name} starred={bar.starred} />
          <Link href={`/bars/${bar.id}`} className="bar-card-link">
            <div>
              <h2>{bar.name}</h2>
              <p className="muted">
                {bar.neighborhood.name} · {bar.type}
                {bar.has_outdoor_seating && " · Outdoor seating"}
              </p>
            </div>
            {bar.visit_status === "visited" && bar.rating ? (
              <Stars rating={bar.rating} />
            ) : (
              <span className="badge">Want to try</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
