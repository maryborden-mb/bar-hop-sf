import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SF_AREAS, centerOf } from "./sf-shapes";

// Neighborhood names pre-filled by the database migration.
const migration = readFileSync(
  fileURLToPath(
    new URL("../../../supabase/migrations/20261104000000_data_model.sql", import.meta.url),
  ),
  "utf8",
);
const seeded = [...migration.matchAll(/^\s+\('([^']+)'\)[,;]$/gm)].map((m) => m[1]);
const clickable = SF_AREAS.filter((a) => !a.landmark).map((a) => a.name);

describe("SF map shapes", () => {
  it("reads the neighborhood list from the migration", () => {
    expect(seeded).toContain("Marina");
    expect(seeded.length).toBeGreaterThan(30);
  });

  it("draws every neighborhood from the database (except Other)", () => {
    const missing = seeded.filter((name) => name !== "Other" && !clickable.includes(name));
    expect(missing).toEqual([]);
  });

  it("only makes real neighborhoods clickable", () => {
    const unknown = clickable.filter((name) => !seeded.includes(name));
    expect(unknown).toEqual([]);
  });

  it("draws each neighborhood once", () => {
    expect(new Set(clickable).size).toBe(clickable.length);
  });

  it("finds the middle of a shape for its label", () => {
    expect(centerOf("0,0 10,0 10,10 0,10")).toEqual([5, 5]);
  });
});
