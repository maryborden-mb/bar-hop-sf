"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { NeighborhoodCount } from "./stats";

// Chart colors. The bar is a slightly lighter burgundy than the brand color,
// checked for contrast against the card surface.
const BAR_COLOR = "#9b2c3a";
const TEXT_COLOR = "#6e5f55"; // --muted
const HOVER_BAND = "#f3e9d6";

const ROW_HEIGHT = 36;

function barsLabel(count: number) {
  return `${count} ${count === 1 ? "bar" : "bars"}`;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  const row = payload?.[0]?.payload as NeighborhoodCount | undefined;
  if (!active || !row) return null;
  return (
    <div className="chart-tooltip">
      <strong>{row.name}</strong>
      <span>{barsLabel(row.count)}</span>
    </div>
  );
}

// Horizontal bars, one per neighborhood, longest at the top.
export function NeighborhoodChart({ data }: { data: NeighborhoodCount[] }) {
  return (
    <div
      className="chart"
      role="img"
      aria-label={`Bars per neighborhood: ${data
        .map((d) => `${d.name} ${d.count}`)
        .join(", ")}`}
    >
      <ResponsiveContainer width="100%" height={data.length * ROW_HEIGHT + 8}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 32, bottom: 4, left: 0 }}
          barCategoryGap={8}
        >
          {/* Every bar has its value at the tip, so no number axis is needed. */}
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={{ fill: TEXT_COLOR, fontSize: 14 }}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ fill: HOVER_BAND }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="count"
            fill={BAR_COLOR}
            barSize={20}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="count"
              position="right"
              fill={TEXT_COLOR}
              fontSize={14}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
