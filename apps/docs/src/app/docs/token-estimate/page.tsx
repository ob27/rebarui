import { Box, Heading, Stack, Text } from "rebar-ui";

function Code({ children }: { children: string }) {
  return (
    <Box
      as="pre"
      style={{
        background: "var(--rebar-color-bg-secondary, #f5f5f5)",
        padding: "var(--rebar-space-md)",
        borderRadius: 4,
        overflowX: "auto",
      }}
    >
      <code>{children}</code>
    </Box>
  );
}

export default function TokenEstimatePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>The token estimate: methodology and assumptions</Heading>
      <Text color="secondary">
        The DevTools panel (🔧) shows three numbers: build against AntD directly, build with
        Rebar alone, and build with Rebar then migrate once. This page is the full, honest
        accounting of how those numbers are computed — a documented estimation{" "}
        <strong>model</strong> with stated, editable assumptions, not a measured cost. The source
        is <code>packages/devtools/src/tokenEstimate.ts</code>, short enough to read end to end
        yourself.
      </Text>

      <Stack gap="sm">
        <Heading level={2}>What each number represents</Heading>
        <Text size="sm">
          <strong>AntD, built directly</strong> — authoring every component against AntD&apos;s
          real API from the start, paying a small &quot;reconciliation tax&quot; on{" "}
          <em>every</em> logic iteration to keep the code working against AntD&apos;s specific
          prop names, component shape, and visual rules.
          <br />
          <strong>Rebar only</strong> — authoring headless: no visual decisions, so no tax on any
          iteration. This is the cost of getting the logic right, full stop.
          <br />
          <strong>Rebar, then migrate once</strong> — Rebar-only cost, plus a single one-time
          migration pass at the end (via <code>@rebar-ui/migrate-antd</code> where it applies, or
          the manual/LLM-assisted <code>MIGRATION_PROMPT.md</code> path where it doesn&apos;t).
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>The formula</Heading>
        <Code>{`for each component type on the page, with count N and complexity tier T:

  base        = BASE_AUTHORING_COST[T] × N        // first-time authoring, headless
  antdTax     = ANTD_ITERATION_TAX[T] × N × iterations

  antdDirect       += base + antdTax
  rebarOnly        += base
  migrationCost    += codemodSupported(type)
                        ? CODEMOD_REVIEW_COST × N                        // cheap, mechanical
                        : base × MANUAL_MIGRATION_MULTIPLIER             // LLM-assisted rework

  rebarThenMigrate = rebarOnly + migrationCost`}</Code>
        <Text size="sm" color="secondary">
          <code>iterations</code> is the one assumption you set yourself, in the panel — how many
          rounds of logic changes you expect before this UI is done. There&apos;s no correct
          default; it&apos;s genuinely project-specific, which is why it&apos;s an input, not a
          constant.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>The constants, and the reasoning behind each</Heading>
        <Text size="sm">
          <strong>Base authoring cost</strong> (tokens to write one instance of a component the
          first time, headless — no styling decisions): simple 30, medium 80, complex 150. These
          track the same simple/medium/complex tiers used for the DevTools panel&apos;s
          Low/Medium/High migration-effort estimate.
        </Text>
        <Text size="sm">
          <strong>AntD per-iteration tax</strong> (extra tokens paid on <em>each</em> logic
          iteration when building directly against AntD, reconciling the change with AntD&apos;s
          specific API): simple 10, medium 25, complex 50. This is the number that operationalizes
          Rebar&apos;s core thesis — it&apos;s zero for the headless path and compounds with every
          iteration for the direct-AntD path, which is exactly the argument made on the{" "}
          <a href="/docs">Introduction page</a>.
        </Text>
        <Text size="sm">
          <strong>Migration cost</strong>: components <code>@rebar-ui/migrate-antd</code> actually
          handles (see its README for the exact list) cost a flat 5 tokens — reviewing an
          auto-generated diff. Everything else falls to the manual/LLM path, modeled as 1.5× that
          component&apos;s own base authoring cost — restructuring already-correct code with
          semantic judgment is cheaper than a from-scratch build, but not free.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>What this is not claiming</Heading>
        <Text size="sm" color="secondary">
          This is not a measurement of any real project&apos;s actual token usage — it&apos;s a
          model built from stated, arguable assumptions, computed against the real component
          counts on your page. Change the constants in{" "}
          <code>packages/devtools/src/tokenEstimate.ts</code> if you disagree with them; the model
          is short and the reasoning for each number is written above specifically so you can.
          Treat the comparison as directional evidence for the underlying argument (iteration cost
          compounds against a real design system, a migration is a bounded one-time cost), not as
          a precise cost prediction for your specific project.
        </Text>
      </Stack>
    </Stack>
  );
}
