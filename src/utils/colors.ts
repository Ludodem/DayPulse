/**
 * Returns a CSS color for a score 0-10.
 * 0 = red (#dc2626), 5 = yellow (#eab308), 10 = green (#16a34a)
 */
export function scoreToColor(value: number): string {
  const clamped = Math.max(0, Math.min(10, value));
  const t = clamped / 10;

  // Interpolate: red (0) -> yellow (0.5) -> green (1)
  let r: number, g: number, b: number;

  if (t <= 0.5) {
    const p = t / 0.5;
    r = 220 + (234 - 220) * p;
    g = 38 + (179 - 38) * p;
    b = 38 + (8 - 38) * p;
  } else {
    const p = (t - 0.5) / 0.5;
    r = 234 + (22 - 234) * p;
    g = 179 + (163 - 179) * p;
    b = 8 + (74 - 8) * p;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export const NO_SCORE_COLOR = '#e2e8f0';
