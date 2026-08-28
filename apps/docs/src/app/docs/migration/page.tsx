import { Box, Heading, Stack, Text } from "rebar-ui";

export default function MigrationPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Migration</Heading>
      <Text>
        Rebar is designed to be replaced. Two complementary paths get you there, depending on
        whether a dedicated adapter exists for your target design system yet.
      </Text>

      <Stack gap="sm">
        <Heading level={2}>1. Codemods — for what&apos;s safe to automate</Heading>
        <Text size="sm" color="secondary">
          <code>@rebar-ui/migrate-antd</code> is the first adapter: a real jscodeshift codemod,
          not just a prop-mapping table. Run it with:
        </Text>
        <Box
          as="pre"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          <code>npx @rebar-ui/migrate-antd src/</code>
        </Box>
        <Text size="sm" color="secondary">
          It handles <code>Button</code>/<code>Input</code> variant+size remapping,{" "}
          <code>Alert</code>&apos;s <code>title</code>→<code>message</code>,{" "}
          <code>Dialog</code>→<code>Modal</code> (flagging <code>onOpenChange</code>→
          <code>onCancel</code> for review — the two have different signatures),{" "}
          <code>FormItem</code>→<code>Form.Item</code> (adding <code>rules</code>, unwrapping the
          render-prop children pattern). <code>Box</code>/<code>Stack</code>/<code>Text</code>/
          <code>Heading</code>/<code>Tabs</code> are deliberately left alone — no direct AntD
          equivalent, or too structurally different to flatten safely at the syntax level.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>2. The migration prompt — for everything else</Heading>
        <Text size="sm" color="secondary">
          <code>MIGRATION_PROMPT.md</code> (repo root) is the human/agent-facing complement: paste
          it to a coding agent along with your target design system&apos;s name, for components a
          codemod can&apos;t safely handle (structurally different shapes, or any target without a
          dedicated adapter yet). It also tells the agent how to resolve the{" "}
          <code>rebar-migrate:</code> review comments a codemod like the one above leaves behind.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Why both exist</Heading>
        <Text size="sm" color="secondary">
          A codemod is faster and more reliable for purely mechanical renames, but can&apos;t
          safely do things that require understanding what the code means — reconstructing an
          items-array from loose composition, or judging whether a changed event-handler signature
          still makes sense. Codemods for what&apos;s safe to automate, the prompt for what needs
          judgment.
        </Text>
      </Stack>
    </Stack>
  );
}
