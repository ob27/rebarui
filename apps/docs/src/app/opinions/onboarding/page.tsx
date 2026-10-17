"use client";

import { useState } from "react";
import { CalendarIcon, ChatIcon, Heading, LockIcon, Onboarding, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ONBOARDING_SLIDES } from "@/fixtures/athic";

const CODE = `<Onboarding
  slides={[{ icon: <CalendarIcon />, title: "Today’s readings", description: "Open Athic each day…", tint: "tint-1" }]}
  logo={<Wordmark />}
  onDone={() => router.push("/home")}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Onboarding"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A carousel region (`aria-roledescription="carousel"`), focusable: ArrowLeft and ArrowRight change slide. Swiping is never the only way: Next, Back and the dots (`role="tab"` with `aria-selected`) do the same. Slides other than the current one are `aria-hidden`. Skip and the dots keep 44px targets; the track and the dot morph stop animating under `prefers-reduced-motion`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="onboarding"`, `data-rebar-fullscreen`, `data-rebar-state="finishing"`. Parts: `top`, `logo`, `skip`, `viewport`, `track` (`data-rebar-dragging`), `slide` (`data-rebar-active`), `icon`, `title`, `description`, `note`, `footer`, `dots`, `dot`, `buttons`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD Mobile's `Swiper` plus `Steps`-style dots is the closest match. Map `slides` to `Swiper.Item`s and keep `onDone` on the last item's button." }],
  },
];

const heart = (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="44" height="44">
    <path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const ICONS = [<CalendarIcon key="c" />, <ChatIcon key="m" />, <LockIcon key="l" />, heart];
const slides = ONBOARDING_SLIDES.map((s, i) => ({ ...s, icon: ICONS[i] }));
const wordmark = (
  <span style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: 22, fontWeight: 600 }}>
    <i style={{ color: "var(--rebar-color-primary)" }}>A</i>thic.
  </span>
);
const noBar = <span aria-hidden="true" />;

export default function OnboardingPage() {
  const [done, setDone] = useState(false);
  const [finishing, setFinishing] = useState(false);
  return (
    <Stack gap="lg">
      <Heading level={1}>Onboarding</Heading>
      <Text color="secondary">Swipeable full-screen intro slides with dots, Skip and Next. The last slide’s button finishes.</Text>

      <DemoStage
        title="Intro slides"
        caption="Swipe, tap the dots, or use Next. Skip and Get started both call onDone"
        code={CODE}
        widths={false}
      >
        <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
          <TidelinePhone bar={noBar} height={540} padding={0}>
            {done ? (
              <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
                <Stack gap="sm" align="center">
                  <Heading level={2}>You’re in</Heading>
                  <Text size="sm" color="secondary">onDone fired. In the app this is where you route to Home.</Text>
                  <button type="button" className="cs-stage-codebtn" onClick={() => setDone(false)}>Replay</button>
                </Stack>
              </div>
            ) : (
              <Onboarding
                slides={slides}
                logo={wordmark}
                finishing={finishing}
                onDone={() => {
                  setFinishing(true);
                  window.setTimeout(() => {
                    setFinishing(false);
                    setDone(true);
                  }, 900);
                }}
              />
            )}
          </TidelinePhone>
        </div>
      </DemoStage>

      <DemoStage title="States" caption="Slide 3, the last slide while finishing, and a deck without Skip" widths={false}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone bar={noBar} height={520} padding={0}><Onboarding slides={slides} defaultIndex={2} logo={wordmark} /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0}><Onboarding slides={slides} defaultIndex={3} finishing logo={wordmark} /></TidelinePhone>
          <TidelinePhone bar={noBar} height={520} padding={0}><Onboarding slides={slides} skippable={false} logo={wordmark} /></TidelinePhone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
