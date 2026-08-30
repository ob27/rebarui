import { Heading, Stack } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Adding a component to packages/core",
    body: [
      {
        kind: "text",
        text: "Every component: wraps a real semantic HTML element or a Radix primitive, carries `data-rebar-component` (and `data-rebar-part` / `data-rebar-state` where it has internal structure or state), forwards arbitrary `data-*`/`aria-*` props to its root DOM node, and is styled only through `--rebar-*` custom properties with sensible fallback values — never a hardcoded pixel or color. Add tests covering role/name, keyboard operability, and the attributes above. Export it from `src/index.ts`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Adding a migration adapter",
    body: [
      {
        kind: "text",
        text: '`@rebar-ui/migrate-antd` (`packages/adapters/antd`) is the template. A new adapter partitions a file\'s `rebar-ui` imports into "has a target equivalent" (renamed/flattened, moved to the target library\'s import) and "doesn\'t" (left importing from `rebar-ui`) — never a blind whole-file import-source swap. Test with jscodeshift\'s own `applyTransform` helper against inline fixtures, then dry-run it against real code before calling it done — that\'s how a real bug (a Button\'s native `type` colliding with AntD\'s variant-typed `type` prop) was actually found, not by reasoning about it in advance.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Planning docs",
    body: [
      {
        kind: "text",
        text: "All planning lives in `ref/` in the repo — `PLAN.md`, `ARCHITECTURE.md`, `ASSESSMENT.md`, `HEURISTICS.md`, `MARKETING_SITE.md`. Update them in place as decisions change; they're living documents, not a changelog.",
      },
    ],
  },
];

export default function ContributingPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Contributing</Heading>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
