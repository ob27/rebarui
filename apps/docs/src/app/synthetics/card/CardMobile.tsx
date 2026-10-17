"use client";

import { useState } from "react";
import { Button, Card, Heading, Stack, Text, TopBar } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ART, CURRENT_PLAN, PERSPECTIVE, PLANS, TODAY } from "@/fixtures/athic";

const CODE = `<Card tone={1} eyebrow="Today’s readings" title="Saint Raphael the Archangel">First reading, Gospel and a short reflection.</Card>

<Card href="/perspectives/mary" cover={<Cover />} eyebrow="Perspective" title="Why Catholics honour Mary" />

<Card orientation="row" cover={<Thumb />} title="Plus" subtitle="$10 per month" cornerBadge={<Tag>Current</Tag>} />

<Card promo cover={<Thumb />} title="You have used 82% of this month’s tokens"
  actions={[<Button size="sm">See plans</Button>]} onDismiss={dismiss} />`;

const cover = (n: number, h = 132) => <div style={{ height: h, background: ART[n] }} />;
const thumb = (n: number) => <div style={{ width: "100%", height: "100%", background: ART[n] }} />;
const chip = <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 9px", borderRadius: 999, background: "var(--rebar-color-primary)", color: "var(--rebar-color-primary-text)", font: "700 .66rem var(--rebar-font-family-sans)", letterSpacing: ".08em", textTransform: "uppercase" }}>Current</span>;

function Perspective() {
  return (
    <Card href="#mary" cover={cover(1)} eyebrow={PERSPECTIVE.kicker} title={PERSPECTIVE.title}>
      <Text size="sm" color="secondary">{PERSPECTIVE.body}</Text>
      <Text as="span" size="sm" style={{ color: "var(--rebar-color-primary-text-ink)", fontWeight: 600 }}>Read ›</Text>
    </Card>
  );
}

export function CardMobile() {
  const [promo, setPromo] = useState(true);
  return (
    <>
      <Heading level={2}>Mobile additions</Heading>
      <DemoStage
        title="Card: tone, href, row, promo"
        caption="Tint fills, a whole-card link, a compact row with a corner chip, the promo preset"
        code={CODE}
        widths={false}
        states={[
          { label: "tone 1 to 4", node: <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{([1, 2, 3, 4] as const).map((t) => <Card key={t} tone={t} eyebrow={`Tone ${t}`} title="Today" />)}</div> },
        ]}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 18 }}>
          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
            <Card tone={1} eyebrow="Today’s readings" title={TODAY.saint}><Text size="sm" color="secondary">{TODAY.readingsLine}</Text></Card>
            <Card tone={3} eyebrow="Mass attendance" title={TODAY.attendance}><Text size="sm" color="secondary">{TODAY.attendanceLine}</Text></Card>
          </div>
          <Perspective />
          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
            <Card orientation="row" cover={thumb(1)} title="Plus" subtitle={`${PLANS[1].price} · ${PLANS[1].tokens}`} cornerBadge={chip} />
            <Card orientation="row" cover={thumb(0)} title="Standard" subtitle={`${PLANS[2].price} · ${PLANS[2].tokens}`} extra={<Button size="sm">Subscribe</Button>} />
            {promo ? <Card promo cover={thumb(4)} title="You have used 82% of this month’s tokens" actions={[<Button key="p" size="sm">See plans</Button>]} onDismiss={() => setPromo(false)}><Text size="sm" color="secondary">Upgrade for 2,000,000 a month.</Text></Card> : <Button size="sm" variant="secondary" onClick={() => setPromo(true)}>Show the promo again</Button>}
          </div>
        </div>
      </DemoStage>
      <DemoStage title="Plans and Today" caption="In context: a Current chip and a promo card; tinted cards and a link card" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={560} tabBar={athicTabs("me")} bar={<PhoneBar><TopBar leading="back" title="Your Account" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 16 }}>
              <Text variant="eyebrow">Plan and billing</Text>
              {PLANS.slice(0, 2).map((p) => (
                <Card key={p.id} orientation="row" cover={thumb(p.art)} title={p.name} subtitle={`${p.price} · ${p.tokens}`} cornerBadge={p.id === CURRENT_PLAN ? chip : undefined} style={p.id === CURRENT_PLAN ? { borderColor: "var(--rebar-color-primary)" } : undefined} />
              ))}
              <Card promo cover={thumb(4)} title="You have used 82% of this month’s tokens" actions={[<Button key="p" size="sm">See plans</Button>]} onDismiss={() => {}}><Text size="sm" color="secondary">Upgrade for 2,000,000 a month.</Text></Card>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={560} tabBar={athicTabs("today")} bar={<PhoneBar><TopBar leading="menu" logo="Athic" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Card tone={1} eyebrow="Today’s readings" title={TODAY.saint}><Text size="sm" color="secondary">First reading, Gospel and a short reflection.</Text></Card>
              <Card tone={4} eyebrow="Mass attendance" title={TODAY.attendance}><Text size="sm" color="secondary">{TODAY.attendanceLine}</Text></Card>
              <Text variant="eyebrow" tone="muted">From the Library</Text>
              <Perspective />
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </>
  );
}
