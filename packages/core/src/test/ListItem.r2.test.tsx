import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-r2"));

describe("ListItem title tokens (parity-r2)", () => {
  it("exposes display, white-space and text-overflow with the previous values as defaults", () => {
    expect(block).toMatch(/display: var\(--rebar-list-item-title-display, -webkit-box\)/);
    expect(block).toMatch(/white-space: var\(--rebar-list-item-title-white-space, normal\)/);
    expect(block).toMatch(/text-overflow: var\(--rebar-list-item-title-text-overflow, clip\)/);
  });
  it("exposes the eyebrow, card border/overflow/background and heading-group properties", () => {
    for (const name of ["--rebar-eyebrow-size", "--rebar-eyebrow-letter-spacing", "--rebar-eyebrow-color", "--rebar-card-border-width", "--rebar-card-overflow", "--rebar-card-background", "--rebar-heading-group-gap"]) {
      expect(block).toContain(name);
    }
  });
});
