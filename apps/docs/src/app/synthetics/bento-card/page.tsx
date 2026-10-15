import { BentoCard, BentoGrid, DeviceFrame, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { APP_SCREEN, APP_SCREEN_2 } from "@/data/placeholderScreens";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<BentoGrid>\n  <BentoCard\n    span={3}\n    tone="tint-1"\n    title="Today's readings"\n    body="Laid out to read straight through."\n    media={<DeviceFrame><img src="/screens/today.png" alt="The Today screen" /></DeviceFrame>}\n  />\n  <BentoCard span={6} mediaPosition="end" title="A journal only you can read" body="..." media={...} />\n</BentoGrid>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["BentoCard"] ?? [] },
  {
    type: "doc-section",
    heading: "Sizing and media",
    body: [
      {
        kind: "text",
        text: "A card sizes to its content: `media` is a whole `DeviceFrame` and is never cropped, and the card never sets `overflow`. `mediaPosition=\"below\"` puts the text first with the media centred under it. `\"end\"` puts the text at the start and the media at the end on the wide grid (it stacks like `below` on narrow screens), so use it with `span` 3 or 6. Tints use `--rebar-color-tint-1` to `--rebar-color-tint-4` (neutral fallbacks; `theme-clean` defines them, light and dark).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The title is a real heading (`headingLevel` 3 by default, or 2) and the media keeps its own alt text. DOM order is text, then media, which is also the reading order on every layout.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="bento-card"`, `data-rebar-span`, `data-rebar-tone` and `data-rebar-media-position` on the root; `data-rebar-part` values `text`, `title`, `body` and `media`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. The nearest Ant Design shape is a `Card` inside a `Col`." }],
  },
];

export default function BentoCardPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>BentoCard</Heading>
      <Text color="secondary">
        One tile of a <code>BentoGrid</code>: a title, optional body and optional media, on a neutral
        or tinted surface.
      </Text>
      <LivePreview>
        <div id="bento-demo">
          <BentoGrid>
            <BentoCard
              span={3}
              tone="tint-1"
              title="Today's readings"
              body="Laid out to read straight through."
              media={
                <DeviceFrame>
                  <img src={APP_SCREEN} alt="A placeholder Today screen" />
                </DeviceFrame>
              }
            />
            <BentoCard
              span={3}
              tone="tint-2"
              title="Prayers you can listen to"
              body="The Rosary, with narration."
              media={
                <DeviceFrame>
                  <img src={APP_SCREEN_2} alt="A placeholder Journal screen" />
                </DeviceFrame>
              }
            />
            <BentoCard
              span={6}
              tone="tint-3"
              mediaPosition="end"
              title="A journal only you can read"
              body="Encrypted on your device with a passphrase only you know."
              media={
                <DeviceFrame>
                  <img src={APP_SCREEN_2} alt="A placeholder Journal screen" />
                </DeviceFrame>
              }
            />
          </BentoGrid>
        </div>
      </LivePreview>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
