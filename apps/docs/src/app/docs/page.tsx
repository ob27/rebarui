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
        <Heading level={2}>Why this is cheaper, not just faster upfront</Heading>
        <Text>
          Even when you already know your target design system, building against it directly
          from the start is usually the more expensive path — not just slower to get moving, but
          costlier in total, especially with an AI agent doing the building. Every round of logic
          iteration against a real, opinionated design system pays a styling/constraint tax again:
          the agent has to reconcile business-logic changes with the target library&apos;s
          component shapes, prop conventions, and visual rules on every pass. Building headless
          and low-fidelity first means logic settles fast and cheap — no visual decisions in the
          loop — and the &quot;make it pretty&quot; pass happens exactly once, as a bounded reskin
          (<Link href="/docs/migration">a codemod or the migration prompt</Link>), after the
          logic is done, instead of being re-paid on every iteration along the way.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>When to reach for Rebar</Heading>
        <Text>
          Internal tools, admin panels, prototypes, production apps with a known target design
          system — the logic-first, style-once order of operations above holds regardless of
          whether you know where you&apos;re headed. Rebar is designed to be replaced; that&apos;s
          the point, not a limitation.
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
