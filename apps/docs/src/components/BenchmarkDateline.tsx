import { Text } from "rebar-ui";

/**
 * A small, factual dateline for every /about/benchmarks page — these are dated entries in an
 * ongoing build diary of real, measured results, not a single definitive claim of the platform's
 * superiority. Conclusions here are revised in place as new evidence comes in (see the "Update"
 * section on the overview page for a real example); the date is here so a reader can judge for
 * themselves how current a given page's numbers and framing still are.
 */
export function BenchmarkDateline({ published, updated }: { published: string; updated?: string }) {
  return (
    <Text size="sm" color="secondary">
      Published {published}
      {updated ? ` · updated ${updated}` : ""} — part of an ongoing build diary of dated, real
      measurements, not a one-time proof of the platform&apos;s superiority.
    </Text>
  );
}
