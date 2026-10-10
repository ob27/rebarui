import { BackdropSection, Button, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { BACKDROP_ART } from "@/data/placeholderScreens";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<BackdropSection image={{ src: "/art/harvest-1600.jpg" }} scrim="start" rounded>\n  <Heading level={2}>Every answer, chapter and verse.</Heading>\n  <Text>Open any citation to see the paragraph it rests on.</Text>\n</BackdropSection>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["BackdropSection"] ?? [] },
  {
    type: "doc-section",
    heading: "Layers",
    body: [
      {
        kind: "text",
        text: "The image and the scrim are absolutely positioned on their own class names and always cover the whole section (`inset: 0`); the content sits in a separate relatively positioned part. Scrims: `soft` (a light top-to-bottom darkening), `strong`, `start` (darker on the text side, fading across) and `none`. The scrim colour is `--rebar-backdrop-scrim-color` (default black, mixed to transparency). `rounded` makes an inset rounded panel (`--rebar-backdrop-section-radius`); otherwise the section is full-bleed. Text uses `--rebar-color-text-inverse`.",
      },
      {
        kind: "text",
        text: "Use backdrop art at least as wide as the section: a 640px image stretched across a 1360px section looks pixelated. 1600px wide covers most layouts.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The image is decorative by default (`alt=\"\"` and `aria-hidden`); pass `image.alt` only if the art carries information. The scrim is `aria-hidden`. Text contrast depends on the art plus the scrim: check it against the darkest scrim you can afford, not the average pixel.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="backdrop-section"`, `data-rebar-scrim` and `data-rebar-rounded` on the root; `data-rebar-part` values `image`, `scrim` and `content`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Ant Design has no equivalent; this is a bespoke section." }],
  },
];

export default function BackdropSectionPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BackdropSection</Heading>
      <Text color="secondary">
        A section with art behind it and inverse-coloured content on top, full-bleed or as a rounded
        inset panel.
      </Text>
      <LivePreview>
        <Stack gap="lg">
          <div id="backdrop-demo-1">
            <BackdropSection image={{ src: BACKDROP_ART }} scrim="start" rounded>
              <Stack gap="sm" style={{ maxWidth: "32rem" }}>
                <Heading level={2}>Every answer, chapter and verse.</Heading>
                <Text>Open any citation to see the exact paragraph a reply rests on.</Text>
                <div>
                  <Button variant="secondary">Try one question</Button>
                </div>
              </Stack>
            </BackdropSection>
          </div>
          <div id="backdrop-demo-2">
            <BackdropSection image={{ src: BACKDROP_ART }} scrim="strong">
              <Heading level={2}>Full-bleed, strong scrim</Heading>
            </BackdropSection>
          </div>
        </Stack>
      </LivePreview>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
