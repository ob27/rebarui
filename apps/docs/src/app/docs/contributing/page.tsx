import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Contributing",
    level: 1,
    body: [
      {
        kind: "text",
        text: "The full guide (issue/PR conventions, the complete checklist) lives in [CONTRIBUTING.md](https://github.com/ob27/rebarui/blob/main/CONTRIBUTING.md) at the repo root — this page is a shorter, browsable version of the same thing.",
      },
    ],
  },
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
          "apps/docs — this site, and the demo app `pnpm dev` launches at localhost:3000 after you clone the repo",
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
    heading: "Adding a block to @rebar-ui/placement",
    body: [
      {
        kind: "text",
        text: "Add the shape to the `Block` union in `schema.ts` (documented as unmeasured until it's been through real repeated benchmarking, matching the existing blocks' own doc comments), a render case in `BlockRenderer.tsx`, tests covering its DOM output and order, and a row in that package's README's block table.",
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
    heading: "Contributing a new benchmark",
    body: [
      {
        kind: "text",
        text: "See `ref/BENCHMARK_CONTRIBUTING.md` before adding a new condition to /benchmarks or running your own comparable measurement (e.g. against a different model) — it covers the disciplines (n=15, isolated scaffolds, verification before trusting a number, harness-adjustment across agentic vs. raw-API comparisons) that make a new result genuinely comparable to what's already published, rather than a number that merely looks similar. `ref/QWEN_BENCHMARK_PROTOCOL.md` is a full worked example of applying it to one specific case.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Opening a PR",
    body: [
      {
        kind: "text",
        text: "Keep it scoped — one component, one fix, one block. Make sure the four checks above pass locally before pushing; CI runs the same ones and blocks merge if any fail. Describe what changed and why, and how you verified it (a specific reference page, a Playwright check) — this project verifies claims empirically throughout `ref/PLAN.md`, and PRs are held to the same bar.",
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
          "A missing or incorrect dark-mode color pairing (check via DevTools' dark-mode toggle on any /imitations/*, /synthetics/*, /opinions/*, or /orders/* page)",
          "A new small component filling a gap dist/index.d.ts doesn't cover yet",
          "Improving a component/block reference page (under /imitations, /synthetics, /opinions, /orders) or a /docs/* page",
          "A chart block for @rebar-ui/placement — /benchmarks' three hand-authored SVG chart helpers are the reference implementation to generalize from",
        ],
      },
    ],
  },
];

export default function ContributingPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
