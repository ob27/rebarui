/**
 * Shared series palette for every chart component.
 *
 * Slots are CSS custom properties (`--rebar-chart-1` .. `--rebar-chart-5`, plus `--rebar-chart-other`
 * for a grey "everything else" slot and `--rebar-chart-up` / `--rebar-chart-down` for signed deltas
 * such as candlestick bodies and waterfall steps). A theme defines them; when it does not, each slot
 * falls back to the library's original built-in colour (primary, success, warning, danger,
 * text-secondary), so unthemed use renders exactly as before.
 *
 * Assign by fixed order, never by rank. Per-series `color` props still override.
 */
export const CHART_PALETTE: readonly string[] = [
  "var(--rebar-chart-1, var(--rebar-color-primary, #0066cc))",
  "var(--rebar-chart-2, var(--rebar-color-success, #2e7d32))",
  "var(--rebar-chart-3, var(--rebar-color-warning, #f57c00))",
  "var(--rebar-chart-4, var(--rebar-color-danger, #d32f2f))",
  "var(--rebar-chart-5, var(--rebar-color-text-secondary, #757575))",
];

/** Grey slot for "other" / unassigned categories. */
export const CHART_OTHER = "var(--rebar-chart-other, var(--rebar-color-text-secondary, #757575))";
/** Signed-delta colours (candlestick up/down, waterfall increase/decrease). */
export const CHART_UP = "var(--rebar-chart-up, var(--rebar-color-success, #2e7d32))";
export const CHART_DOWN = "var(--rebar-chart-down, var(--rebar-color-danger, #d32f2f))";

/** Series colour for index `i` (cycles after the fifth slot). */
export function chartColor(i: number): string {
  const n = CHART_PALETTE.length;
  return CHART_PALETTE[((i % n) + n) % n]!;
}
