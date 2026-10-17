"use client";

import { Heading, List, ListItem, Stack, Text, TopBar } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ARTICLE, TODAY } from "@/fixtures/athic";

const CODE = `<Text variant="eyebrow">Narrated by an Athic author</Text>
<Text variant="section-label">This week</Text>
<Text variant="section-label" tone="primary" rule="both">Today</Text>
<Heading level={2} eyebrow="Today · Friday 24 October">Saint Raphael the Archangel</Heading>
<Heading level={2} rule>Your data</Heading>`;

export function TextMobile() {
  return (
    <>
      <Heading level={2}>Eyebrow and section label</Heading>
      <DemoStage
        title="Text variant=eyebrow and section-label"
        caption="Uppercase tracked kicker; a label with a hairline rule; Heading eyebrow and rule"
        code={CODE}
        widths={false}
        states={[
          { label: "eyebrow, primary", node: <Text variant="eyebrow">Account</Text> },
          { label: "eyebrow, muted", node: <Text variant="eyebrow" tone="muted">Narrated by an Athic author</Text> },
          { label: "eyebrow on navy (inverse)", node: <div style={{ background: "var(--rebar-color-bg-inverse)", padding: 14, borderRadius: 14 }}><Text variant="eyebrow" tone="inverse">Perspective</Text></div> },
          { label: "section-label", node: <Text variant="section-label">This week</Text> },
          { label: "rule on both sides", node: <Text variant="section-label" rule="both">Earlier</Text> },
          { label: "section-label, primary", node: <Text variant="section-label" tone="primary">Today</Text> },
          { label: "Heading with rule", node: <Heading level={2} rule>Your data</Heading> },
        ]}
      >
        <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 26 }}>
          <Heading level={2} eyebrow={`Today · ${TODAY.date}`}>{TODAY.saint}</Heading>
          <Text variant="section-label">Readings</Text>
          <Heading level={2} rule>Your data</Heading>
        </div>
      </DemoStage>
      <DemoStage title="Article header and Today section labels" caption="In context" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={520} tabBar={athicTabs("library")} bar={<PhoneBar><TopBar leading="back" title="Your Library" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Heading level={2} eyebrow={ARTICLE.kicker}>{ARTICLE.title}</Heading>
              <Text>{ARTICLE.body}</Text>
              <Text variant="section-label">Citations</Text>
              <List variant="grouped">
                <ListItem title="CCC 1442" description="The power of absolution" trailing="chevron" href="#ccc" />
                <ListItem title="John 20:23" description="Douay-Rheims" trailing="chevron" href="#john" />
              </List>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={520} tabBar={athicTabs("today")} bar={<PhoneBar><TopBar leading="menu" logo="Athic" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Text variant="section-label" tone="primary">Today</Text>
              <List><ListItem title="Mass readings" description={TODAY.saint} trailing="chevron" href="#readings" leading={{ icon: "✝", tone: 1 }} /></List>
              <Text variant="section-label">This week</Text>
              <List><ListItem title="Sunday Mass" description="Attended 19 October" trailing="chevron" href="#mass" leading={{ icon: "✓", tone: 4 }} /></List>
              <Heading level={3} rule>Your data</Heading>
              <Text size="sm" color="secondary">Download or delete everything tied to your account.</Text>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </>
  );
}
