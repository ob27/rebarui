import Link from "next/link";
import { Stack, Text } from "rebar-ui";

const FOOTER_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/theming", label: "Theming & Defaults" },
  { href: "/docs/migration", label: "Migration" },
  { href: "/docs/contributing", label: "Contributing" },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
        marginTop: "var(--rebar-space-2xl)",
      }}
    >
      <Stack
        direction="row"
        gap="lg"
        style={{
          justifyContent: "space-between",
          padding: "var(--rebar-space-lg) var(--rebar-space-xl)",
          flexWrap: "wrap",
        }}
      >
        <Text size="xs" color="secondary">
          MIT licensed. No GitHub link yet — this repo hasn&apos;t been pushed anywhere public.
        </Text>
        <Stack direction="row" gap="md">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
              <Text as="span" size="xs" color="secondary">
                {link.label}
              </Text>
            </Link>
          ))}
        </Stack>
      </Stack>
    </footer>
  );
}
