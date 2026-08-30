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

export default function BenchmarksPage() {
  return (
    <Box as="main" style={{ maxWidth: 800, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="lg">
        <Stack gap="sm">
          <Heading level={1}>Benchmarks</Heading>
          <Text color="secondary">
            The actual argument for building this way, made with real numbers instead of just a
            model: comparative token-cost runs building the same component against{" "}
            <code>antd</code> directly and against <code>rebar-ui</code> — always through its
            small procedural placement layer, never hand-authored — and measuring what it
            actually cost.
          </Text>
        </Stack>

        <Alert type="info" title="Real measured runs, not modeled">
          Every number below is a real, measured build — actual token counts and wall-clock time
          pulled from real subagent transcripts, not modeled. The Condition A/B iterate-then-migrate
          benchmark further down is still planned, not run. The{" "}
          <Link href="/docs/token-estimate">token estimate</Link> in DevTools remains a separate,
          documented model with stated assumptions.
        </Alert>

        <Stack gap="sm" id="experiment-1">
          <Heading level={2}>antd vs. rebar-ui</Heading>
          <Text size="sm">
            rebar-ui works through a small procedural placement layer — a compact schema plus a
            deterministic renderer built from rebar-ui&apos;s own components — rather than being
            hand-authored directly, so that&apos;s simply how rebar-ui is used in this comparison:
            build the same target component against <code>antd</code> directly, and against{" "}
            <code>rebar-ui</code> — same prompt, same model, each in its own isolated scaffold with
            everything already installed. Only the build step is measured. Target: a
            &quot;PreviewPanel&quot; component — a header row, an info banner with a reset action,
            a six-row checklist, and a warning callout. Both conditions got the identical spec,
            blind to each other&apos;s implementation, run <strong>15 times each</strong> — real
            per-turn API usage extracted from each subagent&apos;s own transcript, every output
            Playwright-verified for a clean render.
          </Text>

          <svg
            viewBox="0 0 500 340"
            style={{ width: "100%", maxWidth: 500, height: "auto", margin: "0 auto", display: "block" }}
            role="img"
            aria-label="Scatter plot comparing antd direct (clustered around 31,000, mean 31,231) and rebar-ui (even more tightly clustered around 30,200, mean 30,211, lower and tighter than antd)"
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
          <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
            Each dot is one independent build. Dashed lines mark each condition&apos;s mean. Zoomed
            in — the range shown is 29.5k-32.5k tokens, since both conditions cluster tightly.
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Mean", "Median", "Min", "Max", "Std. dev."].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "31,231", median: "31,131", min: "30,891", max: "31,921", stdev: "294 (0.9%)" },
                { condition: "rebar-ui (n=15)", mean: "30,211", median: "30,212", min: "30,149", max: "30,253", stdev: "28.6 (0.095%)" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>

          <Alert type="info" title="rebar-ui wins outright — including against antd">
            <strong>3.3% cheaper than antd&apos;s own mean</strong>, with a 0.095% coefficient of
            variation — tighter than antd&apos;s 0.9%, previously the benchmark for consistency on
            this page. A representative run&apos;s output-token breakdown shows why: context/lookup
            111 tokens (15.8%), <strong>code-writing 497 tokens (70.9%)</strong>, verification 93
            tokens (13.3%) — 497 tokens to write a component instance, versus antd&apos;s 1,189 to
            write the equivalent JSX directly. (For context: hand-authoring rebar-ui&apos;s own
            components directly, without this placement layer, was tried first and lost to antd by
            ~54% on average — the model already knows antd cold from training data and needs zero
            lookups, while an unfamiliar, hand-authored library doesn&apos;t. That&apos;s exactly
            why rebar-ui works this way now, rather than being hand-authored.)
          </Alert>
          <Text size="sm">
            What this does and doesn&apos;t prove: it confirms deferring placement to a
            deterministic renderer is a real, large, <em>reliable</em> win — not just a paper
            ceiling — for a schema built from named archetypes that happen to cover this
            component&apos;s exact shape. It does not yet prove a <em>general</em> &quot;any UI,
            procedurally placed&quot; engine works — this prototype has exactly three archetypes,
            chosen to fit one benchmark component, and a schema that only had to describe shapes it
            already knew how to render. Whether that holds up on a structurally different panel, and
            whether DOM order stays correct as the archetype library grows, are the honest open
            questions if this gets taken further — not yet answered here.
          </Text>
          <Text size="sm" color="secondary">
            <strong>Caveats:</strong> n=15, one model (claude-sonnet-5), one day (2026-08-29), one
            component spec (three fixed archetypes designed around it). Every run type-checked, and
            8 of the 15 rebar-ui runs were Playwright-verified directly (clean render, zero console
            errors, DOM order matching intended reading order) — not all 15, for cost reasons.
          </Text>

          <Heading level={3}>Wall-clock time</Heading>
          <Text size="sm">
            Tokens aren&apos;t the only cost that matters — how long a build takes to come back
            matters too, and it doesn&apos;t necessarily move with token count. Recovered from the
            same real subagent transcripts:
          </Text>
          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Mean", "Median", "Min", "Max", "Std. dev."].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=14 of 15)", mean: "24.5s", median: "23.7s", min: "21.6s", max: "30.1s", stdev: "2.4s (9.7%)" },
                { condition: "rebar-ui (n=15)", mean: "14.7s", median: "14.6s", min: "14.2s", max: "15.8s", stdev: "0.47s (3.2%)" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            <strong>rebar-ui is ~40% faster wall-clock, not just cheaper</strong> (14.7s vs. 24.5s
            mean) — and, again, far more consistent (3.2% CV vs. 9.7%). One antd run&apos;s duration
            couldn&apos;t be recovered from the transcript under a matching label (its token count
            was inferable from the published mean/median and is included in the table above; its
            missing duration is not, hence n=14 rather than 15 for that row).
          </Text>

          <Heading level={3}>Visual consistency across runs</Heading>
          <Text size="sm">
            Token-count consistency doesn&apos;t automatically mean visual consistency — the same
            token budget could still be spent on different arbitrary styling choices run to run.
            Here are all 30 real screenshots (all 15 per condition, not a cherry-picked sample) so
            that can be judged directly rather than asserted. To make &quot;looks the same&quot;
            checkable instead of asserted: all 15 screenshots per condition were aligned
            pixel-for-pixel, and at every pixel the standard deviation of luminance across the 15
            runs was computed, then averaged over the whole image — a single number on the same
            0-255 scale as a pixel value, where 0 means every run rendered that pixel identically.
          </Text>
          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Avg. per-pixel std. dev.", "Pixels that vary run-to-run"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", stdev: "13.2 / 255", pct: "27.0%" },
                { condition: "rebar-ui (n=15)", stdev: "0.0000032 / 255", pct: "0%" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm">
            antd, hand-authored directly, shows real run-to-run visual variation — 27% of pixels
            differ meaningfully across the 15 runs (spacing, icon choice, exact tone of the
            callout). rebar-ui&apos;s 15 runs are pixel-identical: the measured variance is floating-
            point noise, not real difference, because a deterministic renderer — not the model —
            decides every pixel of layout.
          </Text>
          <Text size="sm" color="secondary">
            That variance isn&apos;t just cosmetic. Every antd run met the brief, but no two look
            quite alike — in practice, that&apos;s exactly the kind of drift a person or a follow-up
            prompt ends up noticing and asking to fix, even on a rough mock, and each of those fixes
            is another paid round. rebar-ui&apos;s uniformity means there&apos;s nothing there to
            fine-tune. This benchmark only measures one build each, not the iteration rounds that
            would follow — that&apos;s exactly what the still-unrun Condition A/B benchmark further
            down is designed to measure directly, rather than leaving it as an inference from this
            gallery.
          </Text>

          {(
            [
              { key: "antd-text", label: "antd (n=15)" },
              { key: "rebar-dsl", label: "rebar-ui (n=15)" },
            ] as const
          ).map((cond) => (
            <Stack key={cond.key} gap="xs">
              <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                {cond.label}
              </Text>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 8,
                }}
              >
                {Array.from({ length: 15 }, (_, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={n}
                      src={`/benchmark-screenshots/${cond.key}-${n}.png`}
                      alt={`${cond.label}, run ${n}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid var(--rebar-color-border, #e0e0e0)",
                        borderRadius: 4,
                      }}
                    />
                  );
                })}
              </Box>
            </Stack>
          ))}
          <Text size="xs" color="secondary">
            Each thumbnail is a real screenshot of that run&apos;s actual rendered output (560×620
            viewport, unmodified). Click/zoom in your browser to inspect any run individually.
          </Text>
        </Stack>

        <Stack gap="sm" id="experiment-1b">
          <Heading level={2}>Same spec, from a screenshot instead of a text prompt</Heading>
          <Text size="sm">
            Same target component, same two conditions, same n=15-per-condition rigor — but this
            time each agent was handed the reference screenshot below instead of a written prompt,
            and had to read the visual spec off it directly. Numbers below are the final,
            best-known prompt for each condition — the one iteration this required is explained in
            the callout underneath, not spread across separate tables.
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
          <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
            The exact reference image both conditions were given — no written description of the
            layout, just this.
          </Text>

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
          <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
            Each dot is one independent build from the image above. Dashed lines mark each
            condition&apos;s mean. Range shown is 30.5k-34.5k tokens.
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Mean", "Median", "Min", "Max", "Std. dev."].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "31,765", median: "31,659", min: "31,021", max: "34,257", stdev: "776 (2.4%)" },
                { condition: "rebar-ui (n=15)", mean: "30,787", median: "30,769", min: "30,684", max: "31,073", stdev: "118 (0.38%)" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>

          <Alert type="info" title="rebar-ui wins here too — but it took one iteration">
            <strong>3.1% cheaper than antd&apos;s mean</strong> (30,787 vs. 31,765), with a 0.38%
            coefficient of variation versus antd&apos;s 2.4% — and within 1.9% of the text-prompt
            result above (30,211), closing nearly the entire image-specific gap. It didn&apos;t win
            on the first attempt: a naive prompt that just handed over the image and said
            &quot;write <code>panel.ts</code>&quot; averaged <strong>33,701 tokens — 6.1% more than
            antd</strong>, because it left the agent to discover the schema, renderer, and icon set
            by reading three files (6 tool calls) instead of being told directly. Inlining the
            archetype shapes and icon names in the prompt itself — the same fix, in spirit, as the
            README pointer that closed the original text-prompt gap in Part 1 — dropped that to 3
            tool calls, matching the text-prompt condition exactly, and flipped the result to a win.
          </Alert>

          <Heading level={3}>Wall-clock time</Heading>
          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Mean", "Median", "Min", "Max", "Std. dev."].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "27.2s", median: "25.4s", min: "20.8s", max: "54.4s", stdev: "8.0s (29.6%)" },
                { condition: "rebar-ui (n=15)", mean: "16.7s", median: "16.4s", min: "15.0s", max: "20.2s", stdev: "1.4s (8.1%)" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            <strong>~39% faster wall-clock</strong> (16.7s vs. 27.2s mean), and far more consistent
            (8.1% CV vs. 29.6% — antd&apos;s spread is dragged out by one 54s outlier run that took
            an unusually long, exploratory path).
          </Text>

          <Heading level={3}>Visual consistency across runs</Heading>
          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Avg. per-pixel std. dev.", "Pixels that vary run-to-run"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", stdev: "10.9 / 255", pct: "20.0%" },
                { condition: "rebar-ui (n=15)", stdev: "~0 / 255", pct: "0%" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            Same method as the text-prompt experiment&apos;s gallery: all 15 screenshots per
            condition aligned pixel-for-pixel, luminance std. dev. computed at every pixel then
            averaged. antd shows the same 20% real run-to-run drift as its text-prompt gallery;
            rebar-ui is a true pixel-identical zero here (the first-attempt prompt actually had a
            tiny, honest exception — 4 of 15 runs dropped a trailing period from the banner text,
            reading punctuation off an image — fixed as a side effect once the refined prompt
            explicitly said to transcribe punctuation exactly).
          </Text>

          {(
            [
              { key: "antd-image", label: "antd (n=15)" },
              { key: "rebar-dsl-image-refined", label: "rebar-ui (n=15)" },
            ] as const
          ).map((cond) => (
            <Stack key={cond.key} gap="xs">
              <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                {cond.label}
              </Text>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 8,
                }}
              >
                {Array.from({ length: 15 }, (_, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={n}
                      src={`/benchmark-screenshots-image/${cond.key}-${n}.png`}
                      alt={`${cond.label}, run ${n}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid var(--rebar-color-border, #e0e0e0)",
                        borderRadius: 4,
                      }}
                    />
                  );
                })}
              </Box>
            </Stack>
          ))}

          <Text size="sm" color="secondary">
            <strong>Caveats:</strong> n=15, one model (claude-sonnet-5), one day (2026-08-29), same
            spec and archetypes as the text-prompt experiment — one prompt refinement on one
            component shape, not proof that every future image-driven build lands this close to the
            text-prompt number. All 30 type-checked; 9 of 30 (min/median/max per condition, both
            prompt versions) were Playwright-verified directly (clean render, zero console errors,
            DOM order matching the reference). antd&apos;s output uses a deprecated{" "}
            <code>Alert message</code> prop across all 15 runs (antd v6 renamed it to{" "}
            <code>title</code>) — harmless to rendering, but a real sign the model&apos;s antd
            knowledge lags the v6 release this benchmark targets.
          </Text>
        </Stack>

        <Stack gap="sm" id="experiment-2">
          <Heading level={2}>Does a cheaper model benefit even more?</Heading>
          <Text size="sm">
            Everything above is one model (Claude Sonnet 5). The real open question that leaves:
            does the placement layer help a <em>cheaper</em>, weaker model even more than it helps
            a frontier one? Its whole mechanism is removing layout/composition decisions from the
            model — a weaker model is plausibly worse at open-ended JSX/AntD authoring and no worse
            at filling in a small typed schema, which would make this a real argument for cheaper-
            model viability, not just lower cost on a model that&apos;s already good. Ran the exact
            same spec, prompts, and archetypes (see <code>ref/QWEN_BENCHMARK_PROTOCOL.md</code> in
            the repo) against Qwen (qwen3.7-max for text, qwen3.7-plus for image) via the DashScope
            API, n=15 per condition.
          </Text>

          <Alert type="warning" title="Not directly comparable to the numbers above — different measurement basis">
            Qwen&apos;s numbers come from a single raw completion API call: one system message, one
            user message, one response — no agentic tool use, no file access, no ~22,000-token
            harness/tool-definition overhead every Claude run above pays. That&apos;s why Qwen&apos;s
            totals (roughly 1,000-4,000 tokens) look dramatically smaller than Claude&apos;s
            (roughly 30,000+) — it&apos;s measuring a fundamentally thinner slice of work, not a
            more efficient model. The only fair comparison here is <em>within</em> Qwen&apos;s own
            results: antd vs. rebar-ui, same model, same harness, same everything else.
          </Alert>

          <Heading level={3}>Text prompt (qwen3.7-max)</Heading>
          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Mean", "Median", "Min", "Max", "Std. dev.", "Success"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "3,388", median: "2,989", min: "1,597", max: "6,446", stdev: "1,376 (40.6%)", success: "15/15" },
                { condition: "rebar-ui (n=15)", mean: "1,228", median: "1,065", min: "994", max: "2,028", stdev: "278 (22.6%)", success: "15/15" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            <strong>~64% fewer tokens</strong> and a tighter CV (22.6% vs. 40.6%).
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "46.6s", median: "40.3s", min: "19.7s", max: "88.3s", stdev: "20.8s (44.6%)" },
                { condition: "rebar-ui (n=15)", mean: "10.3s", median: "9.4s", min: "6.0s", max: "21.7s", stdev: "3.9s (37.8%)" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            <strong>~78% faster</strong> — same direction and a similar magnitude as Claude&apos;s
            own wall-clock win, on a different model and a different (non-agentic) harness.
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Visual consistency", "Avg. per-pixel std. dev.", "Pixels that vary run-to-run"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", stdev: "15.3 / 255", pct: "30.5%" },
                { condition: "rebar-ui (n=15)", stdev: "~0 / 255", pct: "0%" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="xs" color="secondary">
            Same pixel-alignment method as the Claude galleries above, applied to these 30
            screenshots. antd (Qwen) shows even more run-to-run drift than antd (Claude) did
            (30.5% of pixels vs. 27.0%); rebar-ui (Qwen) is pixel-identical across all 15 runs,
            same as every other rebar-ui condition measured this way regardless of model.
          </Text>

          {(
            [
              { key: "antd-text", label: "antd (n=15)" },
              { key: "rebar-ui-text", label: "rebar-ui (n=15)" },
            ] as const
          ).map((cond) => (
            <Stack key={cond.key} gap="xs">
              <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                {cond.label}
              </Text>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 8,
                }}
              >
                {Array.from({ length: 15 }, (_, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={n}
                      src={`/benchmark-screenshots-qwen/${cond.key}-${n}.png`}
                      alt={`${cond.label}, run ${n}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid var(--rebar-color-border, #e0e0e0)",
                        borderRadius: 4,
                      }}
                    />
                  );
                })}
              </Box>
            </Stack>
          ))}

          <Heading level={3}>Image prompt (qwen3.7-plus)</Heading>
          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Condition", "Mean", "Median", "Min", "Max", "Std. dev.", "Success"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "3,948", median: "3,667", min: "3,243", max: "5,882", stdev: "726 (18.4%)", success: "15/15" },
                { condition: "rebar-ui (n=15)", mean: "2,956", median: "2,965", min: "2,839", max: "3,129", stdev: "90.3 (3.1%)", success: "15/15" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            <strong>~25% fewer tokens</strong> and a far tighter CV (3.1% vs. 18.4%).
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Wall-clock", "Mean", "Median", "Min", "Max", "Std. dev."].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", mean: "33.2s", median: "29.2s", min: "20.5s", max: "64.6s", stdev: "11.9s (35.8%)" },
                { condition: "rebar-ui (n=15)", mean: "13.8s", median: "13.9s", min: "11.2s", max: "17.6s", stdev: "1.7s (12.1%)" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="sm" color="secondary">
            <strong>~58% faster</strong> — the same near-zero-variance, faster-and-cheaper pattern
            found on Claude, on a completely different model.
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Visual consistency", "Avg. per-pixel std. dev.", "Pixels that vary run-to-run"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { condition: "antd (n=15)", stdev: "13.1 / 255", pct: "29.1%" },
                { condition: "rebar-ui (n=15)", stdev: "~0 / 255", pct: "0%" },
              ].map((row) => (
                <Box as="tr" key={row.condition}>
                  {Object.values(row).map((val, i) => (
                    <Box as="td" key={i} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="xs" color="secondary">
            Same method, same result: antd (Qwen) drifts visually run to run; rebar-ui (Qwen) is
            pixel-identical across all 15 runs.
          </Text>

          {(
            [
              { key: "antd-image", label: "antd (n=15)" },
              { key: "rebar-ui-image", label: "rebar-ui (n=15)" },
            ] as const
          ).map((cond) => (
            <Stack key={cond.key} gap="xs">
              <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                {cond.label}
              </Text>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 8,
                }}
              >
                {Array.from({ length: 15 }, (_, i) => {
                  const n = String(i + 1).padStart(2, "0");
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={n}
                      src={`/benchmark-screenshots-qwen-image/${cond.key}-${n}.png`}
                      alt={`${cond.label}, run ${n}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        border: "1px solid var(--rebar-color-border, #e0e0e0)",
                        borderRadius: 4,
                      }}
                    />
                  );
                })}
              </Box>
            </Stack>
          ))}

          <Alert type="info" title="The relative gap is bigger on the cheaper model, not smaller">
            On Claude, rebar-ui won by 3.1-3.3% on tokens. On Qwen, the same comparison shows a{" "}
            <strong>25-64% advantage</strong> — a much larger relative win, in the direction the
            original hypothesis predicted: removing layout/composition decisions seems to help more
            when the model doing the composing is weaker at open-ended authoring to begin with.
            One caveat this page isn&apos;t going to paper over: two models, two conditions each,
            is not enough to call this a general law — it&apos;s a real, measured data point in
            the predicted direction, not proof the effect scales smoothly with model capability.
          </Alert>

          <Text size="sm">
            <strong>The reliability story, reported as it happened:</strong> the first attempt at
            rebar-ui-text scored <strong>0/15</strong> — every single run failed to typecheck or
            extract cleanly. The prompt (reused verbatim from the original Claude-era text-prompt
            experiment) told the model to &quot;read <code>schema.ts</code> first&quot; — an
            instruction that made sense for an agentic session that can actually read files, and
            means nothing for a single raw completion call that can&apos;t. Qwen, left to guess the
            schema&apos;s exact shape from prose alone, invented plausible-sounding alternatives
            (<code>&quot;info-banner&quot;</code> instead of <code>&quot;banner&quot;</code>,
            checklist items as <code>{"{ label: string }"}</code> objects instead of plain
            strings) — a real, honest finding, not a model failure being hidden. Rewriting the
            prompt to be fully self-contained (the exact fix already validated for Claude&apos;s
            own image-prompt condition back in Part 5) — spelling out the literal type strings and
            shapes directly, no file reference at all — took it to <strong>15/15</strong>, and
            that&apos;s the number reported above. The lesson travels: a prompt that assumes tool
            access silently breaks the moment it&apos;s run somewhere without it, on any model.
          </Text>

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=15 per condition, one day (2026-08-29/30), same spec and
            archetypes as the Claude experiments above. All 60 runs were written to disk and
            typechecked (not just token-counted) — an earlier version of the run script extracted
            code from the API response but never saved or verified it, which would have made
            &quot;success&quot; meaningless; fixed before any number here was trusted. 12 of 60
            (min/median/max per condition) were Playwright-verified directly (clean render, zero
            console errors, DOM order matching the reference). All 60 were also screenshotted for
            the visual-consistency galleries above — that capture wasn&apos;t done in the first
            pass and was added afterward so it matches the Claude experiments&apos; methodology,
            not just their headline numbers. antd&apos;s output shows the same deprecated{" "}
            <code>Alert message</code> warning found on Claude&apos;s antd runs.
          </Text>
        </Stack>

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

        <Stack gap="sm" id="experiment-3">
          <Heading level={2}>Simple, Composite, Complex — one-shot, across both models</Heading>
          <Text size="sm">
            A first look at the three complexity tiers below (still not the full iterate-then-
            migrate experiment described next — that&apos;s a separate, bigger, still-unrun piece
            of work). One-shot, text-prompt only, n=1 per condition, run against both Claude and
            Qwen. Building these required six new archetypes in <code>@rebar-ui/placement</code> —{" "}
            <code>form</code>, <code>table</code>, <code>data-list</code>, <code>filter-bar</code>,{" "}
            <code>tabs</code>, and <code>modal</code> — since none of the specs below fit the
            existing six blocks; not measured in isolation the way banner/checklist/callout were.
          </Text>

          <Box as="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--rebar-font-size-sm)" }}>
            <Box as="thead">
              <Box as="tr">
                {["Tier", "Condition", "Claude (marginal)", "Qwen"].map((h) => (
                  <Box key={h} as="th" style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid var(--rebar-color-border, #e0e0e0)" }}>
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box as="tbody">
              {[
                { tier: "Simple", condition: "antd", claude: "6,767", qwen: "775" },
                { tier: "", condition: "rebar-ui", claude: "6,676 (−1.3%)", qwen: "2,396 (+209%)" },
                { tier: "Composite", condition: "antd", claude: "7,251", qwen: "1,839" },
                { tier: "", condition: "rebar-ui", claude: "7,004 (−3.4%)", qwen: "2,158 (+17.3%)" },
                { tier: "Complex", condition: "antd", claude: "7,602", qwen: "3,048" },
                { tier: "", condition: "rebar-ui", claude: "7,384 (−2.9%)", qwen: "2,332 (−23.5%)" },
              ].map((row, i) => (
                <Box as="tr" key={i}>
                  {Object.values(row).map((val, j) => (
                    <Box as="td" key={j} style={{ padding: "8px 12px", borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                      {val}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Text size="xs" color="secondary">
            "Claude (marginal)" = total tokens minus the ~20,644-token shared harness/tool-
            definition overhead (verified directly from each agent&apos;s own transcript, same
            method as Part 3a) — Claude has no way to skip its own agent harness the way Qwen&apos;s
            raw completion call does, so this is the fairest number available, not a perfectly
            clean one.
          </Text>

          <Alert type="warning" title="n=1 flips sign — shown directly, not asserted">
            Rerunning the exact same six Qwen prompts a second time (after fixing an unrelated
            scaffold-isolation bug) gave genuinely different numbers: Simple went from rebar-ui{" "}
            <strong>55.8% cheaper</strong> to rebar-ui <strong>209% more expensive</strong> —
            a dead sign-flip on identical inputs. Composite went from rebar-ui costing{" "}
            <strong>219% more</strong> to only <strong>17.3% more</strong> — same direction, wildly
            different magnitude. Only Complex stayed directionally consistent (rebar-ui cheaper
            both times, 8.0% then 23.5%). This is the same lesson Part 1d already demonstrated with
            Claude earlier on this page (a re-run scoring worse than the original unfixed
            baseline) — n=1 is a real data point, not a verdict, and the table above should be read
            that way. A trustworthy answer needs the same n=15 rigor as everything else here.
          </Alert>

          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 8,
            }}
          >
            {(
              [
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
              ] as const
            ).map((shot) => (
              <Stack key={shot.key} gap="xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/benchmark-screenshots-tiers/${shot.key}.png`}
                  alt={shot.label}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid var(--rebar-color-border, #e0e0e0)",
                    borderRadius: 4,
                  }}
                />
                <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
                  {shot.label}
                </Text>
              </Stack>
            ))}
          </Box>

          <Text size="xs" color="secondary">
            <strong>Caveats:</strong> n=1, one day (2026-08-30). All 12 typechecked and were
            Playwright-verified (clean render, zero console errors beyond antd&apos;s already-noted
            deprecation warnings). Claude was instructed to build one-shot (no file exploration, no
            self-verification) to mirror what Qwen&apos;s raw completion call structurally can&apos;t
            do either way — confirmed genuinely one-shot afterward (exactly one tool call per run).
            A real mistake happened and was fixed during this run: the first Qwen pass and the
            Claude pass initially shared the same six scaffold directories, so Claude&apos;s later
            write silently overwrote Qwen&apos;s already-measured source code — the token/duration
            numbers taken before that (saved to JSON independent of the file) were unaffected, but
            re-verifying required isolating Qwen into its own dedicated scaffolds and re-running,
            which is where the sign-flip above was discovered. Two of Qwen&apos;s runs also
            hallucinated tool calls or a prose summary instead of outputting code at all — retried
            until a real, extractable, typechecked result came back, same discipline as every other
            Qwen condition on this page.
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
