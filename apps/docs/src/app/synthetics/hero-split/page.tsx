"use client";

import { Button, Heading, HeroSplit, NavBar, Section, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { AthicHeroMedia } from "@/fixtures/AthicBits";
import { ART_NAVY, ATHIC_PITCH, ATHIC_SUB, athicArt } from "@/fixtures/athic-marketing";

const CODE = `<HeroSplit
  eyebrow="Daily Catholic practice"
  title="Daily practice plus a catechist in your pocket."
  lede="Readings, the Rosary, a private journal and Ask, grounded in the Catechism."
  actions={<Button size="lg">Try one question</Button>}
  note="Free on the web. Android app coming soon."
  backdrop={artUrl}
  media={
    <DeviceStage glow floats={chips}>
      <DeviceFrame variant="phone">{/* the app's Today screen */}</DeviceFrame>
    </DeviceStage>
  }
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["HeroSplit"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [
      { kind: "text", text: "Two columns when the hero is wider than 760px (copy, then media); one column below that. The breakpoint is the hero's own width (a container query), so it follows a narrow column and the width presets above, not just the browser window." },
      { kind: "text", text: "`narrow=\"art-first\"` (the default with a backdrop) shows the art alone as a rounded band, then the copy on the page surface, then the media on a tint. `stack` keeps the art behind the copy and stacks the media under it. `overlay` is `stack` with an even scrim. The start-side scrim keeps the copy readable on any art." },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      { kind: "text", text: "The title is the page's one `<h1>`. The backdrop is decorative (`aria-hidden`, empty `alt`). The scrim keeps the inverse text at AA contrast over the art. On phones the actions fill the width, so every target is at least 44px tall with a `lg` button." },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      { kind: "text", text: '`data-rebar-component="hero-split"` with `data-rebar-tone`, `data-rebar-narrow`, `data-rebar-media` and `data-rebar-backdrop`. Parts: `surface`, `backdrop`, `copy`, `eyebrow`, `title`, `lede`, `actions`, `note`, `media`.' },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Ant Design has no hero; it is a `Row` and `Col` pair with a background image." }],
  },
];

const art = athicArt("dusk", ART_NAVY);
const actions = <Button size="lg">Try one question</Button>;
const note = "Free on the web. Android app coming soon.";

export default function HeroSplitPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>HeroSplit</Heading>
      <Text color="secondary">A headline, actions and a phone on art. The art comes first on phones.</Text>

      <DemoStage
        title="Home hero"
        caption="Eyebrow, title, lede, actions, note, backdrop and a phone with floating chips"
        code={CODE}
      >
        <HeroSplit
          eyebrow="Daily Catholic practice"
          title={ATHIC_PITCH}
          lede={ATHIC_SUB}
          actions={actions}
          note={note}
          backdrop={art}
          media={<AthicHeroMedia />}
        />
      </DemoStage>

      <DemoStage title="Variants" caption="No device, light tone, no backdrop" widths={false}>
        <Stack gap="lg">
          <HeroSplit eyebrow="Mission" title="Why Athic exists" lede="Independent, and honest about it." backdrop={art} minHeight="260px" actions={<Button size="lg">Read the mission</Button>} />
          <HeroSplit tone="tint" eyebrow="Athic app" title="A daily practice, in your pocket." lede={ATHIC_SUB} actions={<Button size="lg">Join the waitlist</Button>} media={<AthicHeroMedia chips={false} height={320} />} />
          <HeroSplit title="Perspectives" lede="Essays, dialogues and letters on the Faith." minHeight="220px" />
        </Stack>
      </DemoStage>
      <DemoStage title="Phone, 390" caption="Art-first (left) and overlay (right)" widths={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ width: 360, maxWidth: "100%", border: "1px solid var(--rebar-color-border-strong)", borderRadius: 26, overflow: "hidden" }}>
            <HeroSplit title={ATHIC_PITCH} lede={ATHIC_SUB} backdrop={art} actions={actions} note={note} media={<AthicHeroMedia chips={false} height={300} />} />
          </div>
          <div style={{ width: 360, maxWidth: "100%" }}>
            <HeroSplit narrow="overlay" eyebrow="Daily practice" title="A catechist in your pocket." backdrop={art} actions={actions} />
          </div>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Home, above the fold" caption="Under the site nav, then the first band" widths={false} padding="none">
        <div style={{ display: "grid", gap: 0 }}>
          <div style={{ padding: "8px 24px" }}>
            <NavBar aria-label="Main" items={[{ label: "The app", href: "#", current: true }, { label: "Perspectives", href: "#" }, { label: "About", href: "#" }]} />
          </div>
          <div style={{ padding: "0 24px" }}>
            <HeroSplit eyebrow="Daily Catholic practice" title={ATHIC_PITCH} lede={ATHIC_SUB} actions={actions} note={note} backdrop={art} media={<AthicHeroMedia />} />
          </div>
          <Section eyebrow="Every day" title="Your daily practice, in one place." />
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
