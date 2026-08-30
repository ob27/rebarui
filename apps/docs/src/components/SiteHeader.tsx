"use client";

import Link from "next/link";
import { Stack, Text } from "rebar-ui";
import corePackageJson from "../../../../packages/core/package.json";

const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/docs/migration", label: "Migration" },
];

// No light/dark toggle here — DevTools (🔧, bottom-right) already owns dark-mode via the same
// data-theme attribute, and stays mounted on this marketing site for now. A second independent
// toggle would fight it over the same DOM attribute rather than just duplicating a button.
export function SiteHeader() {
  return (
    <header
      style={{
        borderBottom: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
      }}
    >
      <Stack
        direction="row"
        align="center"
        gap="lg"
        style={{
          justifyContent: "space-between",
          padding: "var(--rebar-space-md) var(--rebar-space-xl)",
        }}
      >
        <Stack direction="row" align="center" gap="lg">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" align="center" gap="xs">
              <img src="/rebar-icon.svg" alt="" width={24} height={24} />
              <Text as="span" size="md" style={{ fontWeight: "var(--rebar-font-weight-bold, 700)" }}>
                Rebar UI
              </Text>
            </Stack>
          </Link>
          <nav>
            <Stack direction="row" gap="md">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                  <Text as="span" size="sm" color="secondary">
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </nav>
        </Stack>

        <Text size="xs" color="secondary">
          v{corePackageJson.version}
        </Text>
      </Stack>
    </header>
  );
}
