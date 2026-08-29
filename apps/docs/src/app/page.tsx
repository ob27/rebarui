import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Box, Button, Card, Dialog, Heading, Input, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";

const MICRO_FEATURES = [
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

const PILLARS = [
  {
    title: "Design Heuristics",
    body: "Spacing, type scale, color, and interaction defaults baked in — cited to Nielsen, Shneiderman, Material, Carbon, and USWDS, not invented. Published standalone as HEURISTICS.md for any project.",
    href: "/docs/theming",
    cta: "Read the heuristics",
  },
  {
    title: "Design Components",
    body: "30 components and counting, working toward full Ant Design v5 parity — real Radix primitives, tested, with a migration path back to AntD (or anywhere else) built in from day one.",
    href: "/components",
    cta: "Browse components",
  },
  {
    title: "Performance",
    body: "The actual argument for building this way: comparative token-cost runs, AntD-direct vs. Rebar-then-migrate, across simple and complex component groups.",
    href: "/performance",
    cta: "See the methodology",
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
            Headless-first, intentionally low-fidelity React components. Build functional,
            accessible UI in minutes. When you&apos;re ready for production, re-skin it — the
            structure, accessibility, and tests don&apos;t change.
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

          <Stack direction="row" gap="xl" style={{ flexWrap: "wrap", justifyContent: "center", paddingTop: "var(--rebar-space-md)" }}>
            {MICRO_FEATURES.map((feature) => (
              <Stack key={feature.title} gap="xs" style={{ maxWidth: 200, textAlign: "center" }}>
                <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                  {feature.title}
                </Text>
                <Text size="xs" color="secondary">
                  {feature.body}
                </Text>
              </Stack>
            ))}
          </Stack>
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

      <Section>
        <Stack gap="xl">
          <SectionHeader
            kicker="Rich components"
            title="Composite components, not just a button"
            subtitle="A form and a confirmation dialog — still surviving the toggle."
          />
          <LivePreview>
            <Stack gap="md" style={{ maxWidth: 360, margin: "0 auto" }}>
              <label>
                <Stack gap="xs">
                  <Text as="span" size="sm">
                    Email
                  </Text>
                  <Input type="email" placeholder="you@example.com" />
                </Stack>
              </label>
              <Stack direction="row" gap="sm">
                <Button variant="primary">Submit</Button>
                <Dialog
                  trigger={<Button variant="destructive">Delete account</Button>}
                  title="Delete account"
                  description="This cannot be undone."
                  footer={
                    <>
                      <Button variant="secondary">Cancel</Button>
                      <Button variant="destructive">Delete</Button>
                    </>
                  }
                >
                  <Text size="sm">All of your data will be permanently removed.</Text>
                </Dialog>
              </Stack>
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
          <Stack direction="row" gap="lg" style={{ flexWrap: "wrap" }}>
            {PILLARS.map((pillar) => (
              <Card key={pillar.title} style={{ flex: "1 1 260px" }}>
                <Stack gap="sm">
                  <Heading level={3}>{pillar.title}</Heading>
                  <Text size="sm" color="secondary">
                    {pillar.body}
                  </Text>
                  <Link href={pillar.href}>
                    <Button variant="secondary" size="sm">
                      {pillar.cta}
                    </Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </Stack>
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
