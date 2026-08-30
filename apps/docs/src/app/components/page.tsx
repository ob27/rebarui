import Link from "next/link";
import { Card, Heading, Stack, Text } from "rebar-ui";
import componentProps from "@/generated/component-props.json";

const HAS_FULL_PAGE: Record<string, string> = {
  Avatar: "/components/avatar",
  AspectRatio: "/components/aspect-ratio",
  Button: "/components/button",
  Dialog: "/components/dialog",
  Form: "/components/form",
};

export default function ComponentsIndexPage() {
  const names = Object.keys(componentProps).sort();

  return (
    <Stack gap="lg">
      <Heading level={1}>Components</Heading>
      <Text color="secondary">
        {names.length} components exported from <code>rebar-ui</code>. Full reference pages exist
        for a representative few so far — Button (simple), Avatar (illustrated placeholder art),
        Dialog (composite, Radix-backed), Form (the most complex, with an adapter migration story).
        The rest are listed here honestly as not yet written, not silently skipped.
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
