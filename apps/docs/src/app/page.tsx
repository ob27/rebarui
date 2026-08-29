import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Box, Button, Card, Heading, Stack, Text } from "rebar-ui";
import { BlockRenderer, type FeatureGridItem, type PillarGridItem } from "@rebar-ui/placement";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// This homepage is itself built partly through the placement layer, not just hand-authored Rebar
// components — the feature row and three-pillars grid below are `BlockRenderer` output from a
// `feature-grid`/`pillar-grid` document, the same mechanism /benchmarks measures. Proof-by-
// existence, per ref/MARKETING_SITE.md: this site really is built the way it says Rebar is meant
// to be used, not just described that way.

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

const PILLARS: PillarGridItem[] = [
  {
    title: "Design Heuristics",
    body: "Spacing, type scale, color, and interaction defaults baked in — cited to Nielsen, Shneiderman, Material, Carbon, and USWDS, not invented. Published standalone as HEURISTICS.md for any project.",
    href: "/docs/theming",
    cta: "Read the heuristics",
  },
  {
    title: "Design Components",
    body: "30 components and counting, working toward full Ant Design v6 parity — real Radix primitives, tested, with a migration path back to AntD (or anywhere else) built in from day one.",
    href: "/components",
    cta: "Browse components",
  },
  {
    title: "Benchmarks",
    body: "The actual argument for building this way, measured: AntD direct vs. Rebar built through its placement layer — cheaper, faster, and far more visually consistent, both from a text prompt and from a screenshot.",
    href: "/benchmarks",
    cta: "See the numbers",
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

function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack gap="sm" style={{ alignItems: "center", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <Text
        size="sm"
        color="secondary"
        style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "var(--rebar-font-weight-semibold)" }}
      >
        {kicker}
      </Text>
      <Heading level={2}>{title}</Heading>
      <Text color="secondary">{subtitle}</Text>
    </Stack>
  );
}

export default function Home() {
  return (
    <>
      <Section>
        <Stack gap="lg" style={{ alignItems: "center", textAlign: "center" }}>
          <Box
            style={{
              display: "inline-block",
              padding: "var(--rebar-space-xs) var(--rebar-space-md)",
              background: "var(--rebar-color-bg-secondary, #f5f5f5)",
              border: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
              borderRadius: 999,
              fontSize: "var(--rebar-font-size-xs)",
            }}
          >
            🚧 v0.1 — actively building, see <Link href="/status">/status</Link>
          </Box>

          <Heading level={1} style={{ fontSize: 56, lineHeight: 1.1 }}>
            Rebar UI
          </Heading>
          <Text size="md" color="secondary" style={{ maxWidth: 560 }}>
            Headless-first, intentionally low-fidelity React components, built to be built with by
            an LLM through a small placement layer — not hand-authored. Cheapest while your UI is
            still volatile; when flows settle and you&apos;re ready for production, migrate once to
            a real design system — the structure, accessibility, and tests don&apos;t change.
          </Text>

          <Stack direction="row" gap="sm">
            <Link href="/docs/getting-started">
              <Button variant="primary" size="lg">
                Getting Started
              </Button>
            </Link>
            <Link href="/docs/theming">
              <Button variant="secondary" size="lg">
                Design Heuristics
              </Button>
            </Link>
          </Stack>

          <Box
            as="code"
            style={{
              display: "inline-block",
              padding: "var(--rebar-space-sm) var(--rebar-space-md)",
              background: "var(--rebar-color-bg-secondary, #f5f5f5)",
              borderRadius: 4,
              fontFamily: "monospace",
            }}
          >
            npm install rebar-ui
          </Box>

          <Box style={{ paddingTop: "var(--rebar-space-md)" }}>
            <BlockRenderer blocks={[{ type: "feature-grid", items: MICRO_FEATURES }]} />
          </Box>
        </Stack>
      </Section>

      <Section tone="muted">
        <Stack gap="xl">
          <SectionHeader
            kicker="Theme customization"
            title="Sketch today, anything tomorrow"
            subtitle="Same component tree, toggled live — no code changes, just a theme swap."
          />
          <LivePreview>
            <Stack direction="row" gap="sm" style={{ justifyContent: "center" }}>
              <Button variant="primary">Save changes</Button>
              <Button variant="secondary">Cancel</Button>
            </Stack>
          </LivePreview>
        </Stack>
      </Section>

      <Section tone="muted">
        <Stack gap="xl">
          <SectionHeader
            kicker="Three pillars"
            title="Heuristics, components, and proof"
            subtitle="The design defaults, the library that implements them, and the argument that building this way actually saves time and tokens."
          />
          <NextBlockRenderer blocks={[{ type: "pillar-grid", items: PILLARS }]} />
        </Stack>
      </Section>

      <Section>
        <Card>
          <Stack gap="md">
            <Heading level={2}>Get started</Heading>
            <Box
              as="pre"
              style={{
                background: "var(--rebar-color-bg-secondary, #f5f5f5)",
                padding: "var(--rebar-space-md)",
                borderRadius: 4,
                overflowX: "auto",
                margin: 0,
              }}
            >
              <code>{`npm install rebar-ui @rebar-ui/theme-sketch

import "rebar-ui/style.css";
import "@rebar-ui/theme-sketch/theme.css";
import { Button } from "rebar-ui";

<html data-rebar-theme="sketch">
  <Button variant="primary">Ship it</Button>
</html>`}</code>
            </Box>
            <Stack direction="row" gap="md">
              <Link href="/docs/getting-started">
                <Button variant="primary">Read the docs</Button>
              </Link>
              <Link href="/components">
                <Button variant="secondary">Browse components</Button>
              </Link>
            </Stack>
          </Stack>
        </Card>
      </Section>
    </>
  );
}
