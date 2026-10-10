import {
  BackdropSection,
  BentoCard,
  BentoGrid,
  DeviceFrame,
  DeviceStage,
  FeatureShowcase,
  Heading,
  Stack,
  Text,
} from "rebar-ui";
import { APP_SCREEN, APP_SCREEN_2, BACKDROP_ART, WIDE_SCREEN } from "@/data/placeholderScreens";

/**
 * A dev-only harness for the marketing-kit components, with no docs sidebar around it, so the layout
 * checks in `scripts/check-marketing-kit.cjs` measure the components and not the docs shell. It
 * renders DeviceStage at a sweep of container widths either side of the 480px compact breakpoint.
 */
const FLOATS = [
  { id: "gospel", side: "start" as const, top: "58%", label: "Today's Gospel", content: "Luke 11:27-28, checked in" },
  { id: "ask", side: "end" as const, top: "16%", label: "Ask", content: "CCC 1374 is cited" },
];
const FOUR = [
  ...FLOATS,
  { id: "c", side: "start" as const, top: "12%", content: "Streak: 12 days" },
  { id: "d", side: "end" as const, top: "70%", content: "Narration ready" },
];
const SWEEP = [300, 400, 479, 480, 520, 640, 900];

const screen = (src: string, alt: string) => (
  <DeviceFrame>
    <img src={src} alt={alt} />
  </DeviceFrame>
);

export default function MarketingKitHarness() {
  return (
    <Stack gap="lg" style={{ padding: "var(--rebar-space-md)" }}>
      <Heading level={1}>Marketing kit harness</Heading>

      <section aria-label="Device stage width sweep">
        <Stack gap="lg">
          {SWEEP.map((w) => (
            <div key={w} style={{ width: w, maxWidth: "100%" }} data-sweep={w}>
              <DeviceStage glow floats={w % 2 ? FLOATS : FOUR}>
                {screen(APP_SCREEN, `App screen at ${w}px`)}
              </DeviceStage>
            </div>
          ))}
          <DeviceStage glow floats={FLOATS}>
            {screen(APP_SCREEN_2, "App screen at full width")}
          </DeviceStage>
        </Stack>
      </section>

      <section aria-label="Frames">
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <DeviceFrame variant="tablet">
            <img src={WIDE_SCREEN} alt="Tablet screen" />
          </DeviceFrame>
          <DeviceFrame variant="browser" title="app.example.com">
            <img src={WIDE_SCREEN} alt="Browser screen" />
          </DeviceFrame>
        </Stack>
      </section>

      <BentoGrid>
        <BentoCard span={3} tone="tint-1" title="Readings" body="Read straight through." media={screen(APP_SCREEN, "Readings screen")} />
        <BentoCard span={3} tone="tint-2" title="Journal" body="Private." media={screen(APP_SCREEN_2, "Journal screen")} />
        <BentoCard span={6} tone="tint-3" mediaPosition="end" title="Wide card" body="Text at the start, media at the end." media={screen(APP_SCREEN, "Wide card screen")} />
        <BentoCard span={2} tone="tint-4" title="Two" />
        <BentoCard span={2} title="Two" />
        <BentoCard span={2} title="Two" />
      </BentoGrid>

      <BackdropSection image={{ src: BACKDROP_ART }} scrim="start" rounded>
        <Heading level={2}>Rounded, start scrim</Heading>
        <Text>Text on art.</Text>
      </BackdropSection>
      <BackdropSection image={{ src: BACKDROP_ART }} scrim="strong">
        <Heading level={2}>Full-bleed, strong scrim</Heading>
      </BackdropSection>

      <FeatureShowcase
        eyebrow="Planning"
        title="One feature, one headline"
        body="Text beside media."
        media={screen(APP_SCREEN, "Feature screen")}
      />
    </Stack>
  );
}
