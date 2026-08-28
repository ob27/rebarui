"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Button, Stack } from "rebar-ui";

/**
 * A small, self-contained demo panel with its own local sketch<->clean toggle — per
 * ref/MARKETING_SITE.md, this is deliberately scoped to one example, not a site-wide switch.
 */
export function LivePreview({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"sketch" | "clean">("sketch");

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs">
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
      </Stack>
      <div
        data-rebar-theme={theme}
        style={{
          border: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 4,
          padding: "var(--rebar-space-lg, 24px)",
        }}
      >
        {children}
      </div>
    </Stack>
  );
}
