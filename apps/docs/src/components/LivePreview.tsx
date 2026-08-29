"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Button, Stack } from "rebar-ui";

function readAmbientTheme(): "sketch" | "clean" {
  if (typeof document === "undefined") return "clean";
  return document.documentElement.getAttribute("data-rebar-theme") === "sketch" ? "sketch" : "clean";
}

/**
 * A small, self-contained demo panel with its own local sketch<->clean toggle — per
 * ref/MARKETING_SITE.md, this is deliberately scoped to one example, not a site-wide switch.
 *
 * Starts synced to whatever the page's actual theme is (read from <html data-rebar-theme>) and
 * stays synced via a MutationObserver, so it never sits on a stale default independent of the
 * real page — e.g. DevTools' global sketch/clean toggle mutates that same attribute, and every
 * preview on the page should reflect it. Once a viewer explicitly clicks Sketch/Clean on this
 * specific panel, it stops following and respects their choice — that's the actual point of
 * having a local toggle at all (comparing both side by side), it just shouldn't be the *default*.
 */
export function LivePreview({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"sketch" | "clean">(readAmbientTheme);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned) return;
    const observer = new MutationObserver(() => setTheme(readAmbientTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-rebar-theme"],
    });
    return () => observer.disconnect();
  }, [pinned]);

  function select(next: "sketch" | "clean") {
    setPinned(true);
    setTheme(next);
  }

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="xs">
        <Button
          size="sm"
          variant={theme === "sketch" ? "primary" : "secondary"}
          onClick={() => select("sketch")}
        >
          Sketch
        </Button>
        <Button
          size="sm"
          variant={theme === "clean" ? "primary" : "secondary"}
          onClick={() => select("clean")}
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
