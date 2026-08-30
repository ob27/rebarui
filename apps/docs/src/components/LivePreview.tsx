"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

function readAmbientTheme(): "sketch" | "clean" {
  if (typeof document === "undefined") return "clean";
  return document.documentElement.getAttribute("data-rebar-theme") === "sketch" ? "sketch" : "clean";
}

function readAmbientMode(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * A small demo panel that mirrors whatever the page's real theme currently is (read from
 * <html data-rebar-theme> and <html data-theme>, kept in sync via a MutationObserver). No local
 * Sketch/Clean toggle of its own — DevTools' floating panel (🔧) already controls both attributes
 * globally, and this project's dev build always has it available, so a second, redundant toggle in
 * the page body only duplicated a control that already existed one click away.
 *
 * Both attributes are mirrored onto this wrapper, not just data-rebar-theme — the theme
 * stylesheets' dark-mode overrides are compound selectors (e.g.
 * `[data-rebar-theme="sketch"][data-theme="dark"]`) that only match when both attributes sit on
 * the same element, so mirroring just one left this panel stuck in light mode's colors whenever
 * the ambient page was switched to dark.
 */
export function LivePreview({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"sketch" | "clean">(readAmbientTheme);
  const [mode, setMode] = useState<"light" | "dark">(readAmbientMode);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(readAmbientTheme());
      setMode(readAmbientMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-rebar-theme", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-rebar-theme={theme}
      data-theme={mode === "dark" ? "dark" : undefined}
      style={{
        border: "var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0)",
        borderRadius: 4,
        padding: "var(--rebar-space-lg, 24px)",
      }}
    >
      {children}
    </div>
  );
}
