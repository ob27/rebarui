import { Button, FeatureShowcase, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneList, PhoneRow, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";

const CODE = `<FeatureShowcase
  eyebrow="Offline"
  title="Works on the depot floor"
  body="Tasks sync on the device and catch up when the signal returns."
  media={<DeviceFrame variant="phone">{/* the Tideline task list */}</DeviceFrame>}
/>

<FeatureShowcase tone="inverse" reverse title="Rules for every shift" media={...} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["FeatureShowcase"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [
      {
        kind: "text",
        text: "Text and media stack on narrow screens with the text first, so DOM, reading and visual order agree. From 768px up they sit side by side; `reverse` moves the media to the other side at that width only. `tone=\"inverse\"` gives a dark band from `--rebar-color-bg-inverse` and `--rebar-color-text-inverse`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<section>` with a real heading (`headingLevel` 2 by default, 3 when nested). Pass your own `aria-labelledby` for a named landmark. The media slot is ordinary content, so a screenshot keeps its `alt` text.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="feature-showcase"`, `data-rebar-tone` and `data-rebar-reverse` on the root; `data-rebar-part` values `text`, `media`, `eyebrow`, `title` and `body`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. The nearest Ant Design shape is a `Row` with two `Col`s, a structural rewrite. The `feature-showcase` placement block prints this component from plain data.",
      },
    ],
  },
];

function Phone({ title }: { title: string }) {
  return (
    <TidelinePhone title={title} tabs={1} height={300} width={220} padding={12}>
      <PhoneList>
        <PhoneRow title="Logo shortlist" meta="Maya Chen" tint={1} />
        <PhoneRow title="Offline sync" meta="Jonas Weber" tint={2} />
      </PhoneList>
    </TidelinePhone>
  );
}

function Tile() {
  return <div aria-hidden="true" style={{ height: 90, borderRadius: 14, background: "var(--rebar-color-tint-3)" }} />;
}

export default function FeatureShowcasePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FeatureShowcase</Heading>
      <Text color="secondary">One feature row: an eyebrow, a headline and a body beside a piece of media.</Text>

      <DemoStage
        title="Feature row"
        caption="Text beside a device, stacking on narrow screens"
        code={CODE}
        states={[
          { label: "Reversed", node: <FeatureShowcase reverse eyebrow="Inbox" title="Quiet by default" body="One digest a day." media={<Tile />} /> },
          { label: "Inverse band", node: <FeatureShowcase tone="inverse" eyebrow="Rota" title="Every shift covered" body={<Button variant="secondary">See how</Button>} media={<Tile />} /> },
        ]}
      >
        <FeatureShowcase
          eyebrow="Offline"
          title="Works on the depot floor"
          body="Tasks sync on the device and catch up when the signal returns."
          media={<Phone title="Tasks" />}
        />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Product page" caption="Two rows alternating sides" widths={false}>
        <Stack gap="lg">
          <FeatureShowcase eyebrow="Offline" title="Works on the depot floor" body="Tasks sync on the device and catch up when the signal returns." media={<Phone title="Tasks" />} />
          <FeatureShowcase
            tone="inverse"
            reverse
            eyebrow="Reminders"
            title="Nothing slips through"
            body={<Button variant="secondary">Try Tideline mobile</Button>}
            media={<Phone title="Reminders" />}
          />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
