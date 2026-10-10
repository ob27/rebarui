import { AspectRatio, Heading, ScrollRail, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CARD_COUNT = 8;
const EXAMPLE_RATIO = 4 / 3;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: `// Manual rail: prev/next buttons, scroll-snap, one item width per step\n<ScrollRail aria-label="Perspectives" style={{ "--rebar-scroll-rail-item-width": "16rem" }}>\n  {cards}\n</ScrollRail>\n\n// Auto-scrolling strip with a seamless loop (40 px/s). Pause/Play appears automatically.\n<ScrollRail aria-label="Screenshots" autoScroll loop gap="lg">\n  {shots}\n</ScrollRail>\n\n// Custom speed, no snap\n<ScrollRail aria-label="Logos" autoScroll={60} snap={false}>\n  {logos}\n</ScrollRail>`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ScrollRail"] ?? [] },
  {
    type: "doc-section",
    heading: "How it differs from Carousel",
    body: [
      {
        kind: "text",
        text: "`Carousel` shows one translated slide at a time with dots and a position readout. `ScrollRail` is a native horizontal scroller: many items visible at once, real scroll position, optional scroll-snap, and optional continuous auto-scroll. Set the width of one item with the `--rebar-scroll-rail-item-width` custom property on the rail (default `min(18rem, 80vw)`).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'Root is `role="region"` named by the required `aria-label` (deliberately not `aria-roledescription="carousel"`); the track is a `role="list"` and each item a `role="listitem"`. The viewport is focusable so the arrow keys scroll it from the keyboard. Prev/next buttons disable at either end.',
      },
      {
        kind: "text",
        text: "Auto-scroll pauses while the pointer is over or pressing the viewport, while focus is inside it, and while the tab is hidden; it never runs under `prefers-reduced-motion` (the rail becomes a normal manual rail with prev/next). Whenever auto-scroll is active a visible Pause/Play button is rendered (WCAG 2.2.2), and the prev/next buttons are hidden. With `loop`, the duplicated items are `aria-hidden` and `inert`, so assistive tech and Tab never see them.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="scroll-rail"` on the root, with `data-rebar-state` (`static`, `scrolling` or `paused`), `data-rebar-gap`, `data-rebar-snap`, `data-rebar-can-scroll-start` and `data-rebar-can-scroll-end`. `data-rebar-part` values `viewport`, `track`, `item`, `control` (prev/next, with `data-rebar-direction`) and `toggle` (Pause/Play).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered. Ant Design has no direct equivalent; the nearest idiom is a `Flex` with `overflow-x: auto` or a `Carousel` with `slidesToShow`, so this is a structural rewrite at migration time.",
      },
    ],
  },
];

export default function ScrollRailPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>ScrollRail</Heading>
      <Text color="secondary">
        A horizontally scrolling rail of cards or images, for a strip that would otherwise wrap
        into a grid. Native scrolling with optional scroll-snap, prev/next buttons that move one
        item, and optional auto-scroll that stops whenever a person might be reading, interacting,
        or has asked their system for reduced motion.
      </Text>

      <LivePreview>
        <Stack gap="lg">
          <ScrollRail aria-label="Example perspectives" style={{ "--rebar-scroll-rail-item-width": "14rem" } as React.CSSProperties}>
            {Array.from({ length: CARD_COUNT }, (_, i) => (
              <AspectRatio key={i} ratio={EXAMPLE_RATIO} placeholder={i} />
            ))}
          </ScrollRail>
          <ScrollRail
            aria-label="Example auto-scrolling strip"
            autoScroll
            loop
            style={{ "--rebar-scroll-rail-item-width": "10rem" } as React.CSSProperties}
          >
            {Array.from({ length: CARD_COUNT }, (_, i) => (
              <AspectRatio key={i} ratio={EXAMPLE_RATIO} placeholder={i + 2} />
            ))}
          </ScrollRail>
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
