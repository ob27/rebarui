import Link from "next/link";
import { Box, Heading, Stack, Text } from "rebar-ui";

export default function DevToolsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DevTools</Heading>
      <Text>
        <code>@rebar-ui/devtools</code> is a dev-only floating panel (🔧, bottom-right) showing
        real, computed data about the current page — no fabricated metrics.
      </Text>

      <Stack gap="sm">
        <Heading level={2}>What it shows</Heading>
        <Text size="sm">
          Live component-instance counts by type (found by querying{" "}
          <code>[data-rebar-component]</code> in the DOM, not app-level instrumentation) · a
          sketch/clean theme switch + dark-mode toggle · an 8pt-grid overlay · a hover inspector
          (shows a node&apos;s <code>data-rebar-*</code> metadata) · a bucketed Low/Medium/High
          migration-effort estimate · a JSON export of all of the above.
        </Text>
        <Text size="sm" color="secondary">
          The migration-effort estimate is explicitly a rough heuristic (a weighted score over
          simple/medium/complex component counts) — never a token or dollar figure presented as
          fact.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Token estimate: three ways to build this page</Heading>
        <Text size="sm">
          Below the migration-effort score, the panel computes three numbers from the real
          components on the page: building against AntD directly, building with Rebar alone, and
          building with Rebar then migrating once. An &quot;assumed logic iterations&quot; input
          lets you see how the comparison shifts as you change how many rounds of changes you
          expect — the direct-AntD number grows with it, the Rebar-only number doesn&apos;t.
        </Text>
        <Text size="sm" color="secondary">
          Full methodology, every constant, and the reasoning behind each one:{" "}
          <Link href="/docs/token-estimate">Token estimate methodology</Link>. This is a
          documented model with stated, editable assumptions — not a measured cost, and the page
          says so explicitly.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Mounting it correctly (this matters)</Heading>
        <Text size="sm" color="secondary">
          The panel checks <code>NODE_ENV === &apos;development&apos;</code> internally, but
          that&apos;s not enough on its own to keep it out of your production bundle — verified
          against a real production build, not assumed. Bundlers generally fold a literal{" "}
          <code>process.env.NODE_ENV</code> check in your own app code, but don&apos;t reliably
          extend that into bundled dependencies. Gate the import yourself instead:
        </Text>
        <Box
          as="pre"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          <code>{`"use client";
import dynamic from "next/dynamic";

const RebarDevTools =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@rebar-ui/devtools").then((m) => m.RebarDevTools), { ssr: false })
    : () => null;`}</code>
        </Box>
        <Text size="sm" color="secondary">
          This is exactly what this site does (<code>src/components/DevToolsMount.tsx</code>) —
          confirmed by grepping the production build afterward and finding zero DevTools code.
        </Text>
      </Stack>
    </Stack>
  );
}
