// A loose, hand-drawn style map of San Francisco neighborhoods (not to
// scale, no real streets). Coordinates are in a 600 x 540 drawing space:
// north is up, the Presidio is top left, Bayview juts out bottom right.
// Neighboring shapes share corner points, so the tiles fit with no gaps.
//
// `name` must match a row in the neighborhoods table for the area to be
// clickable. Landmark areas (parks, the Presidio) are drawn for shape only.

export type MapArea = {
  name: string;
  points: string;
  // Label lines, if the name needs shortening or wrapping.
  label?: string[];
  // Where to put the label, if the middle of the shape doesn't work.
  labelAt?: [number, number];
  // Label size, if the automatic size doesn't fit (narrow shapes).
  fontSize?: number;
  // Which color from the map palette, picked so neighbors differ.
  tone?: number;
  landmark?: boolean;
};

export const MAP_WIDTH = 600;
export const MAP_HEIGHT = 540;

export const SF_AREAS: MapArea[] = [
  // Landmarks
  { name: "Presidio", landmark: true, points: "40,112 90,92 150,80 210,76 250,84 252,145 150,145 40,145" },
  { name: "Presidio Heights", landmark: true, label: [], points: "215,145 252,145 254,180 215,180" },
  { name: "Golden Gate Park", landmark: true, label: ["Golden Gate Park"], points: "40,215 130,215 215,215 215,255 130,255 40,255" },
  { name: "Twin Peaks", landmark: true, label: ["Twin", "Peaks"], points: "215,300 256,300 258,352 262,380 225,385 218,335" },
  { name: "Parkside", landmark: true, labelAt: [150, 445], points: "40,370 130,370 130,335 218,335 225,385 262,380 262,404 268,450 290,515 40,515" },

  // North shore
  { name: "Marina", tone: 5, points: "250,84 290,80 335,82 336,118 251,118" },
  { name: "Cow Hollow", tone: 3, label: ["Cow", "Hollow"], points: "251,118 336,118 337,145 252,145" },
  { name: "Russian Hill", tone: 0, label: ["Russian", "Hill"], points: "335,82 360,76 390,72 391,118 392,145 337,145 336,118" },
  { name: "North Beach", tone: 1, label: ["North", "Beach"], points: "390,72 420,62 450,66 452,118 391,118" },
  { name: "Embarcadero", tone: 2, label: ["Embar-", "cadero"], labelAt: [482, 116], fontSize: 8, points: "450,66 480,80 500,100 515,140 525,175 500,175 480,130 452,118" },

  // Richmond to downtown
  { name: "Outer Richmond", tone: 3, label: ["Outer", "Richmond"], points: "40,145 130,145 130,215 40,215" },
  { name: "Inner Richmond", tone: 4, label: ["Inner", "Richmond"], points: "130,145 150,145 215,145 215,180 215,215 130,215" },
  { name: "Pacific Heights", tone: 1, label: ["Pacific", "Heights"], points: "252,145 337,145 338,180 290,180 254,180" },
  { name: "Polk Gulch", tone: 6, label: ["Polk", "Gulch"], points: "337,145 362,145 363,185 363,210 364,232 340,228 338,210 338,180" },
  { name: "Nob Hill", tone: 0, label: ["Nob", "Hill"], points: "362,145 392,145 410,152 412,185 363,185" },
  { name: "Chinatown", tone: 5, label: ["China-", "town"], points: "391,118 452,118 454,150 410,152 392,145" },
  { name: "Financial District", tone: 4, label: ["FiDi"], points: "452,118 480,130 500,175 458,182 454,150" },
  { name: "Union Square", tone: 6, label: ["Union", "Sq."], points: "410,152 454,150 458,182 456,205 413,205 412,185" },
  { name: "Tenderloin", tone: 1, label: ["Tender-", "loin"], points: "363,185 412,185 413,205 414,232 364,232 363,210" },
  { name: "Japantown", tone: 3, label: ["Japan-", "town"], points: "290,180 338,180 338,210 340,228 291,230" },
  { name: "NoPa", tone: 0, points: "215,180 254,180 290,180 291,230 288,255 255,255 215,255 215,215" },

  // Middle
  { name: "Hayes Valley", tone: 2, label: ["Hayes", "Valley"], points: "291,230 340,228 364,232 366,268 300,270 288,255" },
  { name: "SoMa", tone: 3, points: "364,232 414,232 413,205 456,205 458,182 500,175 525,175 540,215 545,250 500,290 475,295 420,295 366,268" },
  { name: "Haight-Ashbury", tone: 4, label: ["Haight"], points: "215,255 255,255 256,300 215,300" },
  { name: "Lower Haight", tone: 5, label: ["Lower", "Haight"], points: "255,255 288,255 300,270 302,300 256,300" },
  { name: "Outer Sunset", tone: 0, label: ["Outer", "Sunset"], points: "40,255 130,255 130,335 130,370 40,370" },
  { name: "Inner Sunset", tone: 5, label: ["Inner", "Sunset"], points: "130,255 215,255 215,300 218,335 130,335" },
  { name: "Castro", tone: 6, points: "256,300 302,300 306,350 258,352" },
  { name: "Mission", tone: 0, points: "300,270 366,268 420,295 424,372 424,400 312,402 306,350 302,300" },
  { name: "Potrero Hill", tone: 1, label: ["Potrero", "Hill"], points: "420,295 475,295 482,370 424,372" },
  { name: "Dogpatch", tone: 2, label: ["Dog-", "patch"], points: "475,295 500,290 545,250 555,300 560,345 545,372 482,370" },

  // South
  { name: "Noe Valley", tone: 5, label: ["Noe", "Valley"], points: "258,352 306,350 312,402 262,404 262,380" },
  { name: "Glen Park", tone: 4, label: ["Glen", "Park"], points: "262,404 312,402 318,448 268,450" },
  { name: "Bernal Heights", tone: 1, label: ["Bernal", "Heights"], points: "312,402 424,400 425,445 318,448" },
  { name: "Bayview", tone: 6, points: "424,372 482,370 545,372 570,400 592,435 578,480 540,500 500,505 430,505 425,445 424,400" },
  { name: "Excelsior", tone: 3, points: "268,450 318,448 425,445 430,505 430,515 290,515" },
];

// Rough middle of a shape, for placing its label.
export function centerOf(points: string): [number, number] {
  const pairs = parsePoints(points);
  const x = pairs.reduce((sum, [px]) => sum + px, 0) / pairs.length;
  const y = pairs.reduce((sum, [, py]) => sum + py, 0) / pairs.length;
  return [x, y];
}

// Width and height of the box around a shape.
export function sizeOf(points: string): [number, number] {
  const pairs = parsePoints(points);
  const xs = pairs.map(([x]) => x);
  const ys = pairs.map(([, y]) => y);
  return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
}

// A label font size that fits the shape: bigger tiles get bigger names.
export function labelSize(points: string, lines: string[]): number {
  const [width, height] = sizeOf(points);
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const byWidth = (width * 0.8) / (longest * 0.62);
  const byHeight = (height * 0.7) / (lines.length * 1.15);
  return Math.round(Math.min(Math.max(Math.min(byWidth, byHeight), 7), 15) * 10) / 10;
}

function parsePoints(points: string): number[][] {
  return points.split(" ").map((p) => p.split(",").map(Number));
}
