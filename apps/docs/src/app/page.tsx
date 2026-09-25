import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Box, Button, Card, CodeBlock, Heading, Stack } from "rebar-ui";
import type { Construct, FeatureGridItem, PillarGridItem } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// This homepage's own content sections (hero, section headers, feature row, three-pillars grid,
// arc narrative, benchmark teaser) are `BlockRenderer` output from plain Construct[] documents —
// a real, working example of the Packer composing content-shaped sections, exactly the case it's
// good for (see ref/TIERS.md and /about/agent for when that's the right call versus reaching for
// a high-tier component directly). `Section` (page-chrome padding/background) is the one thing
// the Packer itself is built from and stays hand-authored.

const HERO_BLOCKS: Construct[] = [
  {
    type: "hero",
    badge: "🚧 0.12.1 — see [the repo](https://github.com/ob27/rebarui)",
    title: "Rebar UI",
    subtitle:
      "Headless-first, intentionally low-fidelity React components, classified by tier so an agent reaches for a component that already does the job — a full Kanban board, a signature pad, a combobox — instead of rebuilding it from primitives. Measured cheaper and more consistent than hand-authored Ant Design, even after fully migrating to a real design system once you're done iterating.",
    actions: [
      { label: "Agent Context", href: "/about/agent", variant: "primary" },
      { label: "Design Heuristics", href: "/about/agent" },
    ],
    codeSnippet: "npm install rebar-ui",
  },
];

const MICRO_FEATURES: FeatureGridItem[] = [
  {
    title: "Headless & accessible",
    body: "Radix UI underneath every interactive component.",
  },
  {
    title: "Built to be replaced",
    body: "CSS-variable theming — re-skin without rewriting.",
  },
  {
    title: "Playwright-proof",
    body: "data-rebar-* attributes survive the re-skin.",
  },
];

const PILLARS_HEADER: Construct[] = [
  {
    type: "section-header",
    kicker: "Three pillars",
    title: "Heuristics, components, and proof",
    subtitle:
      "The design defaults, the library that implements them, and the argument that building this way actually saves time and tokens.",
  },
];

const PILLARS: PillarGridItem[] = [
  {
    title: "Design Heuristics",
    body: "Spacing, type scale, color, and interaction defaults baked in — cited to Nielsen, Shneiderman, Material, Carbon, and USWDS, not invented. See each rule applied live across the component catalog.",
    href: "/about/agent",
    cta: "Read the heuristics",
  },
  {
    title: "Five Tiers",
    body: "192 components and 42 blocks, classified by where they sit between a raw static primitive and a piece of page-level structural law — Imitations, Synthetics, Opinions, Orders, Geneses. Working toward full Ant Design v6 parity, with a real codemod, not just a prompt.",
    href: "/about/agent",
    cta: "Browse the tiers",
  },
  {
    title: "Benchmarks",
    body: "The actual argument for building this way, measured: cheaper and far more visually consistent than hand-authored AntD from the first build — and still cheaper overall even after migrating away for real theming, once a design goes through enough rounds of revision.",
    href: "/about/benchmarks",
    cta: "See the numbers",
  },
];

const ARC_BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Why build this way",
    body: [
      {
        kind: "text",
        text: "Real UI work is volatile early — layouts and content shift every round of feedback. Rebar's real saving is reaching for a component that already does the job (a full Kanban board, a signature pad, a combobox) instead of rebuilding it from primitives — the same reason a carpenter reaches for a pre-built door instead of milling one from raw lumber. The placement layer is one convenient way to compose those components when a page's content is naturally construct-shaped, not the source of the saving itself.",
      },
      {
        kind: "text",
        text: "Once the design stabilizes, that plainness stops being useful — that's the one moment Rebar is meant to be migrated away from, to a real design system, by hand or by an LLM, without rewriting component structure or breaking tests. Building this way isn't free once you count that migration; it's cheaper anyway, on every model and prompt style measured so far.",
      },
    ],
  },
];

const PROOF_HEADER: Construct[] = [
  {
    type: "section-header",
    kicker: "Measured, not asserted",
    title: "The numbers behind that claim",
  },
];

const PROOF_BLOCKS: Construct[] = [
  {
    type: "stats-table",
    headers: ["Metric", "Result"],
    rows: [
      ["Token cost vs. hand-authored AntD (Claude)", "3–5% cheaper"],
      ["Token cost vs. hand-authored AntD (Qwen / Kimi)", "25–75% cheaper"],
      ["Migration break-even point", "13–17 revision rounds"],
    ],
  },
];

const containerStyle: CSSProperties = { maxWidth: 960, margin: "0 auto" };

function Section({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <Box
      style={{
        background:
          tone === "muted" ? "var(--rebar-color-bg-secondary, #f5f5f5)" : "var(--rebar-color-bg-primary, #ffffff)",
        padding: "var(--rebar-space-2xl) var(--rebar-space-xl)",
      }}
    >
      <Box style={containerStyle}>{children}</Box>
    </Box>
  );
}

export default function Home() {
  return (
    <>
      <Section>
        <Stack gap="lg" style={{ alignItems: "center" }}>
          <NextBlockRenderer blocks={HERO_BLOCKS} />
          <Box style={{ paddingTop: "var(--rebar-space-md)" }}>
            <NextBlockRenderer blocks={[{ type: "feature-grid", items: MICRO_FEATURES }]} />
          </Box>
        </Stack>
      </Section>

      <Section tone="muted">
        <Stack gap="xl">
          <NextBlockRenderer blocks={PILLARS_HEADER} />
          <NextBlockRenderer blocks={[{ type: "pillar-grid", items: PILLARS }]} />
        </Stack>
      </Section>

      <Section>
        <NextBlockRenderer blocks={ARC_BLOCKS} />
      </Section>

      <Section tone="muted">
        <Stack gap="lg">
          <NextBlockRenderer blocks={PROOF_HEADER} />
          <NextBlockRenderer blocks={PROOF_BLOCKS} />
          <Link href="/about/benchmarks">
            <Button variant="secondary">See the full methodology and live comparison</Button>
          </Link>
        </Stack>
      </Section>

      <Section>
        <Card>
          <Stack gap="md">
            <Heading level={2}>Get started</Heading>
            <CodeBlock
              code={`npm install rebar-ui @rebar-ui/theme-sketch

import "rebar-ui/style.css";
import "@rebar-ui/theme-sketch/theme.css";
import { Button } from "rebar-ui";

<html data-rebar-theme="sketch">
  <Button variant="primary">Ship it</Button>
</html>`}
            />
            <Stack direction="row" gap="md">
              <Link href="/about">
                <Button variant="primary">Read the docs</Button>
              </Link>
              <Link href="/about/agent">
                <Button variant="secondary">Browse the tiers</Button>
              </Link>
            </Stack>
          </Stack>
        </Card>
      </Section>
    </>
  );
}
