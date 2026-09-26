import { Container, Heading, Image, Stack, Text, Timeline } from "rebar-ui";
import type { TimelineItem } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const MILESTONES: TimelineItem[] = [
  {
    label: "v0.1 — First npm publish",
    tone: "success",
    children: "The core component library and the placement layer's Packer ship as separate, installable packages for the first time.",
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
    label: "0.12.1 Open Beta — current",
    tone: "info",
    children: (
      <>
        The catalog crosses 192 components and 44 blocks. FloatAssistant&apos;s sidebar-dock mode,
        several components&apos; real customization gaps closed directly from controlled-benchmark
        findings (Kanban&apos;s <code>addPosition</code>/<code>assignee</code>/<code>statusTag</code>,
        SignaturePad&apos;s typed-name tracking), and a real search-rendering bug found and fixed in
        Kanban itself (a non-matching card was being unmounted instead of hidden) all ship as part
        of this line. See the{" "}
        <a href="/about/version-log" className="rebar-link">
          Version Log
        </a>{" "}
        for the full release-by-release detail.
      </>
    ),
  },
  {
    label: "First Genesis seed projects",
    tone: "default",
    children: "Complete, cloneable example applications — a dashboard, an admin panel, a content site — built entirely through the Packer, demonstrating real composition discipline end to end.",
  },
  {
    label: "Additional migration adapters",
    tone: "default",
    children: "@rebar-ui/migrate-antd is the template; MUI and Chakra codemods are the next candidates once a second real migration case validates the adapter pattern generalizes.",
  },
  {
    label: "1.0 stable",
    tone: "warning",
    children: "A committed public API and semver guarantees, once the construct catalog and the placement schema have both held steady across a few real consuming projects.",
  },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "About this page",
    body: [
      {
        kind: "text",
        text: "Illustrative, not a committed schedule — Rebar UI is a small, Open Beta project with one maintainer plus AI-assisted development, and dates here are deliberately omitted rather than guessed. The completed milestones above are real; the ones after \"0.10 Open Beta\" describe direction and intent, not promised delivery order or timing. See [Contributing](/about) if a specific gap here is something you'd want to help build.",
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <Container verticalPadding="var(--rebar-space-xl)">
      <Stack gap="lg">
        <Image src="/catalogue-heros/roadmap.jpeg" alt="Roadmap hero" style={{ width: "100%", borderRadius: "8px" }} />
        <Heading level={1}>Roadmap</Heading>
        <Text color="secondary">
          Where Rebar UI has been, and where it&apos;s headed — from the first npm publish through
          the current Open Beta and beyond.
        </Text>

        <Timeline items={MILESTONES} />

        <NextBlockRenderer blocks={BLOCKS} />
      </Stack>
    </Container>
  );
}
