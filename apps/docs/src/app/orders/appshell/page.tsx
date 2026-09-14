import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [
      {
        kind: "text",
        text: "A full-viewport application shell that handles CSS height inheritance correctly — the common layout bug where a sidebar doesn't extend to the bottom because its height: 100% doesn't resolve without an explicit parent height. Composes SidebarNav or NavBar with the correct flexbox layout.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: `<AppShell
  sidebar?: SidebarNavProps   // left sidebar — dashboard pattern
  topNav?: NavBarProps        // top nav — docs/marketing pattern
  variant?: "sidebar" | "top-nav"
  height?: string             // default "100vh"
>
  {children}
</AppShell>`,
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When to use",
    body: [
      {
        kind: "text",
        text: "Dashboard layouts with a sidebar + main content area, documentation sites with navigation + content, or any full-viewport application where the sidebar/top-nav must extend to the viewport edge.",
      },
      {
        kind: "text",
        text: "Not for embedded widgets that don't own the full viewport — use a plain Stack or Box instead.",
      },
    ],
  },
];

export default function AppShellPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>App Shell</Heading>
      <Text color="secondary">
        A full-viewport application shell that handles CSS height inheritance correctly.
        Uses height: 100vh (not minHeight) on the outer container, ensuring all children
        with height: 100% resolve correctly. Composes SidebarNav or NavBar with the
        correct flexbox layout.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
