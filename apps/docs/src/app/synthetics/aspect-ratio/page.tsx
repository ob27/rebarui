import { AspectRatio, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `<AspectRatio ratio={16 / 9} placeholder />
<AspectRatio ratio={1} placeholder={2} />
<AspectRatio ratio={4 / 3} src="/photos/depot.jpg" alt="Northern depot fascia" />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["AspectRatio"] ?? [] },
  {
    type: "doc-section",
    heading: "Placeholders",
    body: [
      {
        kind: "text",
        text: "Empty by default. `placeholder` shows a built-in illustrated image whose own ratio is closest to the one you ask for; pass a number to pick a variant of that ratio.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "Pass a meaningful `alt` with a real `src`. With only `placeholder` set, or nothing, the box is decorative and `alt` is left empty." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="aspect-ratio"` on the root; `data-rebar-part="empty"` on the box when neither `src` nor `placeholder` is set.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD has no aspect-ratio component. Replace it with your codebase's fixed-ratio convention (a CSS utility, or the padding-top trick)." }],
  },
];

const RATIOS: { label: string; ratio: number }[] = [
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "2:3", ratio: 2 / 3 },
  { label: "9:16", ratio: 9 / 16 },
];

export default function AspectRatioPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>AspectRatio</Heading>
      <Text color="secondary">Keeps content at a fixed width-to-height ratio, with a placeholder when there is no image yet.</Text>

      <DemoStage
        title="Project cover"
        caption="A 16:9 placeholder, as shown before a real photo exists"
        code={CODE}
        states={[
          ...RATIOS.map((r) => ({
            label: r.label,
            node: <AspectRatio ratio={r.ratio} placeholder />,
          })),
          { label: "Empty box", node: <AspectRatio ratio={4 / 3} /> },
        ]}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <AspectRatio ratio={16 / 9} placeholder />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project cards" caption="Every cover is cropped to the same 4:3 box" widths={false}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--rebar-space-md)" }}>
          {PROJECTS.slice(0, 3).map((p, i) => (
            <Card key={p.id} >
              <Stack gap="sm">
                <AspectRatio ratio={4 / 3} placeholder={i} />
                <Text style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{p.name}</Text>
                <Text size="sm" color="secondary">{p.kicker}, due {p.due}</Text>
              </Stack>
            </Card>
          ))}
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
