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
        text: "A site-wide header with navigation links, optional logo, and optional user menu. Wraps NavBar for the top of a site.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: "{ type: \"site-header\", logo?: string, links: { label: string, href: string }[], userMenu?: UserMenuItem[] }",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [
      {
        kind: "text",
        text: "A live example of the site-header block:",
      },
    ],
  },
];

export default function SiteHeaderPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Site Header</Heading>
      <Text color="secondary">
        A site-wide header with navigation links, optional logo, and optional user menu. Wraps NavBar for the top of a site.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
