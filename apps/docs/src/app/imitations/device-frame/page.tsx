import { DeviceFrame, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

// An inline SVG data URI stands in for a real tall screenshot (taller than the phone screen, so the
// top-anchored crop is visible).
const TALL_SCREENSHOT = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="1000" viewBox="0 0 360 1000"><rect width="360" height="1000" fill="#f5f5f5"/><rect x="20" y="30" width="320" height="56" rx="8" fill="#0066cc"/><rect x="20" y="110" width="320" height="140" rx="8" fill="#e0e0e0"/><rect x="20" y="270" width="320" height="140" rx="8" fill="#e0e0e0"/><rect x="20" y="430" width="320" height="140" rx="8" fill="#e0e0e0"/><rect x="20" y="590" width="320" height="140" rx="8" fill="#e0e0e0"/></svg>',
)}`;

const WIDE_SCREENSHOT = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><rect width="1200" height="750" fill="#f5f5f5"/><rect x="40" y="40" width="1120" height="70" rx="8" fill="#0066cc"/><rect x="40" y="140" width="540" height="560" rx="8" fill="#e0e0e0"/><rect x="620" y="140" width="540" height="560" rx="8" fill="#e0e0e0"/></svg>',
)}`;

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
        text: "Size and colour come from tokens with fallbacks: `--rebar-device-frame-bezel-color` (dark by default), `--rebar-device-frame-bezel-width`, `--rebar-device-frame-radius`, `--rebar-device-frame-phone-ratio` (default 9 / 19.5), `--rebar-device-frame-tablet-ratio` (default 4 / 3) and `--rebar-device-frame-max-width`. A tall screenshot in the phone or tablet frame is cropped from the top (`object-fit: cover; object-position: top`), never stretched.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The bezel, notch and browser toolbar are decoration and are `aria-hidden`. The screen content is a sibling, not a child, of those pieces, so the image's `alt` text and any other content stay in the accessibility tree. The root is a real `<figure>`; `caption` renders a `<figcaption>`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="device-frame"` and `data-rebar-variant` (`phone`, `tablet` or `browser`) on the root; `data-rebar-part` values `bezel`, `screen`, `notch` (phone only) and `toolbar` (browser only).',
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
            <img src={TALL_SCREENSHOT} alt="A tall placeholder app screen, cropped from the top" />
          </DeviceFrame>
          <DeviceFrame variant="tablet" caption="Tablet">
            <img src={WIDE_SCREENSHOT} alt="A wide placeholder app screen" />
          </DeviceFrame>
          <DeviceFrame variant="browser" title="app.example.com" caption="Browser">
            <img src={WIDE_SCREENSHOT} alt="A placeholder dashboard in a browser" />
          </DeviceFrame>
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
