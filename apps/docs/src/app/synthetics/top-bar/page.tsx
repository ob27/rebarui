"use client";

import { useState } from "react";
import { ActionSheet, AddIcon, Button, DeviceFrame, Heading, List, ListItem, MoreIcon, Stack, Text, TopBar } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ANSWER, ART, ARTICLE, DISCUSSIONS, QUESTION, TODAY } from "@/fixtures/athic";

const CODE = `<TopBar leading="back" title="Ask" trailing={<Button iconOnly variant="secondary" aria-label="New" startIcon={<AddIcon />} />} />

// inline rename
<TopBar leading="back" title={{ editable: true, value: name, onSave: setName }} />

// over a banner image
<TopBar tone="overlay" leading="back" trailing={<Button iconOnly aria-label="More" ... />} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["TopBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A `<header>` with the title as the page `<h1>`. The built-in back and menu buttons are 44px targets named `Back` and `Menu`; the status-bar strip is `aria-hidden`. An editable title is a button (`Title: …, Edit`) that becomes a text field: Enter or the check button saves, Escape cancels. A `badge` dot is an image labelled `New activity`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="top-bar"`, `data-rebar-tone="solid" | "overlay"`, `data-rebar-align`, `data-rebar-sticky`; parts `safe-area`, `bar`, `leading`, `title`, `logo`, `trailing`, `badge`, `edit`. Set `--rebar-top-bar-safe-area` to override `env(safe-area-inset-top)` and `--rebar-top-bar-height` (default 56px) to resize the bar. A bare `<button>` holding one svg in `trailing` is sized, rounded and recoloured by the bar.',
      },
    ],
  },
];

const ic = (d: string) => (
  <svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PLUS = <AddIcon />;
const MORE = <MoreIcon />;
const BELL = ic("M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 19a2 2 0 0 0 4 0");
const SEARCH = ic("M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5");
const SHARE = ic("M12 3v12M8 7l4-4 4 4M5 13v6h14v-6");

const iconBtn = (label: string, icon: React.ReactNode) => <Button key={label} iconOnly variant="secondary" aria-label={label}>{icon}</Button>;
const bar = (props: React.ComponentProps<typeof TopBar>) => (
  <div style={{ position: "relative", background: "var(--rebar-color-bg-inverse)", borderRadius: 14, overflow: "hidden", "--rebar-top-bar-safe-area": "0px" } as React.CSSProperties}>
    <TopBar {...props} />
  </div>
);

function Banner({ children, height = 210 }: { children?: React.ReactNode; height?: number }) {
  return (
    <div data-exempt style={{ position: "relative", height, background: ART[0], display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 35%, color-mix(in srgb, var(--rebar-color-bg-inverse) 72%, transparent))" }} />
      <Heading level={3} style={{ position: "relative", color: "var(--rebar-color-text-inverse)", padding: "0 20px 22px", textAlign: "center" }}>
        {children}
      </Heading>
    </div>
  );
}

export default function TopBarPage() {
  const [name, setName] = useState(DISCUSSIONS[0].title);
  const [sheet, setSheet] = useState(false);
  return (
    <Stack gap="lg">
      <Heading level={1}>TopBar</Heading>
      <Text color="secondary">The header of a phone screen: back or menu, a title, trailing actions, and the status-bar strip.</Text>

      <DemoStage
        title="TopBar"
        caption="Solid and overlay, phone width"
        code={CODE}
        widths={false}
        states={[
          { label: "Back, title, trailing action", node: bar({ leading: "back", title: "Ask", trailing: iconBtn("New discussion", PLUS) }) },
          { label: "Menu, logo, unread dot", node: bar({ leading: "menu", logo: "Athic", trailing: iconBtn("Notifications", BELL), badge: true }) },
          { label: "Centred title, long text", node: bar({ leading: "back", align: "center", title: "Confession to a priest and the seal of the confessional", trailing: iconBtn("More", MORE) }) },
          { label: "Tab root (no leading)", node: bar({ title: "Your Profile" }) },
          { label: "Trailing text action", node: bar({ leading: "back", title: "Your Details", trailing: <button type="button">Save</button> }) },
          { label: "Two trailing icons", node: bar({ leading: "back", title: "Library", trailing: <>{iconBtn("Search", SEARCH)}{iconBtn("More", MORE)}</> }) },
          { label: "Bare icon buttons (sized and recoloured by the bar)", node: bar({ leading: "back", title: "Library", trailing: <><button type="button" aria-label="Search">{SEARCH}</button><button type="button" aria-label="Share">{SHARE}</button></> }) },
          { label: "Logo with a link and mark", node: bar({ leading: "menu", logo: <a href="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v18M6 9h12" /></svg>Athic</a>, trailing: iconBtn("Notifications", BELL) }) },
          { label: "Editable title", node: bar({ leading: "back", title: { editable: true, value: name, onSave: setName, label: "Discussion title" } }) },
          { label: "Status-bar strip (28px)", node: <div style={{ background: "var(--rebar-color-bg-inverse)", borderRadius: 14, overflow: "hidden", "--rebar-top-bar-safe-area": "28px" } as React.CSSProperties}><TopBar leading="back" title="Ask" trailing={iconBtn("New discussion", PLUS)} /></div> },
          { label: "Overlay on a banner", node: <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}><TopBar tone="overlay" safeArea={false} leading="back" trailing={iconBtn("More", MORE)} /><Banner height={170}>{ARTICLE.title}</Banner></div> },
          { label: "Overlay, menu and share", node: <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}><TopBar tone="overlay" safeArea={false} leading="menu" trailing={<>{iconBtn("Share", SHARE)}{iconBtn("More", MORE)}</>} /><Banner height={170}>The Rosary, decade by decade</Banner></div> },
          { label: "Custom back and menu glyphs (backIcon, menuIcon)", node: bar({ leading: "back", backIcon: <span aria-hidden="true">‹</span>, title: "Ask", trailing: iconBtn("New discussion", PLUS) }) },
          { label: "Compact bar via --rebar-top-bar-* properties (padding, gap, 21px title, glyph buttons)", node: <div style={{ "--rebar-top-bar-height": "0px", "--rebar-top-bar-padding": "14px 16px", "--rebar-top-bar-gap": "12px", "--rebar-top-bar-button-width": "auto", "--rebar-top-bar-button-height": "auto", "--rebar-top-bar-button-padding": "4px", "--rebar-top-bar-button-font-size": "20px", "--rebar-top-bar-title-padding": "0", "--rebar-top-bar-title-size": "21px", "--rebar-top-bar-title-line-height": "normal", "--rebar-top-bar-title-letter-spacing": "normal" } as React.CSSProperties}>{bar({ leading: "back", backIcon: <span aria-hidden="true">‹</span>, title: "Your Topics", trailing: <button type="button" aria-label="New topic">{PLUS}</button> })}</div> },
        ]}
      >
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone width={320} height={440} bar={<PhoneBar><TopBar leading="back" title="Ask" trailing={iconBtn("New discussion", PLUS)} /></PhoneBar>} padding={14}>
            <List>
              {DISCUSSIONS.slice(0, 3).map((d) => (
                <ListItem key={d.id} title={d.title} meta={d.when} trailing="more" media={<span style={{ background: ART[d.art] }} />} />
              ))}
            </List>
          </TidelinePhone>
          <div style={{ width: "100%", maxWidth: 300 }}>
            <DeviceFrame variant="phone" style={{ "--rebar-device-frame-status-bg": "transparent", "--rebar-device-frame-max-width": "320px" } as React.CSSProperties}>
              <div style={{ position: "relative", height: 440, overflow: "auto", background: "var(--rebar-color-bg-primary)", "--rebar-top-bar-safe-area": "28px" } as React.CSSProperties}>
                <TopBar tone="overlay" leading="back" trailing={iconBtn("More", MORE)} />
                <Banner height={250}>{ARTICLE.title}</Banner>
                <div style={{ padding: 16, display: "grid", gap: 8 }}>
                  <Text variant="eyebrow">{ARTICLE.kicker}</Text>
                  <Text>{ARTICLE.body}</Text>
                </div>
              </div>
            </DeviceFrame>
          </div>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Rename in a discussion, logo on Today" caption="The title renames in place; the home screen shows the logo and an unread dot" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone width={320} height={520} bar={<PhoneBar><TopBar leading="back" title={{ editable: true, value: name, onSave: setName, label: "Discussion title" }} trailing={<ActionSheet open={sheet} onOpenChange={setSheet} trigger={iconBtn("Discussion actions", MORE)} title="Discussion actions" actions={[{ label: "Rename" }, { label: "Delete", destructive: true }]} />} /></PhoneBar>}>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ justifySelf: "end", maxWidth: "88%", background: "var(--rebar-color-bg-emphasis)", color: "var(--rebar-color-text-emphasis)", padding: "10px 14px", borderRadius: 18 }}>{QUESTION}</div>
              <div style={{ maxWidth: "94%", background: "var(--rebar-color-bg-raised)", border: "1px solid var(--rebar-color-border)", padding: "10px 14px", borderRadius: 18 }}>{ANSWER}</div>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={520} tabBar={athicTabs("today")} bar={<PhoneBar><TopBar leading="menu" logo="Athic" trailing={iconBtn("Notifications", BELL)} badge /></PhoneBar>}>
            <div style={{ display: "grid", gap: 10 }}>
              <Text variant="eyebrow" tone="muted">Today · {TODAY.date}</Text>
              <Heading level={2}>{TODAY.saint}</Heading>
              <div style={{ background: "var(--rebar-color-tint-1)", borderRadius: 22, padding: "18px 20px", display: "grid", gap: 8 }}>
                <Text variant="eyebrow">Today’s Gospel</Text>
                <Heading level={3}>{TODAY.gospel}</Heading>
                <Text size="sm" color="secondary">{TODAY.gospelLine}</Text>
              </div>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />

      <TokenTable component="TopBar" />
    </Stack>
  );
}
