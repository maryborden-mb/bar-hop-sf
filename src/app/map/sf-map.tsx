import Link from "next/link";
import type { Neighborhood } from "@/lib/types";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  SF_AREAS,
  centerOf,
  labelSize,
  type MapArea,
} from "./sf-shapes";

// Neighborhood fills, from the app's burgundy and gold palette. Each has a
// text color that reads on it. Shapes pick one with `tone`.
const FILLS = [
  { fill: "#a8384a", text: "#fffaf0" }, // rose
  { fill: "#d4a94f", text: "#3a0c14" }, // gold
  { fill: "#e8c9a6", text: "#3a0c14" }, // blush
  { fill: "#7a1f2b", text: "#fffaf0" }, // burgundy
  { fill: "#c97a6d", text: "#3a0c14" }, // coral
  { fill: "#b5793b", text: "#3a0c14" }, // amber
  { fill: "#8f4a3c", text: "#fffaf0" }, // terracotta
];

const colorsFor = (area: MapArea) => FILLS[(area.tone ?? 0) % FILLS.length];

type Props = {
  neighborhoods: Neighborhood[];
  // Journal bar counts by neighborhood id.
  counts: Map<number, number>;
};

// The clickable map. Each neighborhood links to the Journal filtered to it.
// Shapes are drawn first and labels on top, so no shape hides a label.
export function SfMap({ neighborhoods, counts }: Props) {
  const idByName = new Map(neighborhoods.map((n) => [n.name, n.id]));
  const countFor = (area: MapArea) => {
    const id = idByName.get(area.name);
    return id ? (counts.get(id) ?? 0) : 0;
  };

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="sf-map"
      role="group"
      aria-label="Map of San Francisco neighborhoods"
    >
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} rx="18" className="sf-map-ocean" />

      {SF_AREAS.map((area) => {
        if (area.landmark) {
          return (
            <polygon
              key={area.name}
              points={area.points}
              className="sf-landmark"
              aria-hidden="true"
            />
          );
        }

        const polygon = <polygon points={area.points} fill={colorsFor(area).fill} />;
        const id = idByName.get(area.name);
        if (!id) {
          return <g key={area.name}>{polygon}</g>;
        }
        const count = countFor(area);
        const barsText = count === 1 ? "1 bar" : `${count} bars`;
        return (
          <Link
            key={area.name}
            href={`/journal?neighborhood=${id}`}
            className={count > 0 ? "sf-area has-bars" : "sf-area"}
            aria-label={`${area.name}: ${barsText}`}
          >
            <title>{`${area.name} · ${barsText}`}</title>
            {polygon}
          </Link>
        );
      })}

      <g aria-hidden="true">
        {SF_AREAS.map((area) => {
          const [x, y] = area.labelAt ?? centerOf(area.points);
          const lines = area.label ?? [area.name];
          const size = area.fontSize ?? labelSize(area.points, lines);
          if (area.landmark) {
            return (
              <MapLabel
                key={area.name}
                x={x}
                y={y}
                lines={lines}
                size={size}
                className="sf-landmark-label"
              />
            );
          }
          const count = countFor(area);
          return (
            <g key={area.name}>
              <MapLabel
                x={x}
                y={y}
                lines={lines}
                size={size}
                fill={colorsFor(area).text}
              />
              {count > 0 && (
                <g
                  className="sf-count"
                  transform={`translate(${x} ${y - (lines.length * size * 1.1) / 2 - 10})`}
                >
                  <circle r="8.5" />
                  <text dy="3.2">{count}</text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function MapLabel({
  x,
  y,
  lines,
  size,
  fill,
  className = "sf-label",
}: {
  x: number;
  y: number;
  lines: string[];
  size: number;
  fill?: string;
  className?: string;
}) {
  if (lines.length === 0) return null;
  const lineHeight = size * 1.1;
  const top = y - ((lines.length - 1) * lineHeight) / 2 + size * 0.35;
  return (
    <text x={x} y={top} className={className} fill={fill} fontSize={size}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
