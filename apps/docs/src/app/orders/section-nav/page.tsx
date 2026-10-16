import { Box, Heading, SectionNav, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW, PROJECTS } from "@/fixtures/tideline";

const CODE = `<SectionNav
  sections={[
    { id: "summary", label: "Summary" },
    { id: "tasks", label: "Tasks" },
  ]}
/>`;

const SECTIONS = [
  ...PROJECTS.map((p) => ({ id: `sn-project-${p.id}`, label: p.name, body: `${p.summary} Due ${p.due}.` })),
  ...CREW.map((c) => ({ id: `sn-crew-${c.id}`, label: c.name, body: `${c.role}, ${c.interviewed.startsWith("Booked") ? c.interviewed.toLowerCase() : `interviewed ${c.interviewed}`}.` })),
];
const SHORT = [
  { id: "sn-short-summary", label: "Summary", body: "Identity, site and launch kit." },
  { id: "sn-short-tasks", label: "Tasks", body: "Four open, two done." },
  { id: "sn-short-files", label: "Files", body: "Five files, 260 MB." },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SectionNav"] ?? [] },
  {
    type: "doc-section",
    heading: "Behaviour",
    body: [
      {
        kind: "list",
        items: [
          "The search box only appears once the list passes 12 sections.",
          "The top and bottom edges fade when the rail overflows (scroll mist).",
          "The rail scrolls to keep the active section in view; a manual scroll of the rail wins for 5 seconds.",
          "Its height is measured, so it never grows past its slice of the viewport.",
          "A small pointer on the right edge marks which side an out-of-view active section sits.",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'A real `<nav aria-label="Section navigation">` with plain `<a href="#...">` links. The beacon pointer is `aria-hidden`; `data-rebar-active` marks the active link.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="section-nav"`; `data-rebar-part` is `"search"`, `"scroll"`, `"list"`, `"item"`, `"empty"`, `"mist-top"`/`"mist-bottom"` or `"beacon-pointer-top"`/`"beacon-pointer-bottom"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `Anchor` covers the base tracking; the mist, beacon and pointer would have to be rebuilt by hand." }],
  },
];

type Sec = { id: string; label: string; body: string };
function Page({ sections }: { sections: Sec[] }) {
  return (
    <Stack direction="row" gap="xl" style={{ alignItems: "flex-start" }}>
      <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
        {sections.map((s) => (
          <Box key={s.id} id={s.id} style={{ minHeight: 110 }}>
            <Heading level={3}>{s.label}</Heading>
            <Text color="secondary">{s.body}</Text>
          </Box>
        ))}
      </Stack>
      <SectionNav sections={sections.map(({ id, label }) => ({ id, label }))} />
    </Stack>
  );
}

export default function SectionNavPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>SectionNav</Heading>
      <Text color="secondary">A right-hand index of the headings on the current page, tracking where you are.</Text>

      <DemoStage title="Studio overview" caption="Seventeen sections: scroll the page to see the active link follow" code={CODE} widths={false} states={[{ label: "Short list, no search", node: <Page sections={SHORT} /> }]}>
        <Page sections={SECTIONS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project page" caption="Three sections: a short rail with no search" widths={false}>
        <Page sections={SHORT.map((s) => ({ ...s, id: `${s.id}-ctx` }))} />
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
