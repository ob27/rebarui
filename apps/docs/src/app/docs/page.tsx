import Link from "next/link";
import { Heading, Stack, Text } from "rebar-ui";

export default function IntroductionPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Introduction</Heading>
      <Text>
        Rebar is a headless-first React component library that&apos;s intentionally low-fidelity
        by default: fully functional and accessible, but visually barebones so your attention
        stays on logic and data flow, not pixels. Every visual value is a CSS variable, so
        re-skinning into a real design system later is a theme swap, not a rewrite.
      </Text>

      <Stack gap="sm">
        <Heading level={2}>When to reach for Rebar</Heading>
        <Text>
          Internal tools, admin panels, prototypes, and anything where you want to prove the
          logic works before anyone argues about button colors. Rebar is designed to be
          replaced — its job is to get you moving fast now and hand off cleanly later, via{" "}
          <Link href="/docs/migration">a migration adapter or the migration prompt</Link>.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>When not to</Heading>
        <Text>
          If you already know your target design system and have time to build against it
          directly, do that — Rebar exists to remove a decision you don&apos;t want to make yet,
          not to add a migration step you didn&apos;t need.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>The three guarantees</Heading>
        <Text>
          1. <strong>Headless & accessible</strong> — Radix UI underneath every interactive
          component.
          <br />
          2. <strong>Built to be replaced</strong> — CSS-variable theming, no component logic
          depends on the current theme.
          <br />
          3. <strong>Playwright-proof</strong> — <code>data-rebar-*</code> attributes and an
          ARIA-first surface survive a full re-skin.
        </Text>
      </Stack>
    </Stack>
  );
}
