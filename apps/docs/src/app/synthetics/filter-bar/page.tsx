import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `{ type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }`;

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "filter-bar", searchPlaceholder?: string, filterLabel?: string, filterOptions?: string[], actionLabel?: string }` }],
  },
];

export default function FilterBarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Filter Bar</Heading>
      <Text color="secondary">A search input, an optional filter select and a primary action in one row.</Text>

      <DemoStage
        title="Project filters"
        caption="Search, status filter and a New project button"
        code={CODE}
        states={[
          { label: "Search only", node: <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search files…" }]} /> },
          { label: "With filter", node: <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search tasks…", filterLabel: "Tag", filterOptions: ["All", "Design", "Eng", "Research", "Ops"] }]} /> },
          { label: "Action only", node: <NextBlockRenderer blocks={[{ type: "filter-bar", actionLabel: "Add task" }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects page" caption="Above the project list" widths={false}>
        <Stack gap="md">
          <Heading level={3}>Projects</Heading>
          <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }]} />
          <NextBlockRenderer blocks={[{ type: "data-list", items: PROJECTS.map((p) => ({ title: p.name, badge: p.status })) }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
