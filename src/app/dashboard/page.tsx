import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listBars } from "@/lib/bars";
import { NeighborhoodChart } from "./neighborhood-chart";
import { computeStats } from "./stats";

export const metadata: Metadata = { title: "Dashboard · Bar Hop SF" };

export default function DashboardPage() {
  return (
    <main className="page">
      <h1>Dashboard</h1>
      <p className="muted">Your bar habits at a glance.</p>
      <Suspense fallback={<p className="muted">Loading your dashboard…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}

async function Dashboard() {
  const stats = computeStats(await listBars());

  if (stats.totalBars === 0) {
    return (
      <div className="card empty">
        <p>Nothing to show yet.</p>
        <p>
          <Link href="/bars/new">Add your first bar</Link> to start your
          dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="stack">
      <dl className="stat-tiles">
        <div className="card stat-tile">
          <dt>Total bars</dt>
          <dd>{stats.totalBars}</dd>
        </div>
        <div className="card stat-tile">
          <dt>Average rating</dt>
          <dd>
            {stats.averageRating === null ? "–" : stats.averageRating.toFixed(1)}
            {stats.averageRating !== null && <span className="unit"> / 5</span>}
          </dd>
          <p className="stat-note">
            From {stats.visitedBars} visited{" "}
            {stats.visitedBars === 1 ? "bar" : "bars"}
          </p>
        </div>
        <div className="card stat-tile">
          <dt>Would go back</dt>
          <dd>{stats.returnPercent === null ? "–" : `${stats.returnPercent}%`}</dd>
          <p className="stat-note">Of the bars you&apos;ve visited</p>
        </div>
      </dl>

      <section className="card">
        <h2 className="section-title">Bars per neighborhood</h2>
        <NeighborhoodChart data={stats.perNeighborhood} />
        <details className="table-view">
          <summary>Show as a table</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Neighborhood</th>
                <th scope="col">Bars</th>
              </tr>
            </thead>
            <tbody>
              {stats.perNeighborhood.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </div>
  );
}
