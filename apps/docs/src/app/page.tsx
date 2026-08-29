import Link from "next/link";
import { Alert, Box, Button, Card, Dialog, Heading, Input, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";

const FEATURES = [
  {
    title: "Headless & accessible",
    body: "Radix UI underneath every interactive component — full keyboard navigation and ARIA compliance out of the box, not bolted on later.",
  },
  {
    title: "Built to be replaced",
    body: "Every visual value is a CSS variable. Re-skin sketch → your real design system by swapping a theme, not rewriting components.",
  },
  {
    title: "Playwright-proof",
    body: "data-rebar-* attributes and ARIA-first testing mean your tests survive the re-skin, because they were never coupled to the sketch look.",
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

export default function Home() {
  return (
    <Box as="main" style={{ maxWidth: 880, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="2xl">
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading level={1}>Rebar UI</Heading>
            <Text size="md" color="secondary">
              Headless-first, intentionally low-fidelity React components. Build functional,
              accessible UI in minutes. When you&apos;re ready for production, re-skin it — the
              structure, accessibility, and tests don&apos;t change.
            </Text>
            <Box
              as="code"
              style={{
                display: "inline-block",
                padding: "var(--rebar-space-sm) var(--rebar-space-md)",
                background: "var(--rebar-color-bg-secondary, #f5f5f5)",
                borderRadius: 4,
                fontFamily: "monospace",
                width: "fit-content",
              }}
            >
              npm install rebar-ui
            </Box>
          </Stack>

          <LivePreview>
            <Stack gap="sm">
              <Text size="sm" color="secondary">
                Same component tree, toggled live — no code changes, just a theme swap.
              </Text>
              <Stack direction="row" gap="sm">
                <Button variant="primary">Save changes</Button>
                <Button variant="secondary">Cancel</Button>
              </Stack>
            </Stack>
          </LivePreview>
        </Stack>

        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap" }}>
          {FEATURES.map((feature) => (
            <Card key={feature.title} style={{ flex: "1 1 240px" }}>
              <Stack gap="xs">
                <Heading level={3}>{feature.title}</Heading>
                <Text size="sm" color="secondary">
                  {feature.body}
                </Text>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Stack gap="md">
          <Heading level={2}>See it work</Heading>
          <Text size="sm" color="secondary">
            A form and a confirmation dialog — composite components, not just a button, still
            surviving the toggle.
          </Text>
          <LivePreview>
            <Stack gap="md">
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

        <Stack gap="md">
          <Heading level={2}>Three pillars</Heading>
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

        <Alert type="info" title="Work in progress">
          v0.1 — 30 components, the DevTools panel (with a live three-way token estimate), and
          the AntD migration adapter are built and tested. See{" "}
          <Link href="/status">/status</Link> for the full build checklist.
        </Alert>
      </Stack>
    </Box>
  );
}
