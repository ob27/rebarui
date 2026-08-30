import { Alert, Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "What it shows",
    body: [
      {
        kind: "text",
        text: "Live component-instance counts by type (found by querying `[data-rebar-component]` in the DOM, not app-level instrumentation) · a sketch/clean theme switch + dark-mode toggle · a bionic-reading toggle · an 8pt-grid overlay · a hover inspector (shows a node's `data-rebar-*` metadata) · a bucketed Low/Medium/High migration-effort estimate · a JSON export of all of the above.",
      },
      {
        kind: "text",
        text: "The migration-effort estimate is explicitly a rough heuristic (a weighted score over simple/medium/complex component counts) — never a token or dollar figure presented as fact.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Bionic reading",
    body: [
      {
        kind: "text",
        text: "Bolds the first portion of each word (the \"fixation\"), so the eye can pattern-match a word from its opening letters instead of reading every character — a readability aid for dyslexic readers. Deliberately bold-only, never dimmed: fading the remaining letters via opacity blends them toward whatever's behind the text, which washes out badly on a saturated surface (white-on-blue on a primary button, for instance). Bold-only carries the same contrast as plain text on any surface, by construction.",
      },
      {
        kind: "text",
        text: "Works exactly like dark mode: a `data-rebar-bionic=\"true\"` attribute on `<html>`, toggled live via the DevTools checkbox above — no rebuild, no Provider to wrap your app in. Every text-bearing component (`Text`, `Heading`, `Alert`, `Card`, `Tag`, `Button`, `Breadcrumb`, `Steps`, `Result`, `Descriptions`, `Timeline`, `Statistic`, `Empty`, `Dialog`, `Toast`, `Checkbox`, `Radio`, `Tab`) follows the ambient setting automatically. A `bionic` prop on any of them forces it on or off for just that instance, and `bionicOptions` (`fixationStrength`, `saccadeFrequency`, `skipShortWords`) tunes the split — only plain string children are ever touched; icons and nested components pass through untouched.",
      },
      {
        kind: "text",
        text: "Toggle \"Bionic reading\" in the DevTools panel (🔧) to see the whole site switch, or force it on a single instance with the `bionic` prop:",
      },
      {
        kind: "code",
        code: '<Text bionic>Reads with the first half of each word bolded.</Text>',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Token estimate: three ways to build this page",
    body: [
      {
        kind: "text",
        text: "Below the migration-effort score, the panel computes three numbers from the real components on the page: building against AntD directly, building with Rebar alone, and building with Rebar then migrating once. An \"assumed logic iterations\" input lets you see how the comparison shifts as you change how many rounds of changes you expect — the direct-AntD number grows with it, the Rebar-only number doesn't.",
      },
      {
        kind: "text",
        text: "Full methodology, every constant, and the reasoning behind each one: [Token estimate methodology](/docs/token-estimate). This is a documented model with stated, editable assumptions — not a measured cost, and the page says so explicitly.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Mounting it correctly (this matters)",
    body: [
      {
        kind: "text",
        text: "The panel checks `NODE_ENV === 'development'` internally, but that's not enough on its own to keep it out of your production bundle — verified against a real production build, not assumed. Bundlers generally fold a literal `process.env.NODE_ENV` check in your own app code, but don't reliably extend that into bundled dependencies. Gate the import yourself instead:",
      },
      {
        kind: "code",
        code: '"use client";\nimport dynamic from "next/dynamic";\n\nconst RebarDevTools =\n  process.env.NODE_ENV === "development"\n    ? dynamic(() => import("@rebar-ui/devtools").then((m) => m.RebarDevTools), { ssr: false })\n    : () => null;',
      },
      {
        kind: "text",
        text: "This site's own `src/components/DevToolsMount.tsx` deliberately does *not* use this gate — it's the marketing/docs site for the panel itself, so DevTools stays mounted in production here on purpose, as part of the pitch. That's a one-site exception, not a change to the guidance above: a real consuming app should still gate it exactly this way.",
      },
    ],
  },
];

export default function DevToolsPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DevTools</Heading>
      <Text>
        <code>@rebar-ui/devtools</code> is a dev-only floating panel (🔧, bottom-right) showing
        real, computed data about the current page — no fabricated metrics.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
      <Alert type="info" title="Live example — bionic prop forced on, no DevTools toggle needed">
        <Text bionic>
          This paragraph has the bionic prop set directly, so it renders bolded fixations
          regardless of the ambient DevTools setting above.
        </Text>
      </Alert>
    </Stack>
  );
}
