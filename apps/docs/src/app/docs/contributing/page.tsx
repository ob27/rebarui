import { Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Getting set up",
    body: [
      {
        kind: "text",
        text: "`git clone https://github.com/ob27/rebarui.git`, then `pnpm install` (Node >=22.13). `pnpm dev` runs this site's dev server, which also dogfoods every component live. `pnpm run lint`/`test`/`build`/`typecheck` are the same four checks CI runs on every PR, in that order — run `build` before `typecheck` locally if you've just cleaned `apps/docs/.next`, since its typecheck needs Next's generated route types.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Where things live",
    body: [
      {
        kind: "list",
        items: [
          "packages/core (rebar-ui) — the component library",
          "packages/placement (@rebar-ui/placement) — the placement layer/DSL Packer, the recommended way to consume the library",
          "packages/theme-sketch, packages/theme-clean — the two shipped themes",
          "packages/devtools — the dev-only RebarDevTools panel",
          "packages/adapters/antd (@rebar-ui/migrate-antd) — the migration codemod",
          "apps/docs — this site",
          "bench/ — disposable benchmark scaffolds (see /benchmarks) — not for PRs",
          "ref/ — planning/architecture docs, updated in place as decisions change",
        ],
      },
    ],
  },
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
    heading: "Adding an archetype to @rebar-ui/placement",
    body: [
      {
        kind: "text",
        text: "Add the shape to the `Block` union in `schema.ts` (documented as unmeasured until it's been through real repeated benchmarking, matching the existing archetypes' own doc comments), a render case in `BlockRenderer.tsx`, tests covering its DOM output and order, and a row in that package's README's archetype table.",
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
    heading: "Opening a PR",
    body: [
      {
        kind: "text",
        text: "Keep it scoped — one component, one fix, one archetype. Make sure the four checks above pass locally before pushing; CI runs the same ones and blocks merge if any fail. Describe what changed and why, and how you verified it (a specific reference page, a Playwright check) — this project verifies claims empirically throughout `ref/PLAN.md`, and PRs are held to the same bar.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Good first contributions",
    body: [
      {
        kind: "list",
        items: [
          "A missing or incorrect dark-mode color pairing (check via DevTools' dark-mode toggle on any /components/* page)",
          "A new small component filling a gap dist/index.d.ts doesn't cover yet",
          "Improving a /components/* or /docs/* reference page",
          "A chart archetype for @rebar-ui/placement — /benchmarks' three hand-authored SVG chart helpers are the reference implementation to generalize from",
        ],
      },
    ],
  },
];

export default function ContributingPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Contributing</Heading>
      <Text color="secondary">
        The full guide (issue/PR conventions, the complete checklist) lives in{" "}
        <a
          href="https://github.com/ob27/rebarui/blob/main/CONTRIBUTING.md"
          className="rebar-link"
        >
          CONTRIBUTING.md
        </a>{" "}
        at the repo root — this page is a shorter, browsable version of the same thing.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
