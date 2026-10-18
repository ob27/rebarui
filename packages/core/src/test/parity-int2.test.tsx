import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-int2"));

describe("parity-int2: Card promo slot rows", () => {
  it("places the header and body in grid rows set by tokens, auto by default", () => {
    expect(block).toContain("grid-row: var(--rebar-card-promo-header-row, auto)");
    expect(block).toContain("grid-row: var(--rebar-card-promo-body-row, auto)");
  });
});

describe("parity-int2: reconciled token families keep every earlier name", () => {
  it("eyebrow and section-label tokens: --rebar-text-eyebrow-* with the --rebar-eyebrow-* and --rebar-section-label-* aliases", () => {
    for (const name of ["--rebar-text-eyebrow-size", "--rebar-eyebrow-size", "--rebar-section-label-size", "--rebar-section-label-tracking", "--rebar-eyebrow-color", "--rebar-text-eyebrow-color"]) {
      expect(css).toContain(name);
    }
  });
  it("list item title tokens: one rule with the -text-overflow and -overflow names and both wrap names", () => {
    expect(css).toContain("var(--rebar-list-item-title-text-overflow, var(--rebar-list-item-title-overflow, clip))");
    expect(css).toContain("var(--rebar-list-item-title-text-wrap, var(--rebar-list-item-title-wrap, pretty))");
  });
  it("tone cards take --rebar-card-tone-border-width, then --rebar-card-border-width", () => {
    expect(css).toContain("var(--rebar-card-tone-border-width, var(--rebar-card-border-width, var(--rebar-border-width, 1px)))");
  });
  it("the Avatar ring accepts --rebar-avatar-ring and --rebar-avatar-shadow", () => {
    const theme = readFileSync(resolve(__dirname, "../../../theme-basilika/src/components.css"), "utf8");
    expect(theme).toContain("var(--rebar-avatar-ring, var(--rebar-avatar-shadow,");
  });
});
