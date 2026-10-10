import { DeviceFrame, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { APP_SCREEN, WIDE_SCREEN } from "@/data/placeholderScreens";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `<DeviceFrame variant="phone" caption="Home screen">\n  <img src="/screens/home.png" alt="The home screen showing today's plan" />\n</DeviceFrame>\n\n<DeviceFrame variant="browser" title="app.example.com">\n  <img src="/screens/dashboard.png" alt="The dashboard" />\n</DeviceFrame>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["DeviceFrame"] ?? [] },
  {
    type: "doc-section",
    heading: "Theming",
    body: [
      {
        kind: "text",
        text: "The frame is sized to the content and shows it whole: an `<img>` child renders at `width: 100%; height: auto`, so a phone or tablet screenshot is never cropped or distorted, and the frame is as tall as the screenshot is. A status strip above and a home-indicator strip below (both inside the rounded screen) keep the app's own header and tab bar clear of the rounded corners; turn them off with `statusBar={false}` / `homeIndicator={false}`. Every proportion is a share of the frame's width, so the frame scales as one piece. Tokens, all with fallbacks: `--rebar-device-frame-bezel-color`, `--rebar-device-frame-bezel-width`, `--rebar-device-frame-radius`, `--rebar-device-frame-status-bg` (default the bezel colour), `--rebar-device-frame-home-bg` (default `--rebar-color-bg-primary`), `--rebar-device-frame-home-indicator` (default a muted border colour), `--rebar-device-frame-punch-size` and `--rebar-device-frame-max-width`. Use a screenshot that already includes the app's own header and tab bar and was captured without the operating system's status bar.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The bezel, camera, status strip, home-indicator strip and browser toolbar are decoration and are `aria-hidden`. The screen content is a sibling, not a child, of those pieces, so the image's `alt` text and any other content stay in the accessibility tree. The root is a real `<figure>`; `caption` renders a `<figcaption>`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="device-frame"` and `data-rebar-variant` (`phone`, `tablet` or `browser`) on the root; `data-rebar-part` values `bezel`, `screen`, `notch` (the phone camera hole-punch, drawn only with the status strip), `status-bar` and `home-indicator` (phone and tablet) and `toolbar` (browser only).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. Ant Design has no device-frame component; replace it with your own mockup asset or CSS.",
      },
    ],
  },
];

export default function DeviceFramePage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>DeviceFrame</Heading>
      <Text color="secondary">
        A static device bezel around a screenshot: a phone, a tablet or a browser window. It draws
        the frame and keeps the screen content accessible; it has no behaviour of its own.
      </Text>

      <LivePreview>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <DeviceFrame variant="phone" caption="Phone">
            <img src={APP_SCREEN} alt="A placeholder app screen with its own header and tab bar" />
          </DeviceFrame>
          <DeviceFrame variant="tablet" caption="Tablet">
            <img src={WIDE_SCREEN} alt="A wide placeholder app screen" />
          </DeviceFrame>
          <DeviceFrame variant="browser" title="app.example.com" caption="Browser">
            <img src={WIDE_SCREEN} alt="A placeholder dashboard in a browser" />
          </DeviceFrame>
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
