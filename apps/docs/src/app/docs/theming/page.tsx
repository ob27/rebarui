import { Heading, Stack, Text } from "rebar-ui";
import { PropsTable } from "@/components/PropsTable";

function TokenRow({ name, value }: { name: string; value: string }) {
  return (
    <Text size="sm">
      <code>{name}</code> — {value}
    </Text>
  );
}

export default function TheimingPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Theming & Defaults</Heading>
      <Text>
        Rebar bakes in defaults so you never make a spacing, color, or type-scale decision unless
        you choose to. Every value below is a CSS custom property — fully overridable, but chosen
        so most projects never need to. The behavioral guidance (not the CSS specifics) is also
        published standalone as <code>HEURISTICS.md</code> in the repo root — copy it into any
        project, Rebar or not, as a design-defaults reference for developers or an AI coding
        agent.
      </Text>

      <Stack gap="sm">
        <Heading level={2}>Spacing — 8pt grid</Heading>
        <Text size="sm" color="secondary">
          Convention shared by Material Design, IBM Carbon, and USWDS. All spacing is a multiple
          of 8px; 4px exists only for micro-adjustments.
        </Text>
        <TokenRow name="--rebar-space-xs" value="4px" />
        <TokenRow name="--rebar-space-sm" value="8px" />
        <TokenRow name="--rebar-space-md" value="16px" />
        <TokenRow name="--rebar-space-lg" value="24px" />
        <TokenRow name="--rebar-space-xl" value="32px" />
        <TokenRow name="--rebar-space-2xl" value="48px" />
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Typography</Heading>
        <Text size="sm" color="secondary">
          A six-step type scale, system font stack by default (no web-font loading cost until a
          theme opts in).
        </Text>
        <TokenRow name="--rebar-font-size-xs" value="12px — captions, metadata" />
        <TokenRow name="--rebar-font-size-sm" value="14px — secondary text, inputs" />
        <TokenRow name="--rebar-font-size-md" value="16px — body text (base)" />
        <TokenRow name="--rebar-font-size-lg" value="20px — subheadings" />
        <TokenRow name="--rebar-font-size-xl" value="24px — section headings" />
        <TokenRow name="--rebar-font-size-2xl" value="32px — page titles" />
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Color — semantic tokens only</Heading>
        <Text size="sm" color="secondary">
          Never a raw hex value in component source or usage — always a semantic role
          (<code>--rebar-color-primary</code>, <code>--rebar-color-danger</code>, ...). WCAG 2.1
          AA contrast (4.5:1 body text, 3:1 large text) is the enforced minimum in the shipped
          themes.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Behavioral heuristics components satisfy</Heading>
        <Text size="sm" color="secondary">
          From Nielsen&apos;s usability heuristics, Shneiderman&apos;s golden rules, and Gestalt
          principles — cited for traceability, not reproduced verbatim (see{" "}
          <code>ref/HEURISTICS.md</code> in the repo for full sourcing).
        </Text>
        <Text size="sm">
          Visibility of system status · Match with the real world · User control and freedom ·
          Consistency · Error prevention · Recognition over recall · Full keyboard operability ·
          Minimalism · Clear error recovery
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Example: Button&apos;s full prop surface</Heading>
        <Text size="sm" color="secondary">
          Generated from the real TypeScript types — see any{" "}
          <a href="/components">component reference page</a> for the rest.
        </Text>
        <PropsTable component="Button" />
      </Stack>
    </Stack>
  );
}
