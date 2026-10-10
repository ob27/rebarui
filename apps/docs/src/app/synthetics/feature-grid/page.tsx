import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [{ kind: "text", text: "A wrapping row of small title+body pairs — no links, no images, just short feature copy." }],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "feature-grid", items: { title: string, body: string, icon?: string, iconPath?: string, iconViewBox?: string }[] }` }],
  },
  {
    type: "doc-section",
    heading: "Icons",
    body: [
      {
        kind: "text",
        text: "`icon` is looked up by name in the icon sets `rebar-ui` ships (RemixIcon and Ant Design Outlined, 1,800+ icons, browse them on [/imitations/icon](/imitations/icon)). Use the exact export name (`CalendarIcon`, `EnterOutlined`) or a short form that ignores case, dashes, underscores and the `Icon`/`Outlined` suffix: `calendar`, `chat`, `lock`, `book`, `heart`, `user`, `home`, `search`, `folder`, `star`, `mail`, `shield`, `home-heart`. RemixIcon wins when a short name exists in both sets. An unknown name renders no icon and logs a warning in development; it never throws.",
      },
      {
        kind: "text",
        text: "For a mark the sets do not have, pass `iconPath` (an SVG path `d` string, drawn with `fill=\"currentColor\"`) and, if it is not on a 24 by 24 grid, `iconViewBox`. `iconPath` takes priority over `icon`, the same convention as `site-header`'s `logo.iconPath`. The icon is decorative (`aria-hidden`).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example",
    body: [{ kind: "text", text: "A live example of the feature-grid block:" }],
  },
  {
      type: "feature-grid",
      items: [
        {
          title: "Headless",
          body: "Radix underneath.",
          icon: "lock",
        },
        {
          title: "Replaceable",
          body: "CSS-variable theming.",
          icon: "settings",
        },
        {
          title: "Tested",
          body: "Playwright-checked on every change.",
          iconPath: "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z",
        },
      ],
    },
];

export default function FeatureGridPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Feature Grid</Heading>
      <Text color="secondary">{"A wrapping row of small title+body pairs — no links, no images, just short feature copy."}</Text>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
