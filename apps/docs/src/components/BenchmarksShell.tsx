"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Box, NavIndex, Stack } from "rebar-ui";
import type { NavIndexItem } from "rebar-ui";

// `status`/`statusTone` is this component's existing "metadata pill next to the label, never
// inline text" mechanism (see NavIndexItem's own doc comment, ref/HEURISTICS.md #41) — repurposed
// here to show which rebar-ui version each dated benchmark entry actually measured against, since
// this section is a build diary of separate, dated entries rather than one single result.
const BENCHMARK_SECTIONS: NavIndexItem[] = [
  { href: "/about/benchmarks", label: "Overview", status: "v0.1.0 → v0.12.1", statusTone: "default" },
  { href: "/about/benchmarks/scenarios", label: "What this costs you", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/receipts", label: "The receipts", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/claude", label: "Claude Sonnet 5", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/qwen", label: "Qwen3.7", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/kimi", label: "Kimi-K3", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/tiers", label: "Simple/Composite/Complex", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/iteration", label: "Does iteration change it?", status: "v0.1.0", statusTone: "default" },
  { href: "/about/benchmarks/kanban", label: "Kanban: tier without the wrapper", status: "v0.12.1", statusTone: "info" },
  { href: "/about/benchmarks/coherence", label: "Field evidence: Coherence", status: "v0.4.0+", statusTone: "info" },
];

// Mirrors DocsShell exactly (cross-page left nav via NavIndex), sized wider (1040 vs. 960) since
// this section's own content — wide stats tables, 700px-viewBox charts — needs more room than
// prose does. Split into these 8 routes from a single ~1,400-line page, the same way /docs/* is
// split, per heuristic #11 (IA as pyramid) — one long page was becoming its own gap to navigate.
export function BenchmarksShell({ children }: { children: ReactNode }) {
  return (
    <Box as="main" style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack direction="row" gap="xl" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        <NavIndex
          items={BENCHMARK_SECTIONS}
          searchPlaceholder="Search sections…"
          renderLink={({ href, children: linkChildren, className }) => (
            <Link href={href} className={className}>
              {linkChildren}
            </Link>
          )}
        />
        <Box style={{ flex: 1, minWidth: 0 }}>{children}</Box>
      </Stack>
    </Box>
  );
}
