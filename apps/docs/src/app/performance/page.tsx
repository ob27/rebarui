import Link from "next/link";
import { Alert, Box, Heading, Stack, Text } from "rebar-ui";

const EXAMPLE_GROUPS = [
  {
    tier: "Simple",
    example: "A settings form — a handful of fields, one submit action.",
  },
  {
    tier: "Composite",
    example: "A list view with filters, a modal, and inline validation.",
  },
  {
    tier: "Complex",
    example: "A multi-step wizard: table + form + confirmation dialog + tabs.",
  },
];

export default function PerformancePage() {
  return (
    <Box as="main" style={{ maxWidth: 800, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="lg">
        <Stack gap="sm">
          <Heading level={1}>Performance</Heading>
          <Text color="secondary">
            The actual argument for building this way, made with real numbers instead of just a
            model: comparative token-cost runs, building the same UI twice — once against Ant
            Design directly, once with Rebar and a single migration pass — and measuring what it
            actually cost.
          </Text>
        </Stack>

        <Alert type="info" title="Methodology planned, not run yet">
          Nothing on this page is a result. The{" "}
          <Link href="/docs/token-estimate">token estimate</Link> in DevTools is a documented
          model with stated assumptions — useful today, but a model, not a measurement. This page
          describes the real comparative benchmark that will eventually replace it, and its
          current status honestly: not built.
        </Alert>

        <Stack gap="sm">
          <Heading level={2}>Why this needs to be a real run, not another model</Heading>
          <Text size="sm">
            The <Link href="/docs/token-estimate">token estimate</Link> already makes the
            theoretical case: building directly against a real design system re-pays a
            styling/constraint tax on every logic iteration, while a headless build pays that cost
            exactly once, at migration. That&apos;s a model with editable constants. The stronger
            version of the same claim is empirical: build the same thing twice, under real
            conditions, and count what it actually costs — no assumed iteration count, no
            estimated tax, just measured token usage from two real build runs.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Heading level={2}>Planned methodology</Heading>
          <Text size="sm">
            For each example group below, two conditions, same target UI, same starting prompt
            structure:
          </Text>
          <Text size="sm">
            <strong>Condition A — AntD direct.</strong> Build the UI against Ant Design components
            from the first line of code.
            <br />
            <strong>Condition B — Rebar, then migrate once.</strong> Build the same UI headless
            with Rebar, then run <code>@rebar-ui/migrate-antd</code> (or the migration prompt where
            the codemod doesn&apos;t cover a component) exactly once at the end.
          </Text>
          <Text size="sm" color="secondary">
            Real token usage captured from the actual build runs, not estimated after the fact.
            Repeated across a spread of example groups so the comparison holds up across
            complexity levels, not just one convenient case:
          </Text>
          <Stack gap="xs">
            {EXAMPLE_GROUPS.map((group) => (
              <Text key={group.tier} size="sm">
                <strong>{group.tier}</strong> — {group.example}
              </Text>
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <Heading level={2}>What has to happen before this can run</Heading>
          <Text size="sm">
            The example groups above need enough of the component library actually built to be
            representative — the complex-tier example alone touches half a dozen component types.
            Tier 1 (see <Link href="/components">Components</Link>) covers the common,
            Radix-backed components; Tiers 2 and 3 of the{" "}
            <Link href="/docs/migration">AntD parity effort</Link> aren&apos;t built yet. Running
            the benchmark before then would mean picking artificially narrow examples just to fit
            what exists — exactly the kind of result-shopping this page exists to avoid.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
