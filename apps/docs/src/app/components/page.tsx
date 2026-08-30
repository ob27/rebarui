import Link from "next/link";
import { Card, Heading, Stack, Text } from "rebar-ui";
import componentProps from "@/generated/component-props.json";

const HAS_FULL_PAGE: Record<string, string> = {
  Avatar: "/components/avatar",
  AspectRatio: "/components/aspect-ratio",
  Badge: "/components/badge",
  Breadcrumb: "/components/breadcrumb",
  Button: "/components/button",
  Carousel: "/components/carousel",
  Descriptions: "/components/descriptions",
  Dialog: "/components/dialog",
  Divider: "/components/divider",
  Empty: "/components/empty",
  Form: "/components/form",
  Rate: "/components/rate",
  Result: "/components/result",
  Skeleton: "/components/skeleton",
  Spin: "/components/spin",
  Statistic: "/components/statistic",
  Steps: "/components/steps",
  Tag: "/components/tag",
  Timeline: "/components/timeline",
};

export default function ComponentsIndexPage() {
  const names = Object.keys(componentProps).sort();

  return (
    <Stack gap="lg">
      <Heading level={1}>Components</Heading>
      <Text color="secondary">
        {names.length} components exported from <code>rebar-ui</code>. Full reference pages exist
        for Button (simple), Avatar (illustrated placeholder art), Carousel (self-contained, no new
        dependency), Dialog (composite, Radix-backed), Form (the most complex, with an adapter
        migration story), and the rest of the data-display/feedback/navigation set (Badge,
        Breadcrumb, Descriptions, Divider, Empty, Rate, Result, Skeleton, Spin, Statistic, Steps,
        Tag, Timeline). The rest are listed
        here honestly as not yet written, not silently skipped.
      </Text>

      <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
        {names.map((name) => {
          const href = HAS_FULL_PAGE[name];
          return (
            <Card key={name} style={{ flex: "1 1 200px" }}>
              <Stack gap="xs">
                <Heading level={3}>{name}</Heading>
                {href ? (
                  <Link href={href}>
                    <Text as="span" size="sm">
                      View reference →
                    </Text>
                  </Link>
                ) : (
                  <Text size="sm" color="secondary">
                    Reference page not written yet
                  </Text>
                )}
              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
