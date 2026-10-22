"use client";

import { Button, Card, Heading, Input, Puppet, Stack, Tag, Text } from "rebar-ui";
import "@rebar-ui/theme-con/theme.css";
import { CON, CON_CANVAS, CON_LINES } from "@/data/conLayers";

/**
 * A dev-only look at the Con theme and the Puppet: the same panel in light and dark, each scoped with
 * `data-rebar-theme="con"`. Not linked from the site.
 */
const LAYERS: [string, string][] = [
  ["/mascot/con-body.png", "body"],
  ["/mascot/con-rod-left.png", "rod left"],
  ["/mascot/con-rod-right.png", "rod right"],
  ["/mascot/con-pupils.png", "pupils"],
  ["/mascot/con-eyes-mask.png", "eyes mask"],
  ["/mascot/con-lids.png", "lids"],
  ["/mascot/con-sticker.png", "flat sticker"],
];

function Panel({ mode }: { mode: "light" | "dark" }) {
  return (
    <div
      data-rebar-theme="con"
      data-theme={mode}
      style={{ background: "var(--rebar-color-bg-secondary)", color: "var(--rebar-color-text-primary)", border: "2px solid var(--rebar-color-border)", borderRadius: 14, padding: 24 }}
    >
      <Stack gap="lg">
        <Heading level={2}>Con theme, {mode}</Heading>
        <div style={{ background: "#1181ff", border: "2px solid #0b0b14", borderRadius: 12, padding: "56px 24px 0", display: "flex", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ paddingTop: 70 }}>
            <Puppet layers={CON} canvas={CON_CANVAS} size={240} weight="heavy" says={CON_LINES} label="Con" />
          </div>
        </div>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Tag>Opinion</Tag>
        </Stack>
        <Input aria-label="Search" placeholder="Search constructs" />
        <Card>
          <Stack gap="sm">
            <Heading level={3}>A card</Heading>
            <Text color="secondary">Outlined, with a hard shadow. Headings are Bricolage Grotesque, text is IBM Plex Sans.</Text>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}

export default function DevConPage() {
  return (
    <Stack gap="lg" style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Heading level={1}>Con: theme and Puppet (dev)</Heading>
      <Text color="secondary">The `@rebar-ui/theme-con` tokens and the `Puppet` construct, in light and dark. Hover or click Con.</Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
        <Panel mode="light" />
        <Panel mode="dark" />
      </div>
      <Heading level={2}>The layers</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
        {LAYERS.map(([src, label]) => (
          <figure key={src} style={{ margin: 0, border: "2px solid #0b0b14", borderRadius: 10, padding: 8, background: "repeating-conic-gradient(#e8e9f6 0 25%, #fff 0 50%) 50% / 16px 16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ width: "100%", height: 150, objectFit: "contain" }} />
            <figcaption style={{ fontFamily: "monospace", fontSize: 11 }}>{label}</figcaption>
          </figure>
        ))}
      </div>
    </Stack>
  );
}
