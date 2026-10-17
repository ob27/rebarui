"use client";

import { Button, Heading, Input, Section, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { HOME_CARDS } from "@/fixtures/athic-marketing";

const CODE = `<Section eyebrow="Every day" title="Your daily practice, in one place.">…</Section>
<Section tone="tint" eyebrow="Perspectives" title="Reflections worth sitting with." lede="Essays, dialogues and letters on the Faith.">…</Section>
<Section tone="dark" title="Athic isn't live yet." lede="Leave your email and we'll tell you the moment it launches.">
  <Input placeholder="you@example.com" /> <Button>Notify me</Button>
</Section>
<Section tone="panel" eyebrow="Independent" title="Not an official Church product.">…</Section>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Section"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      { kind: "text", text: "Renders a `<section>` labelled by its `<h2>` title (`aria-labelledby`), so it is a named landmark. Without a title it is a plain section; pass `aria-label` to name it. Keep one `<h1>` per page (HeroSplit or PageHeader) and use Section for the `<h2>` bands under it." },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="section"` with `data-rebar-tone`, `data-rebar-width`, `data-rebar-spacing` and `data-rebar-rounded`. Parts: `inner`, `header`, `eyebrow`, `title`, `lede`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. Ant Design has no equivalent; use a `Layout.Content` with your own background." }],
  },
];

const cards = (
  <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
    {HOME_CARDS.map((c) => (
      <div key={c.id} style={{ borderRadius: "var(--rebar-radius)", padding: "16px 18px", display: "grid", gap: 4, background: `var(--rebar-color-tint-${c.tint})`, color: "var(--rebar-color-text-primary)" }}>
        <b style={{ fontFamily: "var(--rebar-font-family-display)" }}>{c.title}</b>
        <span style={{ fontSize: 14, color: "var(--rebar-color-text-secondary)" }}>{c.body}</span>
      </div>
    ))}
  </div>
);

export default function SectionPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Section</Heading>
      <Text color="secondary">A page band with an eyebrow, an h2 and a lede.</Text>

      <DemoStage
        title="Wrappers"
        caption="Band, tinted band, dark panel, rounded panel"
        code={CODE}
      >
        <Stack gap="md" style={{ padding: "8px 0 28px" }}>
          <Section eyebrow="Every day" title="Your daily practice, in one place.">{cards}</Section>
          <Section tone="tint" eyebrow="Perspectives" title="Reflections worth sitting with." lede="Essays, dialogues and letters on the Faith.">{cards}</Section>
          <Section tone="dark" title="Athic isn’t live yet." lede="Leave your email and we’ll tell you the moment it launches on iOS and Android.">
            <div style={{ display: "flex", gap: 8, maxWidth: 460, width: "100%", margin: "0 auto" }}>
              <Input aria-label="Email" placeholder="you@example.com" style={{ flex: 1, minWidth: 0 }} />
              <Button>Notify me</Button>
            </div>
          </Section>
          <Section tone="panel" eyebrow="Independent" title="Not an official Church product." lede="Athic is an independent project." />
        </Stack>
      </DemoStage>

      <DemoStage title="Spacing and width" caption="Tight, loose, width sm, and a band with no heading" widths={false}>
        <Stack gap="md">
          <Section spacing="tight" tone="tint" title="Tight: 32px" />
          <Section spacing="loose" tone="tint" title="Loose: 88px" />
          <Section width="sm" tone="tint" eyebrow="Narrow" title="A narrow column" lede="Capped at 640px." />
          <Section tone="panel" aria-label="Callout">{cards}</Section>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Transparency summary" caption="Tight band, then the dark waitlist panel" defaultWidth="phone" widths>
        <Stack gap="md">
          <Section spacing="tight" eyebrow="Transparency" title="What we hold, and where.">
            {cards}
          </Section>
          <Section tone="dark" spacing="tight" title="Athic isn’t live yet." lede="Leave your email and we’ll let you know the moment it launches.">
            <Stack gap="sm">
              <Input aria-label="Email address" placeholder="you@example.com" />
              <Button>Notify me</Button>
            </Stack>
          </Section>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
