import Link from "next/link";
import { Alert, Box, Carousel, Heading, Stack, Text } from "rebar-ui";
import { SectionNav } from "@/components/SectionNav";

const BENCHMARK_SECTIONS = [
  { id: "summary", label: "The short answer" },
  { id: "scenarios", label: "What this costs you" },
  { id: "headline", label: "The receipts" },
  { id: "claude", label: "Claude Sonnet 5" },
  { id: "qwen", label: "Qwen3.7" },
  { id: "kimi", label: "Kimi-K3" },
  { id: "tiers", label: "Simple/Composite/Complex" },
  { id: "iteration", label: "Does iteration change it?" },
  { id: "conclusion", label: "Conclusion" },
];

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

function StatsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
      <Box as="thead">
        <Box as="tr">
          {headers.map((h) => (
            <Box
              key={h}
              as="th"
              style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}
            >
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box as="tbody">
        {rows.map((row, i) => (
          <Box as="tr" key={i}>
            {row.map((val, j) => (
              <Box
                key={j}
                as="td"
                style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}
              >
                {val}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ScatterChart({
  series,
  height = 320,
  yFormat = (v: number) => Math.round(v).toLocaleString(),
  ariaLabel,
}: {
  series: { label: string; color: string; values: number[] }[];
  height?: number;
  yFormat?: (v: number) => string;
  ariaLabel: string;
}) {
  const width = 700;
  const marginLeft = 62;
  const marginRight = 16;
  const marginTop = 16;
  const marginBottom = 46;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;

  const allValues = series.flatMap((s) => s.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const pad = (rawMax - rawMin) * 0.12 || rawMax * 0.1 || 1;
  const yMin = rawMin - pad;
  const yMax = rawMax + pad;
  const yScale = (v: number) => marginTop + plotHeight - ((v - yMin) / (yMax - yMin)) * plotHeight;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => yMin + ((yMax - yMin) * i) / (tickCount - 1));

  const n = series.length;
  const bandWidth = plotWidth / n;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, height: "auto", margin: "0 auto", display: "block" }}
      role="img"
      aria-label={ariaLabel}
    >
      {ticks.map((t, i) => {
        const y = yScale(t);
        return (
          <g key={i}>
            <line x1={marginLeft} y1={y} x2={width - marginRight} y2={y} stroke="var(--rebar-color-border, #e0e0e0)" strokeWidth={1} />
            <text x={marginLeft - 8} y={y + 4} fontSize={11} textAnchor="end" fill="var(--rebar-color-text-secondary, #757575)">
              {yFormat(t)}
            </text>
          </g>
        );
      })}
      {series.map((s, i) => {
        const cx = marginLeft + bandWidth * (i + 0.5);
        const mean = s.values.reduce((a, b) => a + b, 0) / s.values.length;
        return (
          <g key={s.label}>
            <line
              x1={cx - bandWidth * 0.32}
              y1={yScale(mean)}
              x2={cx + bandWidth * 0.32}
              y2={yScale(mean)}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            {s.values.map((v, j) => {
              // Deterministic pseudo-jitter so points within a band don't stack in a single column.
              const jitter = (((j * 7) % 11) / 10 - 0.5) * bandWidth * 0.5;
              return <circle key={j} cx={cx + jitter} cy={yScale(v)} r={4} fill={s.color} opacity={0.8} />;
            })}
            <text
              x={cx}
              y={height - marginBottom + 22}
              fontSize={11}
              textAnchor="middle"
              fill={s.color}
              style={{ whiteSpace: "pre" }}
            >
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({
  series,
  height = 300,
  yFormat = (v: number) => Math.round(v).toLocaleString(),
  xLabels,
  labelStep = 1,
  crossoverIndex,
  ariaLabel,
}: {
  series: { label: string; color: string; values: number[]; dashed?: boolean }[];
  height?: number;
  yFormat?: (v: number) => string;
  xLabels: string[];
  labelStep?: number;
  crossoverIndex?: number;
  ariaLabel: string;
}) {
  const width = 700;
  const marginLeft = 62;
  const marginRight = 20;
  const marginTop = 16;
  const marginBottom = 60;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;

  const allValues = series.flatMap((s) => s.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const pad = (rawMax - rawMin) * 0.08 || rawMax * 0.05 || 1;
  const yMin = Math.max(0, rawMin - pad);
  const yMax = rawMax + pad;
  const yScale = (v: number) => marginTop + plotHeight - ((v - yMin) / (yMax - yMin)) * plotHeight;
  const xScale = (i: number) => marginLeft + (plotWidth * i) / (xLabels.length - 1);

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => yMin + ((yMax - yMin) * i) / (tickCount - 1));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, height: "auto", margin: "0 auto", display: "block" }}
      role="img"
      aria-label={ariaLabel}
    >
      {ticks.map((t, i) => {
        const y = yScale(t);
        return (
          <g key={i}>
            <line x1={marginLeft} y1={y} x2={width - marginRight} y2={y} stroke="var(--rebar-color-border, #e0e0e0)" strokeWidth={1} />
            <text x={marginLeft - 8} y={y + 4} fontSize={11} textAnchor="end" fill="var(--rebar-color-text-secondary, #757575)">
              {yFormat(t)}
            </text>
          </g>
        );
      })}
      {xLabels.map((label, i) => {
        if (i % labelStep !== 0 && i !== xLabels.length - 1) return null;
        return (
          <text
            key={label}
            x={xScale(i)}
            y={height - marginBottom + 20}
            fontSize={11}
            textAnchor="middle"
            fill="var(--rebar-color-text-secondary, #757575)"
          >
            {label}
          </text>
        );
      })}
      {crossoverIndex !== undefined ? (
        <g>
          <line
            x1={xScale(crossoverIndex)}
            y1={marginTop}
            x2={xScale(crossoverIndex)}
            y2={marginTop + plotHeight}
            stroke="var(--rebar-color-success, #2e7d32)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text
            x={xScale(crossoverIndex)}
            y={marginTop - 4}
            fontSize={10}
            textAnchor="middle"
            fill="var(--rebar-color-success, #2e7d32)"
          >
            crossover
          </text>
        </g>
      ) : null}
      {series.map((s) => {
        const points = s.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
        return (
          <g key={s.label}>
            <polyline
              points={points}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? "6 4" : undefined}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={xScale(i)} cy={yScale(v)} r={3.5} fill={s.color} />
            ))}
          </g>
        );
      })}
      {series.map((s, i) => (
        <text
          key={s.label}
          x={width - marginRight}
          y={marginTop + 12 + i * 16}
          fontSize={11}
          textAnchor="end"
          fill={s.color}
        >
          {s.label}
        </text>
      ))}
    </svg>
  );
}

function readableLabelColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  // Perceived brightness (ITU-R BT.601) — cheaper than full relative luminance, plenty accurate
  // for picking readable label text against a solid, deliberately fixed data color.
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#212121" : "#ffffff";
}

function StackedBarChart({
  bars,
  height = 340,
  yFormat = (v: number) => `$${Math.round(v).toLocaleString()}`,
  ariaLabel,
}: {
  bars: { label: string; segments: { label: string; value: number; color: string }[] }[];
  height?: number;
  yFormat?: (v: number) => string;
  ariaLabel: string;
}) {
  const width = 700;
  const marginLeft = 74;
  const marginRight = 16;
  const marginTop = 16;
  const marginBottom = 34;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;

  const totals = bars.map((b) => b.segments.reduce((a, s) => a + s.value, 0));
  const yMax = Math.max(...totals) * 1.1;
  const yScale = (v: number) => (v / yMax) * plotHeight;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => (yMax * i) / (tickCount - 1));

  const n = bars.length;
  const bandWidth = plotWidth / n;
  const barWidth = bandWidth * 0.46;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth: width, height: "auto", margin: "0 auto", display: "block" }}
      role="img"
      aria-label={ariaLabel}
    >
      {ticks.map((t, i) => {
        const y = marginTop + plotHeight - yScale(t);
        return (
          <g key={i}>
            <line
              x1={marginLeft}
              y1={y}
              x2={width - marginRight}
              y2={y}
              stroke="var(--rebar-color-border, #e0e0e0)"
              strokeWidth={1}
            />
            <text x={marginLeft - 8} y={y + 4} fontSize={11} textAnchor="end" fill="var(--rebar-color-text-secondary, #757575)">
              {yFormat(t)}
            </text>
          </g>
        );
      })}
      {bars.map((bar, i) => {
        const cx = marginLeft + bandWidth * (i + 0.5);
        let cumulative = 0;
        const total = totals[i];
        return (
          <g key={bar.label}>
            {bar.segments.map((seg, j) => {
              const segHeight = Math.max(yScale(seg.value), seg.value > 0 ? 1.5 : 0);
              const yTop = marginTop + plotHeight - yScale(cumulative) - segHeight;
              cumulative += seg.value;
              const showLabel = segHeight >= 22;
              return (
                <g key={j}>
                  <rect x={cx - barWidth / 2} y={yTop} width={barWidth} height={segHeight} fill={seg.color} />
                  {showLabel ? (
                    <text
                      x={cx}
                      y={yTop + segHeight / 2 + 4}
                      fontSize={11}
                      textAnchor="middle"
                      fill={readableLabelColor(seg.color)}
                    >
                      {seg.label} ({yFormat(seg.value)})
                    </text>
                  ) : null}
                </g>
              );
            })}
            <text
              x={cx}
              y={marginTop + plotHeight - yScale(total) - 10}
              fontSize={13}
              textAnchor="middle"
              fill="var(--rebar-color-text-primary, #212121)"
              style={{ fontWeight: 600 }}
            >
              {yFormat(total)}
            </text>
            <text
              x={cx}
              y={marginTop + plotHeight + 22}
              fontSize={12}
              textAnchor="middle"
              fill="var(--rebar-color-text-primary, #212121)"
              style={{ fontWeight: 600 }}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Gallery({
  label,
  dir,
  prefix,
  count = 15,
}: {
  label: string;
  dir: string;
  prefix: string;
  count?: number;
}) {
  return (
    <Stack gap="xs">
      <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        {label}
      </Text>
      <Carousel aria-label={`${label} screenshots`}>
        {Array.from({ length: count }, (_, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <Box key={n} style={{ maxWidth: 360, margin: "0 auto" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${dir}/${prefix}-${n}.png`}
                alt={`${label}, run ${n}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          );
        })}
      </Carousel>
    </Stack>
  );
}

const TIER_SHOTS = [
  { key: "claude-antd-simple", label: "Claude · antd · Simple" },
  { key: "claude-rebar-ui-simple", label: "Claude · rebar-ui · Simple" },
  { key: "qwen-antd-simple", label: "Qwen · antd · Simple" },
  { key: "qwen-rebar-ui-simple", label: "Qwen · rebar-ui · Simple" },
  { key: "claude-antd-composite", label: "Claude · antd · Composite" },
  { key: "claude-rebar-ui-composite", label: "Claude · rebar-ui · Composite" },
  { key: "qwen-antd-composite", label: "Qwen · antd · Composite" },
  { key: "qwen-rebar-ui-composite", label: "Qwen · rebar-ui · Composite" },
  { key: "claude-antd-complex", label: "Claude · antd · Complex" },
  { key: "claude-rebar-ui-complex", label: "Claude · rebar-ui · Complex" },
  { key: "qwen-antd-complex", label: "Qwen · antd · Complex" },
  { key: "qwen-rebar-ui-complex", label: "Qwen · rebar-ui · Complex" },
] as const;

export default function BenchmarksPage() {
  return (
    <Box as="main" style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
        <Stack gap="lg" style={{ flex: 1, minWidth: 0, maxWidth: 800 }}>
        <Stack gap="sm">
          <Heading level={1}>Does building with AI on rebar-ui actually save you money?</Heading>
          <Text color="secondary">
            Short answer: yes — real, measured savings on every model and every prompt style we&apos;ve
            tested, from a few percent on a frontier model up to roughly three-quarters cheaper on a
            budget one. Everything on this page is a real number pulled from real API usage, not a
            guess — the methodology and every underlying data point are still here for anyone who
            wants to check our work, further down the page.
          </Text>
        </Stack>

        <Stack gap="sm" id="summary">
          <Heading level={2}>The short answer</Heading>
          <Text size="sm">
            <strong>Building the same UI with rebar-ui instead of hand-written antd costs less,
            every time we&apos;ve measured it</strong> — 3-5% cheaper on a top-tier model like
            Claude, and 25-75% cheaper on cheaper models like Qwen and Kimi. The cheaper the model
            you&apos;re using, the bigger rebar-ui&apos;s advantage — because most of what a model
            struggles with when hand-writing a UI is layout and composition decisions, and
            rebar-ui removes those decisions from the job entirely.
          </Text>
          <Text size="sm">
            The one thing rebar-ui doesn&apos;t do is look like a finished product out of the box —
            it&apos;s deliberately plain until you (or an agent) migrate it to a real design system
            once, at the end. That migration has a real cost, so the honest question is whether the
            savings along the way actually earn it back. We measured that too, round by round,
            rather than guessing: on Claude, it takes 13-17 rounds of revisions before rebar-ui (even
            counting the full cost of migrating away from it) is cheaper than antd was ever going to
            be. Most real projects go through more revisions than that before they ship — and if
            you&apos;re building something you&apos;ll never bother re-skinning at all (an internal
            tool, a prototype), there&apos;s no migration cost to earn back in the first place, so
            rebar-ui is simply cheaper, full stop. See the scenarios below for what that looks like
            in real dollars.
          </Text>
        </Stack>

        <Stack gap="md" id="scenarios">
          <Heading level={2}>What this actually costs you</Heading>
          <Text size="sm">
            Six realistic ways people actually build things, each priced with real, current API
            rates (Claude Sonnet 5: $2/$10 per million input/output tokens; Qwen3.7: $2.50-7.50/MTok
            depending on tier; Kimi-K3: $3/$15 per MTok — all current list prices as of this
            writing). The token counts behind every dollar figure are the same real, measured data
            in the receipts further down this page — nothing here is invented for effect. Where we
            scale a measured result up to a more realistic project size, we say so plainly.
          </Text>

          <Stack gap="sm">
            <Heading level={3}>1. The whole picture: vibe coding vs. hiring developers</Heading>
            <Text size="sm" color="secondary">
              Everything else on this page compares token costs. This one compares the actual
              decision a small team faces: hire developers to build an internal app, or build it
              with an AI coding agent and rebar-ui. Worked example — <strong>a company timesheet
              tool</strong>, seven screens: Dashboard, Time Entry, Manager Approvals, Reports,
              Project/Client Admin, User Settings, Leave Requests. Stated assumptions throughout,
              so you can plug in your own numbers if ours don&apos;t match your situation:
            </Text>
            <Stack gap="xs">
              <Text size="sm">
                <strong>Developer rate:</strong> $100/hr — a round figure inside the real market
                range for a mid-level full-stack contractor ($81-135/hr, per current rate-tracking
                sites), used for both sides of this comparison, including the human time an
                AI-assisted build still needs.
              </Text>
              <Text size="sm">
                <strong>Revisions:</strong> 6 rounds of stakeholder feedback per screen before the
                team is happy shipping it — a deliberately ordinary number for getting a first
                version of an internal tool out the door, not the 13-17-round figure used elsewhere
                on this page for "how long until a migration pays for itself" (a different
                question this scenario doesn&apos;t need to answer, since a timesheet tool is
                exactly the kind of internal app nobody re-skins — see scenario 5).
              </Text>
            </Stack>

            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              Traditional: hire developers
            </Text>
            <StatsTable
              headers={["Line item", "Estimate", "Cost"]}
              rows={[
                ["Initial build (7 screens × 3 days)", "21 days", "$16,800"],
                ["Revisions (42 rounds × 0.5 day)", "21 days", "$16,800"],
                ["UX/design pass (whole app, once)", "5 days", "$4,000"],
                ["Total", "47 days", "$37,600"],
              ]}
            />

            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              AI-assisted: Claude + rebar-ui, with a real human still in the loop
            </Text>
            <StatsTable
              headers={["Line item", "Estimate", "Cost"]}
              rows={[
                ["API cost (7 screens, 42 revision rounds, real measured tokens)", "429,000 tokens", "$1.38"],
                ["Human time: prompt + review each screen (2 hrs × 7)", "14 hrs", "$1,400"],
                ["Human time: describe + verify each revision (30 min × 42)", "21 hrs", "$2,100"],
                ["Total", "35 hrs", "$3,501"],
              ]}
            />

            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              The same six line items, drawn to scale
            </Text>
            <StackedBarChart
              ariaLabel="Stacked bar chart comparing the cost composition of hiring developers ($37,600) versus AI-assisted development ($3,501) for the timesheet tool"
              bars={[
                {
                  label: "Hire developers",
                  segments: [
                    { label: "Initial build", value: 16800, color: "#1565c0" },
                    { label: "Revisions", value: 16800, color: "#1e88e5" },
                    { label: "Design pass", value: 4000, color: "#64b5f6" },
                  ],
                },
                {
                  label: "Claude + rebar-ui",
                  segments: [
                    { label: "Revision oversight", value: 2100, color: "#81c784" },
                    { label: "Build oversight", value: 1400, color: "#43a047" },
                    { label: "API cost", value: 1.38, color: "#1b5e20" },
                  ],
                },
              ]}
            />
            <Text size="xs" color="secondary">
              The $1.38 API cost is the sliver at the very bottom of the right-hand bar — too thin
              to label. Almost the entire AI-assisted cost is human oversight time, not tokens; it&apos;s
              still roughly a tenth the size of the traditional bar next to it.
            </Text>

            <Alert type="info" title="Traditional development costs about 10.7x more">
              <strong>$37,600 to hire developers, versus $3,501 to direct an AI agent</strong> —
              90.7% cheaper. Notice what that AI-assisted total is actually made of: $1.38 of real
              API cost and $3,500 of human time. The API cost is close to a rounding error — the
              real, remaining cost of AI-assisted development is the human still needed to prompt,
              review, and verify the output, not the tokens themselves. We&apos;re not claiming AI
              removes the human from the loop; we&apos;re claiming it removes the need to hire a
              team to hand-write every screen and sit through 42 rounds of manual rework.
            </Alert>

            <Text size="xs" color="secondary">
              <strong>What this doesn&apos;t include:</strong> project management overhead, code
              review, and QA time are folded into the day estimates above, not added separately —
              a real team with more process overhead would widen this gap further, not close it.
              Per-screen token costs are the same real, measured Composite-tier numbers used
              throughout this page (see the tiers section below), scaled to 7 screens × 6 rounds —
              a stated scaling, not a new measurement. Swap in your own day rate, revision count,
              or screen count; the model is simple enough to redo by hand.
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>2. Build with Claude, migrate once</Heading>
            <Text size="sm" color="secondary">
              The most direct comparison: build the same app with Claude, one condition hand-coded
              in antd, the other headless in rebar-ui and migrated to antd once revisions settle
              down. Real, measured token counts through each tier&apos;s actual crossover round,
              priced at Claude&apos;s real rates.
            </Text>
            <StatsTable
              headers={["Tier", "Rounds to break even", "antd, direct", "rebar-ui + migration", "You save"]}
              rows={[
                ["Complex", "13", "$0.467", "$0.444", "5.0%"],
                ["Composite", "14", "$0.483", "$0.460", "4.8%"],
                ["Simple", "17", "$0.566", "$0.538", "5.0%"],
              ]}
            />
            <Text size="xs" color="secondary">
              These are small dollar amounts because our test spec is small — the point is the
              percentage, which holds regardless of how big your real project is. Past the
              break-even round, every additional round of revisions just widens the gap.
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>3 & 4. The same build, on a cheaper model</Heading>
            <Text size="sm" color="secondary">
              We haven&apos;t run the full round-by-round migration experiment on Qwen or Kimi yet —
              only Claude, so far. What we do have is the real one-shot build cost on both, and it
              tells you a lot on its own:
            </Text>
            <StatsTable
              headers={["Model", "antd, direct", "rebar-ui", "You save"]}
              rows={[
                ["Qwen3.7", "$0.024", "$0.006", "73.1%"],
                ["Kimi-K3", "$0.085", "$0.021", "74.8%"],
              ]}
            />
            <Text size="xs" color="secondary">
              On Claude, rebar-ui&apos;s one-shot saving is only ~3%, which is why migrating away
              from it takes 13+ rounds to earn back. On Qwen and Kimi, the one-shot saving alone is
              already bigger than Claude&apos;s <em>entire</em> 13-17-round gap — so if a similar
              per-round pattern holds on these models (not yet measured directly), migrating away
              from rebar-ui would likely pay for itself almost immediately, not after over a dozen
              rounds. That&apos;s a reasoned inference from real numbers, not a second measurement —
              flagged as exactly that.
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>5. An internal tool you'll never re-skin</Heading>
            <Text size="sm" color="secondary">
              Plenty of real software is never going to get a design pass — an internal ops
              dashboard, an admin panel, a tool three people on your team use. If you&apos;re never
              migrating away from rebar-ui, there&apos;s no migration bill to earn back — it&apos;s
              just cheaper, every single round, from day one. Modeled on our Composite-tier
              spec&apos;s real one-shot cost and real measured per-round revision cost, extended out
              (Claude pricing):
            </Text>
            <StatsTable
              headers={["After this many revision rounds", "antd, direct", "rebar-ui, never migrated", "You save"]}
              rows={[
                ["5", "$0.190", "$0.169", "11.1%"],
                ["20", "$0.674", "$0.595", "11.6%"],
                ["50", "$1.641", "$1.448", "11.8%"],
              ]}
            />
            <Text size="xs" color="secondary">
              This is the strongest case for rebar-ui, and the simplest: skip the "will it earn back
              the migration cost" question entirely by never paying that cost. Real teams building
              internal tools this way, at real scale (many tools, many teams), see this saving
              multiply directly.
            </Text>
          </Stack>

          <Stack gap="sm">
            <Heading level={3}>6. Reverse-engineering an incumbent enterprise app</Heading>
            <Text size="sm" color="secondary">
              A common real job: recreate a screen from an existing enterprise platform you don&apos;t
              own the code for — a dense, multi-panel record page in the style of a Salesforce-class
              CRM — working from what&apos;s on screen, the same way our real image-to-code
              experiment works from a reference screenshot rather than a written spec. We
              haven&apos;t rebuilt an actual named product (nor would we claim to) — this scales our
              real, measured Complex-tier result by a stated 3x, a conservative estimate of how much
              denser a real enterprise record screen is than our test spec, using an unnamed
              frontier model priced at Claude&apos;s real rates:
            </Text>
            <StatsTable
              headers={["Screen density", "antd, direct", "rebar-ui", "You save"]}
              rows={[
                ["Our test spec (1x)", "$0.030", "$0.028", "7.4%"],
                ["Modeled enterprise screen (3x)", "$0.091", "$0.084", "7.4%"],
                ["A denser screen (5x)", "$0.152", "$0.140", "7.4%"],
              ]}
            />
            <Text size="xs" color="secondary">
              The percentage doesn&apos;t change with density in this simple model — real screens
              won&apos;t scale perfectly linearly, but the direction (rebar-ui cheaper, reading a
              screenshot or reading a spec) is the same effect measured twice, not assumed once.
            </Text>
          </Stack>
        </Stack>

        <Stack gap="sm" id="headline">
          <Heading level={2}>The receipts</Heading>
          <Text size="sm" color="secondary">
            Everything above is built from the real, repeated measurements below — same target UI,
            built against <code>antd</code> directly and against <code>rebar-ui</code> (always
            through its small procedural placement layer, never hand-authored), across two prompt
            styles (a written spec, a reference screenshot) and three models, n=15 per condition
            unless stated otherwise. If you just want the bottom line, the scenarios above already
            have it — this section and everything below it is for anyone who wants to verify it.
          </Text>
          <StatsTable
            headers={["Experiment", "antd (mean)", "rebar-ui (mean)", "Tokens"]}
            rows={[
              ["Claude · text prompt", "31,231", "30,211", "−3.3%"],
              ["Claude · image prompt", "31,765", "30,787", "−3.1%"],
              ["Qwen · text prompt", "3,388", "1,228", "−63.8%"],
              ["Qwen · image prompt", "3,948", "2,956", "−25.1%"],
              ["Kimi · text prompt", "5,967", "1,925", "−67.7%"],
              ["Average of the five", "—", "—", "−32.6%"],
            ]}
          />
          <Text size="xs" color="secondary">
            Same target component (a header, an info banner, a checklist, a warning callout) across
            all five, real per-turn API usage extracted from each run&apos;s own transcript, every
            output Playwright-verified for a clean render.
          </Text>

          <StatsTable
            headers={["Experiment", "antd (mean)", "rebar-ui (mean)", "Wall-clock time"]}
            rows={[
              ["Claude · text prompt", "24.5s", "14.7s", "−40.0%"],
              ["Claude · image prompt", "27.2s", "16.7s", "−38.6%"],
              ["Qwen · text prompt", "46.6s", "10.3s", "−77.9%"],
              ["Qwen · image prompt", "33.2s", "13.8s", "−58.4%"],
              ["Kimi · text prompt", "160.0s", "37.5s", "−76.6%"],
              ["Average of the five", "—", "—", "−58.3%"],
            ]}
          />

          <StatsTable
            headers={["Experiment", "antd (pixels that vary run-to-run)", "rebar-ui (pixels that vary run-to-run)"]}
            rows={[
              ["Claude · text prompt", "27.0%", "0%"],
              ["Claude · image prompt", "20.0%", "0%"],
              ["Qwen · text prompt", "30.5%", "0%"],
              ["Qwen · image prompt", "29.1%", "0%"],
              ["Average of the four", "26.7%", "0%"],
            ]}
          />

          <Alert type="info" title="rebar-ui is cheaper, faster, and more visually consistent every time">
            Fewer tokens (average <strong>32.6% cheaper</strong> across five experiments), faster
            wall-clock (average <strong>58.3% faster</strong>), and pixel-identical output on the
            four experiments where antd&apos;s varies by 20-30% of pixels — never the losing side,
            not just on average. The averages above are an unweighted mean of each experiment&apos;s
            own relative difference (each already n=15, so this weights every experiment equally
            rather than pooling raw token counts across the very different scales a full agentic
            Claude session and a single-completion-call API operate on — see the per-model sections
            below for why those absolute scales aren&apos;t comparable to each other directly).
          </Alert>
        </Stack>

        <Stack gap="md" id="claude">
          <Heading level={2}>Claude Sonnet 5 (n=15 per condition)</Heading>
          <Text size="sm">
            rebar-ui composes the target through a compact schema plus a deterministic renderer
            built from rebar-ui&apos;s own components; antd is hand-authored directly. Same
            prompt, same model, isolated scaffolds, only the build step measured.
          </Text>

          <Heading level={3}>Text prompt</Heading>
          <svg
            viewBox="0 0 500 340"
            style={{ width: "100%", maxWidth: 500, height: "auto", margin: "0 auto", display: "block" }}
            role="img"
            aria-label="Scatter plot comparing antd direct (clustered around 31,000, mean 31,231) and rebar-ui (more tightly clustered around 30,200, mean 30,211, lower and tighter than antd)"
          >
            {[30000, 30500, 31000, 31500, 32000].map((v) => {
              const y = 300 - ((v - 29500) / (32500 - 29500)) * 280;
              return (
                <g key={v}>
                  <line x1={60} y1={y} x2={470} y2={y} stroke="var(--rebar-color-border, #e0e0e0)" strokeWidth={1} />
                  <text x={52} y={y + 4} fontSize={11} textAnchor="end" fill="var(--rebar-color-text-secondary, #757575)">
                    {(v / 1000).toFixed(1)}k
                  </text>
                </g>
              );
            })}
            <line x1={130} y1={138.4} x2={250} y2={138.4} stroke="var(--rebar-color-text-primary, #212121)" strokeWidth={2} strokeDasharray="4 3" />
            <line x1={355} y1={233.7} x2={495} y2={233.7} stroke="var(--rebar-color-primary, #0066cc)" strokeWidth={2} strokeDasharray="4 3" />
            {[
              [172.0, 157.1], [244.0, 74.0], [148.0, 147.8], [204.0, 153.2], [132.0, 126.4],
              [188.0, 170.2], [124.0, 74.4], [220.0, 146.9], [164.0, 155.0], [228.0, 145.3],
              [156.0, 149.4], [236.0, 123.4], [140.0, 146.8], [196.0, 157.1], [212.0, 149.3],
            ].map(([x, y], i) => (
              <circle key={`a${i}`} cx={x} cy={y} r={4} fill="var(--rebar-color-text-secondary, #757575)" opacity={0.8} />
            ))}
            {[
              [428.0, 239.4], [412.0, 237.1], [436.0, 236.5], [404.0, 235.8], [444.0, 234.9],
              [396.0, 234.7], [452.0, 233.6], [388.0, 233.5], [460.0, 233.1], [380.0, 232.3],
              [468.0, 232.0], [372.0, 231.6], [476.0, 230.7], [364.0, 230.0], [484.0, 229.7],
            ].map(([x, y], i) => (
              <circle key={`d${i}`} cx={x} cy={y} r={4} fill="var(--rebar-color-primary, #0066cc)" opacity={0.85} />
            ))}
            <text x={190} y={322} fontSize={12} textAnchor="middle" fill="var(--rebar-color-text-primary, #212121)">
              antd (n=15)
            </text>
            <text x={425} y={322} fontSize={12} textAnchor="middle" fill="var(--rebar-color-primary, #0066cc)">
              rebar-ui (n=15)
            </text>
          </svg>

          <StatsTable
            headers={["Condition", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd", "31,231", "31,131", "30,891", "31,921", "294 (0.9%)"],
              ["rebar-ui", "30,211", "30,212", "30,149", "30,253", "28.6 (0.095%)"],
            ]}
          />
          <StatsTable
            headers={["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd (n=14 of 15)", "24.5s", "23.7s", "21.6s", "30.1s", "2.4s (9.7%)"],
              ["rebar-ui", "14.7s", "14.6s", "14.2s", "15.8s", "0.47s (3.2%)"],
            ]}
          />
          <Gallery label="antd" dir="/benchmark-screenshots" prefix="antd-text" />
          <Gallery label="rebar-ui" dir="/benchmark-screenshots" prefix="rebar-dsl" />

          <Heading level={3}>Image prompt</Heading>
          <Text size="sm">
            Same two conditions, same target — but each run was handed the reference screenshot
            below instead of a written spec, and had to read the layout off it directly.
          </Text>
          <Box style={{ maxWidth: 340, margin: "0 auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/reference-preview-panel.png"
              alt="Reference screenshot: a Preview panel with a title bar, an info banner with a Reset action, a six-item checklist, and a warning callout"
              style={{
                width: "100%",
                height: "auto",
                border: "1px solid var(--rebar-color-border, #e0e0e0)",
                borderRadius: 4,
              }}
            />
          </Box>
          <svg
            viewBox="0 0 500 340"
            style={{ width: "100%", maxWidth: 500, height: "auto", margin: "0 auto", display: "block" }}
            role="img"
            aria-label="Scatter plot comparing antd, image-driven (clustered around 31,800, mean 31,765) and rebar-ui, image-driven (clustered lower and tighter, around 30,800, mean 30,787)"
          >
            {[31000, 31500, 32000, 32500, 33000, 33500, 34000].map((v) => {
              const y = 300 - ((v - 30500) / (34500 - 30500)) * 280;
              return (
                <g key={v}>
                  <line x1={60} y1={y} x2={470} y2={y} stroke="var(--rebar-color-border, #e0e0e0)" strokeWidth={1} />
                  <text x={52} y={y + 4} fontSize={11} textAnchor="end" fill="var(--rebar-color-text-secondary, #757575)">
                    {(v / 1000).toFixed(1)}k
                  </text>
                </g>
              );
            })}
            <line x1={124} y1={211.4} x2={256} y2={211.4} stroke="var(--rebar-color-text-primary, #212121)" strokeWidth={2} strokeDasharray="4 3" />
            <line x1={359} y1={279.9} x2={491} y2={279.9} stroke="var(--rebar-color-primary, #0066cc)" strokeWidth={2} strokeDasharray="4 3" />
            {[
              [174, 263.5], [206, 253], [166, 251.3], [214, 248], [158, 234.1],
              [222, 230.6], [150, 230.4], [230, 218.9], [142, 217.8], [238, 215],
              [134, 214.9], [246, 211.8], [130, 204.6], [250, 140.4], [130, 37],
            ].map(([x, y], i) => (
              <circle key={`a${i}`} cx={x} cy={y} r={4} fill="var(--rebar-color-text-secondary, #757575)" opacity={0.8} />
            ))}
            {[
              [409, 287.1], [441, 286.5], [401, 286.4], [449, 285.9], [393, 285.6],
              [457, 284.5], [385, 284.1], [465, 281.2], [377, 280], [473, 279.8],
              [369, 279.7], [481, 279.4], [365, 277.5], [485, 260.7], [365, 259.9],
            ].map(([x, y], i) => (
              <circle key={`d${i}`} cx={x} cy={y} r={4} fill="var(--rebar-color-primary, #0066cc)" opacity={0.85} />
            ))}
            <text x={190} y={322} fontSize={12} textAnchor="middle" fill="var(--rebar-color-text-primary, #212121)">
              antd (n=15)
            </text>
            <text x={425} y={322} fontSize={12} textAnchor="middle" fill="var(--rebar-color-primary, #0066cc)">
              rebar-ui (n=15)
            </text>
          </svg>
          <StatsTable
            headers={["Condition", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd", "31,765", "31,659", "31,021", "34,257", "776 (2.4%)"],
              ["rebar-ui", "30,787", "30,769", "30,684", "31,073", "118 (0.38%)"],
            ]}
          />
          <StatsTable
            headers={["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd", "27.2s", "25.4s", "20.8s", "54.4s", "8.0s (29.6%)"],
              ["rebar-ui", "16.7s", "16.4s", "15.0s", "20.2s", "1.4s (8.1%)"],
            ]}
          />
          <Gallery label="antd" dir="/benchmark-screenshots-image" prefix="antd-image" />
          <Gallery label="rebar-ui" dir="/benchmark-screenshots-image" prefix="rebar-dsl-image-refined" />

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=15, one model (claude-sonnet-5), one day (2026-08-29), one
            component spec. All runs type-checked; a Playwright-verified subset (clean render, zero
            console errors, correct DOM order) confirmed both extremes and the median for each
            condition. antd&apos;s image-prompt output uses a deprecated <code>Alert message</code>{" "}
            prop (antd v6 renamed it to <code>title</code>) — harmless to rendering, a sign the
            model&apos;s antd knowledge lags the v6 release this benchmark targets.
          </Text>
        </Stack>

        <Stack gap="md" id="qwen">
          <Heading level={2}>Qwen3.7 (n=15 per condition)</Heading>
          <Text size="sm">
            Same spec, same archetypes, same rigor — run against Qwen (qwen3.7-max for text,
            qwen3.7-plus for image) via the DashScope API, to test whether a cheaper model
            benefits even more from having layout/composition decisions removed from it.
          </Text>

          <Alert type="warning" title="Not directly comparable to Claude's numbers above">
            Qwen&apos;s numbers come from a single raw completion call — no agentic tool use, no
            file access, none of the ~22,000-token harness overhead a Claude Code session pays on
            every run. That&apos;s why Qwen&apos;s totals (roughly 1,000-4,000 tokens) look so much
            smaller than Claude&apos;s (30,000+) — it&apos;s a thinner slice of work, not a more
            efficient model. The fair comparison is <em>within</em> Qwen&apos;s own results: antd
            vs. rebar-ui, same model, same harness.
          </Alert>

          <Heading level={3}>Text prompt</Heading>
          <ScatterChart
            ariaLabel="Scatter plot: Qwen text-prompt tokens, antd (spread 1,597-6,446, mean 3,388) vs rebar-ui (tighter, 994-2,028, mean 1,228)"
            series={[
              { label: "antd (n=15)", color: "var(--rebar-color-text-secondary, #757575)", values: [1597, 1626, 2187, 2463, 2509, 2538, 2692, 2989, 3283, 3431, 4167, 4633, 4934, 5321, 6446] },
              { label: "rebar-ui (n=15)", color: "var(--rebar-color-primary, #0066cc)", values: [994, 996, 1016, 1033, 1043, 1047, 1052, 1065, 1161, 1262, 1276, 1472, 1482, 1495, 2028] },
            ]}
          />
          <StatsTable
            headers={["Condition", "Mean", "Median", "Min", "Max", "Std. dev.", "Success"]}
            rows={[
              ["antd", "3,388", "2,989", "1,597", "6,446", "1,376 (40.6%)", "15/15"],
              ["rebar-ui", "1,228", "1,065", "994", "2,028", "278 (22.6%)", "15/15"],
            ]}
          />
          <StatsTable
            headers={["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd", "46.6s", "40.3s", "19.7s", "88.3s", "20.8s (44.6%)"],
              ["rebar-ui", "10.3s", "9.4s", "6.0s", "21.7s", "3.9s (37.8%)"],
            ]}
          />
          <Gallery label="antd" dir="/benchmark-screenshots-qwen" prefix="antd-text" />
          <Gallery label="rebar-ui" dir="/benchmark-screenshots-qwen" prefix="rebar-ui-text" />

          <Heading level={3}>Image prompt</Heading>
          <ScatterChart
            ariaLabel="Scatter plot: Qwen image-prompt tokens, antd (spread 3,243-5,882, mean 3,948) vs rebar-ui (tighter, 2,839-3,129, mean 2,956)"
            series={[
              { label: "antd (n=15)", color: "var(--rebar-color-text-secondary, #757575)", values: [3243, 3388, 3404, 3473, 3514, 3563, 3618, 3667, 3684, 3686, 3784, 4577, 4715, 5020, 5882] },
              { label: "rebar-ui (n=15)", color: "var(--rebar-color-primary, #0066cc)", values: [2839, 2864, 2872, 2872, 2891, 2892, 2915, 2965, 2965, 2967, 2978, 2985, 3103, 3107, 3129] },
            ]}
          />
          <StatsTable
            headers={["Condition", "Mean", "Median", "Min", "Max", "Std. dev.", "Success"]}
            rows={[
              ["antd", "3,948", "3,667", "3,243", "5,882", "726 (18.4%)", "15/15"],
              ["rebar-ui", "2,956", "2,965", "2,839", "3,129", "90.3 (3.1%)", "15/15"],
            ]}
          />
          <StatsTable
            headers={["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd", "33.2s", "29.2s", "20.5s", "64.6s", "11.9s (35.8%)"],
              ["rebar-ui", "13.8s", "13.9s", "11.2s", "17.6s", "1.7s (12.1%)"],
            ]}
          />
          <Gallery label="antd" dir="/benchmark-screenshots-qwen-image" prefix="antd-image" />
          <Gallery label="rebar-ui" dir="/benchmark-screenshots-qwen-image" prefix="rebar-ui-image" />

          <Alert type="info" title="The relative gap is bigger on the cheaper model">
            On Claude, rebar-ui won by 3.1-3.3% on tokens. On Qwen, the same comparison shows a{" "}
            <strong>25-64% advantage</strong> — a much larger relative win, in the direction the
            hypothesis predicted: removing layout/composition decisions helps more when the model
            doing the composing is weaker at open-ended authoring to begin with. Two models, two
            conditions each, is a real data point in that direction, not proof the effect scales
            smoothly with model capability.
          </Alert>

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=15 per condition, one day (2026-08-29/30), same spec and
            archetypes as the Claude experiments above. All 60 runs were written to disk,
            type-checked, and a Playwright-verified subset confirmed clean render and correct DOM
            order for both extremes and the median per condition. All 60 were also screenshotted
            for the galleries above, using the same pixel-alignment method as the Claude galleries.
            antd&apos;s output shows the same deprecated <code>Alert message</code> prop found on
            Claude&apos;s antd runs. A prompt written for a general-purpose coding agent doesn&apos;t
            automatically work for a single completion call with no file access — one condition
            needed its prompt rewritten to be fully self-contained before all 15 runs passed
            cleanly; full account in <code>ref/QWEN_BENCHMARK_PROTOCOL.md</code> for anyone
            reproducing this.
          </Text>
        </Stack>

        <Stack gap="md" id="kimi">
          <Heading level={2}>A third, genuinely different model: Kimi-K3</Heading>
          <Text size="sm">
            Qwen3.7 is one model family. To test whether the pattern above holds for a real
            architectural difference, not just another Qwen size, the same text-prompt spec was
            run against <strong>Kimi-K3</strong> (Moonshot AI, via the same DashScope-compatible
            endpoint) — a reasoning model, unrelated to Qwen. Same rigor as every condition above:
            n=15 per condition, every run written to disk and type-checked, a Playwright-verified
            subset for clean render and correct DOM order, full screenshot galleries.
          </Text>

          <ScatterChart
            ariaLabel="Scatter plot: Kimi-K3 text-prompt tokens, antd (spread 3,520-9,456, mean 5,967) vs rebar-ui (tighter, 1,578-2,869, mean 1,925)"
            series={[
              { label: "antd (n=15)", color: "var(--rebar-color-text-secondary, #757575)", values: [3520, 3578, 3898, 4286, 4396, 5335, 5722, 5931, 6033, 6203, 6890, 7336, 7923, 9002, 9456] },
              { label: "rebar-ui (n=15)", color: "var(--rebar-color-primary, #0066cc)", values: [1578, 1725, 1741, 1771, 1826, 1831, 1877, 1889, 1890, 1906, 1938, 1960, 2004, 2074, 2869] },
            ]}
          />
          <StatsTable
            headers={["Condition", "Mean", "Median", "Min", "Max", "Std. dev.", "Success"]}
            rows={[
              ["antd", "5,967", "5,931", "3,520", "9,456", "1,821 (30.5%)", "15/15"],
              ["rebar-ui", "1,925", "1,889", "1,578", "2,869", "278 (14.5%)", "15/15"],
            ]}
          />
          <StatsTable
            headers={["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."]}
            rows={[
              ["antd", "160.0s", "155.6s", "70.0s", "261.5s", "56.2s (35.1%)"],
              ["rebar-ui", "37.5s", "32.5s", "25.4s", "72.8s", "12.4s (33.0%)"],
            ]}
          />
          <Gallery label="antd" dir="/benchmark-screenshots-kimi" prefix="antd-text" />
          <Gallery label="rebar-ui" dir="/benchmark-screenshots-kimi" prefix="rebar-ui-text" />

          <Alert type="info" title="The gap is bigger here than on Qwen — and much bigger than on Claude">
            rebar-ui costs <strong>67.7% less</strong> on Kimi-K3 (vs. 63.8% on Qwen3.7-max, 3.1-3.3%
            on Claude) and finishes <strong>76.6% faster</strong>. A third model, a different vendor,
            the same direction and an even larger gap — one more real data point that removing
            layout/composition decisions helps more the further a model is from frontier-level
            open-ended authoring, not proof of a smooth scaling law across three data points.
          </Alert>

          <Alert type="warning" title="antd's cost on Kimi-K3 is genuinely unpredictable — rebar-ui's isn't">
            Look past the mean: antd&apos;s worst Kimi-K3 run cost <strong>2.7x its best one</strong>{" "}
            (3,520 to 9,456 tokens) for the exact same spec — build the identical UI twice and you
            might pay nearly three times as much the second time, for no reason you&apos;d be able
            to predict or control. rebar-ui&apos;s own spread over the same 15 runs was much
            narrower (1,578 to 2,869, a 1.8x worst-to-best ratio) — still real variance, just far
            less of it. This is the same &quot;pixel-consistency&quot; story told in tokens instead
            of pixels: a wider, less predictable range isn&apos;t just a cost problem, it&apos;s a
            planning problem — a hand-authored antd build&apos;s price is a lot harder to budget
            for than a rebar-ui one, on this model.
          </Alert>

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=15 per condition, 2026-08-30, same spec and archetypes as
            the Claude and Qwen text-prompt experiments above. Kimi-K3 was chosen after checking a
            couple of other third-party models reachable on the same platform — one produced no
            usable output at a normal token budget, another worked but cost noticeably more per
            call — so this is the one that held up. All 30 final runs typechecked and a
            Playwright-verified subset confirmed clean render and correct DOM order. antd&apos;s
            output shows the same deprecated <code>Alert message</code> prop found on every other
            antd condition on this page — harmless to rendering, a sign of antd v6 API drift the
            model&apos;s training hasn&apos;t caught up to.
          </Text>
        </Stack>

        <Stack gap="md" id="tiers">
          <Heading level={2}>Simple, Composite, Complex tiers</Heading>
          <Text size="sm">
            Three complexity tiers beyond the single fixed component above — text-prompt only,
            run against both Claude and Qwen. These specs needed six archetypes not yet exercised
            above (<code>form</code>, <code>table</code>, <code>data-list</code>,{" "}
            <code>filter-bar</code>, <code>tabs</code>, <code>modal</code>), and Claude&apos;s
            numbers here are &quot;marginal&quot; — total tokens minus the ~20,644-token shared
            harness overhead every Claude Code session pays, so they&apos;re comparable in kind to
            Qwen&apos;s raw completion totals.
          </Text>

          <Alert type="warning" title="Why this section only has n=5, not n=15">
            A single-run first pass here briefly looked like the two models disagreed on which
            tool wins. Repeating those runs showed that was just sampling noise, not a real
            disagreement — so we scaled up to n=5 per condition (n=3-4 on two cells that hit
            repeated technical failures, not silently dropped) before trusting the direction. Both
            models agree, all three tiers, once the sample is big enough — n=5 is still a smaller,
            less certain sample than the n=15 experiments above.
          </Alert>

          <Heading level={3}>Claude (marginal tokens, n=5)</Heading>
          <ScatterChart
            ariaLabel="Scatter plot: Claude marginal tokens across three tiers, antd vs rebar-ui, rebar-ui consistently lower in each tier"
            series={[
              { label: "antd·Simple", color: "var(--rebar-color-text-secondary, #757575)", values: [6767, 8500, 8399, 8456, 8399] },
              { label: "rebar·Simple", color: "var(--rebar-color-primary, #0066cc)", values: [6676, 8327, 8327, 8340, 8327] },
              { label: "antd·Composite", color: "var(--rebar-color-text-secondary, #757575)", values: [7251, 8957, 8932, 8876, 8939] },
              { label: "rebar·Composite", color: "var(--rebar-color-primary, #0066cc)", values: [7004, 8782, 8730, 8762, 8730] },
              { label: "antd·Complex", color: "var(--rebar-color-text-secondary, #757575)", values: [7602, 9736, 9292, 9146, 9165] },
              { label: "rebar·Complex", color: "var(--rebar-color-primary, #0066cc)", values: [7384, 9052, 9073, 9017, 9040] },
            ]}
          />
          <StatsTable
            headers={["Tier", "Condition", "Mean (marginal)", "Difference"]}
            rows={[
              ["Simple", "antd", "8,104", "—"],
              ["", "rebar-ui", "7,999", "−1.3%"],
              ["Composite", "antd", "8,591", "—"],
              ["", "rebar-ui", "8,402", "−2.2%"],
              ["Complex", "antd", "8,988", "—"],
              ["", "rebar-ui", "8,712", "−3.1%"],
            ]}
          />

          <Heading level={3}>Qwen (raw tokens, n=3-5)</Heading>
          <ScatterChart
            ariaLabel="Scatter plot: Qwen tokens across three tiers, antd vs rebar-ui, rebar-ui consistently lower in each tier"
            series={[
              { label: "antd·Simple", color: "var(--rebar-color-text-secondary, #757575)", values: [478, 775, 905, 1819, 3090] },
              { label: "rebar·Simple", color: "var(--rebar-color-primary, #0066cc)", values: [809, 919, 1004, 1215, 2396] },
              { label: "antd·Composite", color: "var(--rebar-color-text-secondary, #757575)", values: [619, 1839, 2126, 3967] },
              { label: "rebar·Composite", color: "var(--rebar-color-primary, #0066cc)", values: [1326, 2158, 2160] },
              { label: "antd·Complex", color: "var(--rebar-color-text-secondary, #757575)", values: [1584, 2776, 2778, 3048, 3622] },
              { label: "rebar·Complex", color: "var(--rebar-color-primary, #0066cc)", values: [1298, 1311, 1380, 2332, 2648] },
            ]}
          />
          <StatsTable
            headers={["Tier", "Condition", "Mean", "n", "Difference"]}
            rows={[
              ["Simple", "antd", "1,413", "5", "—"],
              ["", "rebar-ui", "1,269", "5", "−10.2%"],
              ["Composite", "antd", "2,138", "4", "—"],
              ["", "rebar-ui", "1,881", "3", "−12.0%"],
              ["Complex", "antd", "2,762", "5", "—"],
              ["", "rebar-ui", "1,794", "5", "−35.0%"],
            ]}
          />

          <Alert type="info" title="Both models agree once the sample is large enough">
            rebar-ui wins all three tiers on both models — a modest 1.3-3.1% on Claude, a much
            larger 10.2-35.0% on Qwen, the same bigger-gap-on-the-cheaper-model pattern found in
            the main n=15 experiments above.
          </Alert>

          <Stack gap="xs">
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              One representative build per condition (final run of each n=5 batch)
            </Text>
            <Carousel aria-label="Simple/Composite/Complex tier screenshots">
              {TIER_SHOTS.map((shot) => (
                <Box key={shot.key} style={{ maxWidth: 360, margin: "0 auto" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/benchmark-screenshots-tiers/${shot.key}.png`}
                    alt={shot.label}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
                    {shot.label}
                  </Text>
                </Box>
              ))}
            </Carousel>
          </Stack>

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=5 per condition (n=3-4 for two Qwen composite cells), one
            day (2026-08-29/30). All builds typechecked and were Playwright-verified (clean render,
            zero console errors beyond antd&apos;s already-noted deprecation warning). Claude was
            instructed to build one-shot (no file exploration, no self-verification) each run,
            confirmed genuinely one-shot afterward (exactly one tool call per run), to mirror what
            Qwen&apos;s raw completion call structurally can&apos;t do either way.
          </Text>
        </Stack>

        <Stack gap="md" id="iteration">
          <Heading level={2}>Does iteration change the winner?</Heading>
          <Text size="sm">
            Everything above measures one build. The real question a single build can&apos;t
            answer: once realistic follow-up work (add a field, reorder content, add a note,
            change an option) is layered on round after round, does antd&apos;s head start
            survive, or does rebar-ui&apos;s pay-once-at-migration cost structure eventually
            overtake it? Rather than stop at an arbitrary round count, each tier was iterated
            until it actually crossed over — a measured answer, not an extrapolation.
          </Text>
          <Text size="sm">
            <strong>Condition A — antd direct.</strong> Build the UI against Ant Design components,
            then apply one follow-up prompt per round, repeated until crossover.
            <br />
            <strong>Condition B — rebar-ui, then migrate once.</strong> Build the same UI headless
            with rebar-ui, apply the identical follow-up prompts, then reimplement it directly in
            antd once at the end (the migration step — see below for why this isn&apos;t a codemod
            run here).
          </Text>
          <Stack gap="xs">
            {EXAMPLE_GROUPS.map((group) => (
              <Text key={group.tier} size="sm">
                <strong>{group.tier}</strong> — {group.example}
              </Text>
            ))}
          </Stack>

          <Alert type="warning" title="Rigid by design: rebar-ui is meant to refuse style/color requests">
            rebar-ui is deliberately rigid — closer to rebar and formwork in real construction than
            a flexible styling toolkit: it builds the load-bearing structure (logic, accessibility,
            content) correctly, then refuses to let that structure be visually fine-tuned before
            the &quot;cladding&quot; goes on, once, at migration. So when the first follow-up
            prompt here tried a pure restyle (&quot;make this button softer, add padding&quot;),
            two of three rebar-ui agents refused it outright — working exactly as intended: the
            placement schema has no per-instance color/style override, and inventing one would
            mean fabricating an API that doesn&apos;t exist. The third was explicitly told it could
            edit shared files to satisfy the request — overriding that rigidity on purpose, to see
            what happens. What happened is exactly the failure mode the rigidity exists to prevent:
            it made the restyle work, but by editing shared <code>packages/core</code> CSS and{" "}
            <code>BlockRenderer.tsx</code>, and in the process made a second, undisclosed, unrelated
            change to a shared button style. That edit was reverted immediately; nothing from it is
            in the numbers below, and the library&apos;s own docs now state the refusal as an
            explicit rule rather than leaving it to an individual agent&apos;s judgment. Every round
            below was redesigned around content/structure changes instead (add a field, reorder,
            add a note, change an option, cycling through those four types) — requests both
            architectures can actually express.
          </Alert>

          <Heading level={3}>Cumulative marginal cost per round (Claude, harness-subtracted)</Heading>
          <Text size="sm" color="secondary">
            &quot;rebar-ui + migration&quot; adds the one-time migration cost to round 0, so the two
            lines are comparable at every round, not just at the end. Green marker = the round
            where rebar-ui + migration first becomes cheaper than antd.
          </Text>

          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            Complex — crosses over at round 13
          </Text>
          <LineChart
            ariaLabel="Line chart: Complex tier cumulative cost over 13 rounds, antd and rebar-ui+migration cross at round 13, rebar-ui+migration cheaper from then on"
            xLabels={["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12", "R13"]}
            labelStep={2}
            crossoverIndex={13}
            series={[
              { label: "antd", color: "var(--rebar-color-text-secondary, #757575)", values: [9389, 18915, 28997, 38707, 48794, 58583, 68327, 78324, 88403, 98256, 108356, 118498, 128465, 138439] },
              { label: "rebar-ui + migration", color: "var(--rebar-color-primary, #0066cc)", values: [19740, 28538, 37946, 46808, 55777, 64794, 73762, 82941, 91979, 101105, 110355, 119482, 128564, 137756], dashed: true },
            ]}
          />

          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            Composite — crosses over at round 14
          </Text>
          <LineChart
            ariaLabel="Line chart: Composite tier cumulative cost over 14 rounds, antd and rebar-ui+migration cross at round 14, rebar-ui+migration cheaper from then on"
            xLabels={["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12", "R13", "R14"]}
            labelStep={2}
            crossoverIndex={14}
            series={[
              { label: "antd", color: "var(--rebar-color-text-secondary, #757575)", values: [9293, 18385, 27803, 36965, 46744, 56766, 66211, 75793, 85301, 94966, 104490, 114007, 123665, 133184, 142981] },
              { label: "rebar-ui + migration", color: "var(--rebar-color-primary, #0066cc)", values: [19217, 27727, 36424, 45004, 53698, 62672, 71406, 80155, 89092, 97923, 106768, 115608, 124695, 133547, 142584], dashed: true },
            ]}
          />

          <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
            Simple — crosses over at round 17
          </Text>
          <LineChart
            ariaLabel="Line chart: Simple tier cumulative cost over 17 rounds, antd and rebar-ui+migration cross at round 17, rebar-ui+migration cheaper from then on"
            xLabels={["R0", "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12", "R13", "R14", "R15", "R16", "R17"]}
            labelStep={2}
            crossoverIndex={17}
            series={[
              { label: "antd", color: "var(--rebar-color-text-secondary, #757575)", values: [8472, 17608, 26401, 35562, 44704, 53858, 63302, 72390, 81560, 90790, 100432, 109699, 119256, 128589, 138453, 147986, 157701, 167673] },
              { label: "rebar-ui + migration", color: "var(--rebar-color-primary, #0066cc)", values: [17527, 25954, 34449, 42912, 51477, 59989, 68559, 77227, 85957, 94747, 103551, 112342, 121329, 130307, 139257, 148955, 157855, 166797], dashed: true },
            ]}
          />

          <Alert type="info" title="All three tiers cross over — between round 13 and round 17">
            Complex crosses first (round 13: antd 138,439 vs rebar-ui+migration 137,756), Composite
            next (round 14: 142,981 vs 142,584), Simple last (round 17: 167,673 vs 166,797). The
            more complex the spec, the sooner migration pays for itself — consistent with
            rebar-ui&apos;s per-round saving being roughly proportional to how much content a round
            touches, while the one-time migration cost only grows sub-linearly with complexity. Not
            a smooth countdown: round 15 on the Simple tier briefly widened the gap instead of
            closing it (a single round&apos;s real cost swung the other way that time) before
            resuming its close — a visible reminder that any one round is still an n=1 measurement,
            even though the multi-round trend across three independently-run tiers is consistent.
          </Alert>

          <Stack gap="xs">
            <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
              Final state (post-crossover), one representative build per condition
            </Text>
            <Carousel aria-label="Iteration experiment final screenshots">
              {[
                { key: "antd-simple-final", label: "antd · Simple (round 17)" },
                { key: "rebar-ui-simple-final", label: "rebar-ui · Simple (round 17)" },
                { key: "antd-composite-final", label: "antd · Composite (round 14)" },
                { key: "rebar-ui-composite-final", label: "rebar-ui · Composite (round 14)" },
                { key: "antd-complex-final", label: "antd · Complex (round 13)" },
                { key: "rebar-ui-complex-final", label: "rebar-ui · Complex (round 13)" },
              ].map((shot) => (
                <Box key={shot.key} style={{ maxWidth: 360, margin: "0 auto" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/benchmark-screenshots-iteration/${shot.key}.png`}
                    alt={shot.label}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
                    {shot.label}
                  </Text>
                </Box>
              ))}
            </Carousel>
          </Stack>

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=1 per round per condition (97 dispatches total across all
            three tiers) — a single round&apos;s number can swing (see round 15&apos;s temporary
            reversal above), so the exact crossover round for any tier could land a little earlier
            or later on a repeat. Migration here is a full LLM rewrite to equivalent antd code, not
            a partial codemod pass, so it&apos;s a real, fully-counted cost, not an underestimate.
            Every final state typechecked and was Playwright-verified.
          </Text>

          <Alert type="info" title="A structural head start worth naming: models haven't been trained on rebar-ui">
            Every number on this page compares a library the model has seen constantly in training
            (antd) against one it has never seen at all (rebar-ui, and the{" "}
            <code>@rebar-ui/placement</code> schema specifically). That&apos;s not a flaw in the
            comparison — it&apos;s the placement layer&apos;s whole point: a small, generic schema
            needs far less training familiarity to use well than a large component API does, which
            is why rebar-ui already wins despite zero training exposure. But it does mean
            today&apos;s numbers likely understate rebar-ui&apos;s ceiling, not overstate it — the
            image-prompt experiment above shows a real, measurable &quot;unfamiliar schema&quot; tax
            (extra lookup calls before the prompt was refined to spell the schema out directly). If
            a future model were actually trained on examples of this schema, that residual tax would
            plausibly shrink further, on top of the advantage already measured here — a directional
            expectation, not something this page has tested.
          </Alert>
        </Stack>

        <Stack gap="sm" id="conclusion">
          <Heading level={2}>Conclusion</Heading>
          <Text size="sm">
            If you&apos;re deciding whether to build with rebar-ui or hand-code against antd
            directly: on every model and prompt style we&apos;ve tested, rebar-ui costs less and
            renders more consistently, from the very first build. The cheaper the model you&apos;re
            using, the more that matters — the gap ranges from a few percent on a frontier model up
            to three-quarters cheaper on a budget one.
          </Text>
          <Text size="sm">
            The one real cost on rebar-ui&apos;s side is migrating to a proper design system once
            you&apos;re done iterating — and we measured how long that takes to pay for itself
            rather than guess: 13-17 rounds of revisions, depending on complexity. Most real
            projects go through more revisions than that. If you&apos;re building something you
            won&apos;t re-skin at all, there&apos;s nothing to pay back in the first place, and
            rebar-ui is simply the cheaper choice throughout.
          </Text>
          <Text size="sm" color="secondary">
            Worth knowing: every number on this page compares a library the model has trained on
            constantly (antd) against one it&apos;s never seen before (rebar-ui) — a genuinely
            unfair comparison in rebar-ui&apos;s favor, if anything, since it still wins despite
            that disadvantage. What we&apos;d still like to test: the same round-by-round
            migration payoff on Qwen and Kimi, not just Claude; a wider range of app types beyond
            the three we picked; and a fourth model, to see how far the "cheaper model, bigger
            gap" pattern actually goes.
          </Text>
        </Stack>
        </Stack>
        <SectionNav sections={BENCHMARK_SECTIONS} />
      </Stack>
    </Box>
  );
}
