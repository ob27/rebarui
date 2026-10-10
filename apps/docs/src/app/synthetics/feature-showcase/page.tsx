import { Button, DeviceFrame, FeatureShowcase, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SCREENSHOT = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="1000" viewBox="0 0 360 1000"><rect width="360" height="1000" fill="#f5f5f5"/><rect x="20" y="30" width="320" height="56" rx="8" fill="#0066cc"/><rect x="20" y="110" width="320" height="140" rx="8" fill="#e0e0e0"/><rect x="20" y="270" width="320" height="140" rx="8" fill="#e0e0e0"/></svg>',
)}`;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<FeatureShowcase\n  eyebrow="Planning"\n  title="See your whole week at a glance"\n  body="Drag tasks between days and the plan updates everywhere."\n  media={\n    <DeviceFrame variant="phone">\n      <img src="/screens/week.png" alt="The week view" />\n    </DeviceFrame>\n  }\n  reverse\n/>\n\n// A dark band\n<FeatureShowcase tone="inverse" title="..." media={...} />`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["FeatureShowcase"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [
      {
        kind: "text",
        text: "One feature, one headline, one screenshot. Text and media stack on narrow screens with the text first, so the DOM order, the reading order and the visual order agree. From 768px up they sit side by side; `reverse` moves the media to the other side at that width only. `tone=\"inverse\"` uses `--rebar-color-bg-inverse` / `--rebar-color-text-inverse` (with dark fallbacks) for a dark band.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<section>` containing a real heading (`headingLevel` 2 by default, 3 when nested under another section); pass your own `aria-labelledby` if the section should be a named landmark. The media slot is ordinary content, so a `DeviceFrame` screenshot keeps its `alt` text.",
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
        text: "Not codemod-covered. The nearest Ant Design shape is a `Row` with two `Col`s, so this is a structural rewrite at migration time. The `feature-showcase` placement block prints this component from plain data.",
      },
    ],
  },
];

export default function FeatureShowcasePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FeatureShowcase</Heading>
      <Text color="secondary">
        One feature row: an eyebrow, a headline and a body beside a piece of media, usually a
        device-framed screenshot. Stacks on narrow screens.
      </Text>

      <LivePreview>
        <Stack gap="lg">
          <FeatureShowcase
            eyebrow="Planning"
            title="See your whole week at a glance"
            body="Drag tasks between days and the plan updates everywhere."
            media={
              <DeviceFrame variant="phone">
                <img src={SCREENSHOT} alt="A placeholder week view" />
              </DeviceFrame>
            }
          />
          <FeatureShowcase
            tone="inverse"
            reverse
            eyebrow="Reminders"
            title="Nothing slips through"
            body={<Button variant="secondary">Learn more</Button>}
            media={
              <DeviceFrame variant="phone">
                <img src={SCREENSHOT} alt="A placeholder reminders screen" />
              </DeviceFrame>
            }
          />
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
