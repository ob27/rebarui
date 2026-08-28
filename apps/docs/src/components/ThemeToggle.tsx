"use client";

import { useEffect, useState } from "react";
import { Button, Stack, Text } from "rebar-ui";

/**
 * Docs-app-local dev utility, not a rebar-ui component: exercises the theme-swap
 * mechanism from ref/PLAN.md Phase 3 (a single data-rebar-theme/data-theme attribute
 * swap at the root) so it's actually verified live, not just asserted in a test.
 * Deliberately not part of the library — see ref/MARKETING_SITE.md on why the public
 * site doesn't ship a visitor-facing global switcher.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"sketch" | "clean">("sketch");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-rebar-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [dark]);

  return (
    <Stack direction="row" gap="sm" align="center">
      <Text size="xs" color="secondary">
        Theme:
      </Text>
      <Button
        size="sm"
        variant={theme === "sketch" ? "primary" : "secondary"}
        onClick={() => setTheme("sketch")}
      >
        Sketch
      </Button>
      <Button
        size="sm"
        variant={theme === "clean" ? "primary" : "secondary"}
        onClick={() => setTheme("clean")}
      >
        Clean
      </Button>
      <Button size="sm" variant="tertiary" onClick={() => setDark((value) => !value)}>
        {dark ? "☀️ Light" : "🌙 Dark"}
      </Button>
    </Stack>
  );
}
