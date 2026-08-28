import type { ReactNode } from "react";
import Link from "next/link";
import { Box, Stack, Text } from "rebar-ui";

interface DocsShellProps {
  sections: { href: string; label: string }[];
  children: ReactNode;
}

export function DocsShell({ sections, children }: DocsShellProps) {
  return (
    <Box as="main" style={{ maxWidth: 960, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack direction="row" gap="xl" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        <Box as="nav" style={{ width: 200, flexShrink: 0 }}>
          <Stack gap="xs">
            {sections.map((section) => (
              <Link key={section.href} href={section.href} style={{ textDecoration: "none" }}>
                <Text as="span" size="sm" color="secondary">
                  {section.label}
                </Text>
              </Link>
            ))}
          </Stack>
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>{children}</Box>
      </Stack>
    </Box>
  );
}
