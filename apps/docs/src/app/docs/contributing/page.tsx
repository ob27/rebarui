import { Heading, Stack, Text } from "rebar-ui";

export default function ContributingPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Contributing</Heading>

      <Stack gap="sm">
        <Heading level={2}>Adding a component to packages/core</Heading>
        <Text size="sm">
          Every component: wraps a real semantic HTML element or a Radix primitive, carries{" "}
          <code>data-rebar-component</code> (and <code>data-rebar-part</code> /{" "}
          <code>data-rebar-state</code> where it has internal structure or state), forwards
          arbitrary <code>data-*</code>/<code>aria-*</code> props to its root DOM node, and is
          styled only through <code>--rebar-*</code> custom properties with sensible fallback
          values — never a hardcoded pixel or color. Add tests covering role/name, keyboard
          operability, and the attributes above. Export it from <code>src/index.ts</code>.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Adding a migration adapter</Heading>
        <Text size="sm">
          <code>@rebar-ui/migrate-antd</code> (<code>packages/adapters/antd</code>) is the
          template. A new adapter partitions a file&apos;s <code>rebar-ui</code> imports into
          &quot;has a target equivalent&quot; (renamed/flattened, moved to the target
          library&apos;s import) and &quot;doesn&apos;t&quot; (left importing from{" "}
          <code>rebar-ui</code>) — never a blind whole-file import-source swap. Test with
          jscodeshift&apos;s own <code>applyTransform</code> helper against inline fixtures, then{" "}
          <strong>dry-run it against real code</strong> before calling it done — that&apos;s how a
          real bug (a Button&apos;s native <code>type</code> colliding with AntD&apos;s
          variant-typed <code>type</code> prop) was actually found, not by reasoning about it in
          advance.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Planning docs</Heading>
        <Text size="sm">
          All planning lives in <code>ref/</code> in the repo — <code>PLAN.md</code>,{" "}
          <code>ARCHITECTURE.md</code>, <code>ASSESSMENT.md</code>, <code>HEURISTICS.md</code>,{" "}
          <code>MARKETING_SITE.md</code>. Update them in place as decisions change; they&apos;re
          living documents, not a changelog.
        </Text>
      </Stack>
    </Stack>
  );
}
