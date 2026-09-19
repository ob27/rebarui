import { Heading, Stack, Text, Timeline } from "rebar-ui";
import type { TimelineItem } from "rebar-ui";

// Newest first — the opposite order from /roadmap's Timeline (oldest first), since a changelog
// reads "what's new" top-down the same way a real CHANGELOG.md does, where the roadmap reads as a
// story from origin to destination. Every entry here is real, pulled from this project's own git
// history (`git log -- packages/core/package.json`) rather than reconstructed from memory — see
// CONTRIBUTING.md if a past entry looks wrong; it should be corrected against that history, not
// against this file's own prior wording.
const VERSIONS: TimelineItem[] = [
  {
    label: "0.11.0 — current",
    tone: "info",
    children:
      "Per-section narration audio (a real Alibaba Cloud Model Studio voice) on tier Philosophy sections, archetype essays, the Heuristics page, and Benchmarks — opt-in per doc-section, never a whole-page player unless the content is essay-shaped. SignaturePad gained real e-signature capture: typed cursive names, image upload, and a device stamp the component itself HMAC-signs client-side from a caller-supplied key, rather than a decodable hash. ColorPicker gained a real browser EyeDropper tool. A genuine sticky-sidebar bug — present on every catalogue page (Opinions, Synthetics, Imitations, Orders, Geneses, Archetypes, Benchmarks) since NavIndex shipped — is fixed: the left index now pins its search/filter/\"All X\" header while only the item list scrolls. ThemeToggle gained single-control mutations (a classic icon-in-thumb light/dark switch, style-only, bionic-only). This page.",
  },
  {
    label: "0.10.0",
    tone: "success",
    children:
      "The largest single gap-closing pass in the project's history: SignaturePad, ImageCropper, VideoPlayer, CommentThread, TagInput, PhoneInput, Container, Grid, SkipLink, and WorkspaceSwitcher shipped, and AppShell grew from one shape to seven real variants plus a composable right panel. Cross-tier ConstructSearch landed in the site header; the top nav's mega-menu split into \"Construct Library\" and \"Framework\" sections. The catalog crossed 175 components and 40 blocks.",
  },
  {
    label: "0.9.0",
    tone: "success",
    children: '`robot.md` renamed to `agents.md` (matching the emerging cross-industry convention) and a dedicated LLM.MD page shipped alongside it.',
  },
  {
    label: "0.8.0",
    tone: "success",
    children: "Deploy pipeline fixes: hosting corrected to the actual rebarui Firebase project (it had been publishing to the wrong one), and the release script now bumps every package in lockstep instead of needing each one touched by hand.",
  },
  {
    label: "0.7.0",
    tone: "success",
    children: 'A new `block-entry` block type, and every tier catalogue page switched to printing its own listing through it — closing a hand-authored gap the Packer itself should have owned from the start.',
  },
  {
    label: "0.6.0",
    tone: "success",
    children: "ChatThread's message bubble took ownership of its own loading-to-streaming transition instead of leaning on a caller's isTyping flag; Select gained a size prop matching Button's sm/md/lg scale; the form block's live-data gap closed with real onSubmit wiring and controlled fields for every field kind.",
  },
  {
    label: "0.5.0",
    tone: "success",
    children: "Blocks stopped being purely static JSON — source and onX bindings let a real backend-driven app wire live data and handlers straight through a block, resolved by BlockRenderer's new data/handlers props. Landed alongside the four-tier construct taxonomy (Imitations, Synthetics, Opinions, Orders) as a mechanically-checked classification, not a naming convention.",
  },
  {
    label: "0.4.0",
    tone: "success",
    children: 'Table gained a dev-mode-only warning for a column shaped like a drill-down aggregate with no render function — never blocking, just surfacing a real, previously-silent gap. New heuristic: a chat/messaging component spans its container\'s full width by default rather than trusting a layout context that might not stretch it.',
  },
  {
    label: "0.3.0",
    tone: "success",
    children: "Ten new chart components (StackedLineChart, StackedAreaChart, SteppedBarChart, StepChart, IndexChart, Histogram, RibbonChart, CalendarHeatmap, BulletGraph, PackedBubbleChart) plus a shared trendline prop across the existing chart family. SidebarNav grew a real mutation set: a workspace switcher, built-in self-filtering search, tint/bar/fill active-item styling, and inline/edge collapse-toggle placement. REBAR_UI_VERSION started stamping itself onto the document root the moment the package is imported, so any rebar-ui-built page carries an inspectable record of which version built it.",
  },
  {
    label: "0.2.0",
    tone: "success",
    children: "The site header's logo became a real inline SVG instead of an externally-loaded image, so it can actually react to the light/dark toggle; the favicon gained the same light/dark awareness via a prefers-color-scheme media query.",
  },
  {
    label: "0.1.0",
    tone: "success",
    children: "First npm publish — the core component library and the placement layer's Packer ship as separate, installable packages for the first time.",
  },
];

export default function VersionLogPage() {
  return (
    <Stack gap="lg" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Heading level={1}>Version Log</Heading>
      <Text color="secondary">
        What actually changed, release by release — pulled from this project&apos;s own git
        history, not reconstructed from memory. See <a href="/roadmap" className="rebar-link">Roadmap</a> for
        where the project is headed next; this page is the record of where it&apos;s already been.
      </Text>

      <Timeline items={VERSIONS} />
    </Stack>
  );
}
