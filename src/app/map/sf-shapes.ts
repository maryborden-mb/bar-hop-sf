// A loose, hand-drawn style map of San Francisco neighborhoods (not to
// scale, no real streets). Coordinates are in a 600 x 520 drawing space:
// north is up, the Presidio is top left, Bayview is bottom right.
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
  // Which color from the map palette, picked so neighbors differ.
  tone?: number;
  landmark?: boolean;
};

export const MAP_WIDTH = 600;
export const MAP_HEIGHT = 520;

export const SF_AREAS: MapArea[] = [
  // Landmarks
  { name: "Presidio", landmark: true, points: "60,62 228,46 244,132 150,138 58,124" },
  { name: "Presidio Heights", landmark: true, label: [], points: "176,136 244,134 246,170 178,172" },
  { name: "Golden Gate Park", landmark: true, points: "20,222 246,228 250,256 20,260" },
  { name: "Twin Peaks", landmark: true, label: ["Twin", "Peaks"], labelAt: [232, 352], points: "200,306 258,302 268,372 206,376" },
  { name: "Parkside", landmark: true, points: "20,390 110,388 112,342 198,340 205,380 230,408 236,448 272,450 284,508 20,510" },

  // North
  { name: "Marina", tone: 5, points: "236,48 330,52 332,100 240,104" },
  { name: "Cow Hollow", tone: 3, label: ["Cow", "Hollow"], points: "240,106 332,102 334,130 243,134" },
  { name: "Russian Hill", tone: 0, label: ["Russian", "Hill"], points: "332,52 386,56 388,124 336,128" },
  { name: "North Beach", tone: 1, label: ["North", "Beach"], points: "388,56 446,50 450,114 390,118" },
  { name: "Embarcadero", tone: 2, label: ["Embar-", "cadero"], labelAt: [475, 104], points: "448,50 472,50 516,130 536,188 510,194 482,136 452,114" },

  // Richmond to downtown
  { name: "Outer Richmond", tone: 3, label: ["Outer", "Richmond"], points: "20,124 100,128 104,214 20,214" },
  { name: "Inner Richmond", tone: 4, label: ["Inner", "Richmond"], points: "102,128 174,136 178,214 106,214" },
  { name: "Pacific Heights", tone: 1, label: ["Pacific", "Heights"], points: "246,136 334,132 336,174 248,178" },
  { name: "Polk Gulch", tone: 6, label: ["Polk", "Gulch"], points: "338,130 362,128 364,194 338,196" },
  { name: "Nob Hill", tone: 0, label: ["Nob", "Hill"], points: "364,128 414,122 418,164 366,168" },
  { name: "Chinatown", tone: 5, label: ["China-", "town"], points: "416,122 450,118 452,160 420,164" },
  { name: "Financial District", tone: 4, label: ["FiDi"], points: "452,118 480,136 506,194 456,200 454,160" },
  { name: "Japantown", tone: 3, label: ["Japan-", "town"], points: "292,178 336,176 338,212 294,214" },
  { name: "NoPa", tone: 0, points: "228,182 290,180 292,234 230,238" },
  { name: "Tenderloin", tone: 1, label: ["Tender-", "loin"], points: "366,170 418,166 420,210 368,214" },
  { name: "Union Square", tone: 6, label: ["Union", "Sq."], points: "420,166 452,162 456,200 422,210" },

  // Middle
  { name: "Hayes Valley", tone: 2, label: ["Hayes", "Valley"], points: "296,216 364,216 366,252 300,256" },
  { name: "Lower Haight", tone: 5, label: ["Lower", "Haight"], points: "252,240 294,238 298,282 256,284" },
  { name: "Haight-Ashbury", tone: 4, label: ["Haight"], points: "198,262 250,260 254,300 202,302" },
  { name: "SoMa", tone: 3, points: "370,216 456,204 510,198 532,202 516,250 470,300 406,300 372,258" },
  { name: "Outer Sunset", tone: 0, label: ["Outer", "Sunset"], points: "20,266 108,266 110,384 20,384" },
  { name: "Inner Sunset", tone: 5, label: ["Inner", "Sunset"], points: "110,266 194,266 198,336 112,338" },
  { name: "Castro", tone: 6, points: "258,288 316,284 318,340 262,342" },
  { name: "Mission", tone: 0, points: "320,282 370,264 404,302 410,400 326,402 320,340" },
  { name: "Potrero Hill", tone: 1, label: ["Potrero", "Hill"], points: "412,306 470,304 480,372 414,376" },
  { name: "Dogpatch", tone: 2, label: ["Dog-", "patch"], points: "474,302 516,256 546,302 540,370 484,372" },

  // South
  { name: "Noe Valley", tone: 5, label: ["Noe", "Valley"], points: "262,344 318,342 324,402 268,406" },
  { name: "Glen Park", tone: 4, label: ["Glen", "Park"], points: "232,410 266,408 272,446 238,448" },
  { name: "Bernal Heights", tone: 1, label: ["Bernal", "Heights"], points: "326,404 408,402 408,446 330,448" },
  { name: "Bayview", tone: 6, points: "414,378 540,372 574,430 556,488 440,492 410,450" },
  { name: "Excelsior", tone: 3, points: "274,450 408,450 420,500 286,508" },
];

// Rough middle of a shape, for placing its label.
export function centerOf(points: string): [number, number] {
  const pairs = points.split(" ").map((p) => p.split(",").map(Number));
  const x = pairs.reduce((sum, [px]) => sum + px, 0) / pairs.length;
  const y = pairs.reduce((sum, [, py]) => sum + py, 0) / pairs.length;
  return [x, y];
}
