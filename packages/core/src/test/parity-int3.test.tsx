import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, fireEvent } from "@testing-library/react";
import { List } from "../components/List";
import { ListItem } from "../components/List";
import { ActionSheet } from "../components/ActionSheet";
import { Card } from "../components/Card";

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-int3"));

describe("parity-int3: List focusRing", () => {
  it('"item" marks the list and the default does not', () => {
    const { container, rerender } = render(<List focusRing="item"><ListItem title="A" onClick={() => {}} /></List>);
    expect(container.querySelector(".rebar-list")).toHaveAttribute("data-rebar-focus-ring", "item");
    rerender(<List><ListItem title="A" onClick={() => {}} /></List>);
    expect(container.querySelector(".rebar-list")).not.toHaveAttribute("data-rebar-focus-ring");
  });
  it("draws the native ring on the row and none on the main area, with tokens", () => {
    expect(block).toContain('.rebar-list[data-rebar-focus-ring="item"] > .rebar-list-item:has(> .rebar-list-item-main:focus-visible)');
    expect(block).toContain("var(--rebar-list-item-focus-outline, auto 1px -webkit-focus-ring-color)");
    expect(block).toContain("var(--rebar-list-item-focus-outline-offset, 1px)");
  });
});

describe("parity-int3: ListItem pressed opacity and thumb tokens (defaults unchanged)", () => {
  it("pressed opacity defaults to 1", () => {
    expect(block).toContain(".rebar-list-item:active { opacity: var(--rebar-list-item-pressed-opacity, 1); }");
  });
  it("thumb overflow defaults to hidden and the child radius to 0", () => {
    expect(block).toContain("overflow: var(--rebar-list-item-thumb-overflow, hidden)");
    expect(block).toContain(":where(.rebar-list-item-thumb) > * { border-radius: var(--rebar-list-item-thumb-child-radius, 0); }");
  });
});

describe("parity-int3: SearchInput control tokens (defaults unchanged)", () => {
  it("text-overflow defaults to ellipsis and margin to 0", () => {
    expect(block).toContain("var(--rebar-search-input-control-text-overflow, ellipsis)");
    expect(block).toContain("var(--rebar-search-input-control-margin, 0)");
  });
});

describe("parity-int3: ActionSheet modal={false}", () => {
  it("is modal by default: aria-modal, Radix overlay", () => {
    render(<ActionSheet open onOpenChange={() => {}} title="T" items={[{ label: "One" }]} />);
    expect(document.querySelector('[aria-modal="true"]')).not.toBeNull();
    expect(document.querySelector(".rebar-dialog-overlay")).not.toBeNull();
  });
  it("non-modal keeps the dim layer, drops aria-modal, and focus can sit outside without closing", () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <input aria-label="outside" />
        <ActionSheet open onOpenChange={onOpenChange} title="T" items={[{ label: "One" }]} modal={false} />
      </div>,
    );
    expect(document.querySelector(".rebar-dialog-overlay")).not.toBeNull();
    expect(document.querySelector('[aria-modal="true"]')).toBeNull();
    const input = screen.getByLabelText("outside");
    input.focus();
    fireEvent.focusIn(input);
    expect(document.activeElement).toBe(input);
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});

describe("parity-int3: Tag label display and gap tokens (defaults unchanged)", () => {
  it("default to inline and no gap", () => {
    expect(block).toContain("display: var(--rebar-tag-label-display, inline)");
    expect(block).toContain("gap: var(--rebar-tag-label-gap, 0)");
  });
});

describe("parity-int3: Card feature coverFrame=clip", () => {
  it("is marked, and the wrapper inside the frame is stripped", () => {
    const { container } = render(<Card orientation="feature" coverFrame="clip" cover={<img alt="" src="/a.jpg" />} title="T" />);
    expect(container.querySelector(".rebar-card")).toHaveAttribute("data-rebar-cover-frame", "clip");
    expect(block).toContain('[data-rebar-cover-frame="clip"] > .rebar-card-cover .rebar-image');
  });
});

describe("parity-int3: popup footer rule token (default unchanged)", () => {
  it("takes --rebar-popup-footer-border, defaulting to the 1px hairline", () => {
    expect(block).toContain("border-top: var(--rebar-popup-footer-border, 1px solid var(--rebar-popup-hairline, var(--rebar-color-border)))");
  });
});
