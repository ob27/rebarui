import { Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "1. Codemods — for what's safe to automate",
    body: [
      {
        kind: "text",
        text: "`@rebar-ui/migrate-antd` is the first adapter: a real jscodeshift codemod, not just a prop-mapping table. Run it with:",
      },
      { kind: "code", code: "npx @rebar-ui/migrate-antd src/" },
      {
        kind: "text",
        text: "It handles `Button`/`Input` variant+size remapping, `Alert`'s `title`→`message`, `Dialog`→`Modal` (flagging `onOpenChange`→`onCancel` for review — the two have different signatures), `FormItem`→`Form.Item` (adding `rules`, unwrapping the render-prop children pattern). `Box`/`Stack`/`Text`/`Heading`/`Tabs` are deliberately left alone — no direct AntD equivalent, or too structurally different to flatten safely at the syntax level.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "2. The migration prompt — for everything else",
    body: [
      {
        kind: "text",
        text: "`MIGRATION_PROMPT.md` (repo root) is the human/agent-facing complement: paste it to a coding agent along with your target design system's name, for components a codemod can't safely handle (structurally different shapes, or any target without a dedicated adapter yet). It also tells the agent how to resolve the `rebar-migrate:` review comments a codemod like the one above leaves behind.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Why both exist",
    body: [
      {
        kind: "text",
        text: "A codemod is faster and more reliable for purely mechanical renames, but can't safely do things that require understanding what the code means — reconstructing an items-array from loose composition, or judging whether a changed event-handler signature still makes sense. Codemods for what's safe to automate, the prompt for what needs judgment.",
      },
    ],
  },
];

export default function MigrationPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Migration</Heading>
      <Text>
        Rebar is designed to be replaced, once — not iterated against forever. The signal to
        migrate isn&apos;t a deadline, it&apos;s <em>stability</em>: once your UI&apos;s flows and
        layouts have actually settled and you&apos;re heading to production, that&apos;s when the
        cost/benefit flips from &quot;keep iterating cheaply, headless&quot; to &quot;pay the
        one-time cost of a real, customizable design system.&quot; Two complementary paths get you
        there, depending on whether a dedicated adapter exists for your target design system yet.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
