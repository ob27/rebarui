import { AspectRatio, Card, Carousel, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, project } from "@/fixtures/tideline";

const CODE = `<Carousel aria-label="Harbour rebrand photos">
  <AspectRatio ratio={4 / 3} placeholder={0} />
  <AspectRatio ratio={4 / 3} placeholder={1} />
  <AspectRatio ratio={4 / 3} placeholder={2} />
</Carousel>

// controlled
<Carousel index={index} onIndexChange={setIndex}>{slides}</Carousel>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Carousel"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: 'Root is `role="region"` with `aria-roledescription="carousel"`; each slide is a `role="group"` labelled "N of M" and hidden while off-screen. Left and right arrows navigate when focused; the position text is `aria-live="polite"`.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="carousel"` on the root; `data-rebar-part` values `viewport`, `track`, `slide`, `controls` and `dots`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD's carousel is slide-count driven rather than children driven, so this is a structural rewrite." }],
  },
];

const slides = (n: number) => Array.from({ length: n }, (_, i) => <AspectRatio key={i} ratio={4 / 3} placeholder={i} />);
const harbourFiles = FILES.filter((f) => f.project === "harbour");

export default function CarouselPage() {
  const harbour = project("harbour");
  return (
    <Stack gap="lg">
      <Heading level={1}>Carousel</Heading>
      <Text color="secondary">One slide at a time, with arrows, dots and an N of M count. Keep every slide the same shape.</Text>

      <DemoStage
        title="Harbour rebrand photos"
        caption="Four slides at one aspect ratio"
        code={CODE}
        states={[
          { label: "Two slides", node: <Carousel aria-label="Two photos">{slides(2)}</Carousel> },
          { label: "Single slide", node: <Carousel aria-label="One photo">{slides(1)}</Carousel> },
        ]}
      >
        <Carousel aria-label="Harbour rebrand photos">{slides(4)}</Carousel>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Project gallery" caption="Photos from the project, with the file list beside them" widths={false}>
        <Card title={harbour.name} style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Carousel aria-label="Project photos">{slides(3)}</Carousel>
            <Text size="sm" color="secondary">{harbourFiles.map((f) => f.name).join(", ")}</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
