import { Container, Heading, Stack, Text, Timeline } from "rebar-ui";
import type { TimelineItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { totalConstructs } from "@/data/catalogueCounts";

// The construct count comes from the registry the tier pages read, so it cannot go stale in this copy.
const MILESTONES: TimelineItem[] = [
  {
    label: "v0.1 — First public release",
    tone: "success",
    children: "The core component library and the placement layer's Packer ship as separate packages in the open-source repo for the first time.",
  },
  {
    label: "Four-tier construct taxonomy",
    tone: "success",
    children: "Imitations, Synthetics, Opinions, and Orders land as a real, mechanically-checked classification — not a naming convention, a compile-time-enforced axis every construct is judged against.",
  },
  {
    label: "Live-data binding for Opinion-tier blocks",
    tone: "success",
    children: "The Packer's blocks stop being purely static data — source and onX fields let a real backend-driven app wire its own state and handlers straight through, resolved by BlockRenderer's data/handlers props.",
  },
  {
    label: "The tier-vs-DSL pivot",
    tone: "success",
    children: "Direct investigation into real downstream usage (four independent rebuilds of a production app) and a controlled, n=15-per-condition Kanban benchmark found the Packer's schema wrapper wasn't actually the source of the measured savings — reaching for the highest-tier existing unit was, independent of delivery mechanism. Site copy, agent.md, and every package README were rewritten around that finding instead of \"compose everything through the Packer.\" A follow-up condition then tested whether a properly-scoped DSL (its schema widened to actually cover the real customization needed, instead of forcing a hand-authored escape hatch) could still win outright once separated from tier — it did, on every metric measured, including beating the previous benchmark's cheapest condition on raw token cost.",
  },
  {
    label: "Genesis projects",
    tone: "success",
    children: "Whole applications built 100% with Rebar UI, showing the library working end to end. AI Hive, the wall of AI agents and services, is open source (MIT); Athic, the Catholic companion app and its marketing site, is closed source.",
  },
  {
    label: "1.0.0 — basilika becomes canonical",
    tone: "success",
    children: (
      <>
        basilika, the Athic look, is Rebar UI&apos;s canonical theme: <code>@rebar-ui/theme-basilika</code>, zero-config, light and dark. New
        constructs (TopBar, List, ImagePicker, AuthScreen, ReadingView and more) and opt-in variants for building a real app. The older
        themes still ship.
      </>
    ),
  },
  {
    label: "1.1.0 — current",
    tone: "info",
    children: (
      <>
        Opt-in parity variants so an app can reproduce a hand-built design exactly, with every default unchanged. The catalogue lists{" "}
        {totalConstructs()} constructs. See the{" "}
        <a href="/about/version-log" className="rebar-link">
          Version Log
        </a>{" "}
        for what each release changed.
      </>
    ),
  },
  {
    label: "Additional migration adapters",
    tone: "default",
    children: "@rebar-ui/migrate-antd is the template; MUI and Chakra codemods are the next candidates once a second real migration case validates the adapter pattern generalizes.",
  },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "About this page",
    body: [
      {
        kind: "text",
        text: "Illustrative, not a committed schedule — Rebar UI is a small project with one maintainer plus AI-assisted development, and dates here are deliberately omitted rather than guessed. The completed milestones above are real; the ones after \"1.1.0 — current\" describe direction and intent, not promised delivery order or timing. See [Contributing](/about) if a specific gap here is something you'd want to help build.",
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <Container verticalPadding="var(--rebar-space-xl)">
      <Stack gap="lg">
        <Heading level={1}>Roadmap</Heading>
        <Text color="secondary">
          Where Rebar UI has been, and where it&apos;s headed — from the first public release through
          the current 1.x line and beyond.
        </Text>

        <Timeline items={MILESTONES} />

        <NextBlockRenderer blocks={BLOCKS} />
      </Stack>
    </Container>
  );
}
