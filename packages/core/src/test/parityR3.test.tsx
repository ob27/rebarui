import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ReadingView } from "../components/ReadingView";
import { Card } from "../components/Card";
import { List, ListItem } from "../components/List";
import { Statistic } from "../components/Statistic";

afterEach(cleanup);

const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
const block = css.slice(css.indexOf("/* ---- parity-r3"));

describe("parity-r3: ReadingView", () => {
  it("loading without a label is still the skeleton lines", () => {
    const { container } = render(<ReadingView loading />);
    expect(container.querySelectorAll(".rebar-reading-view-line").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Loading reading")).toHaveAttribute("aria-busy", "true");
  });

  it("loadingLabel replaces the skeleton with a busy text message", () => {
    const { container } = render(<ReadingView loading loadingLabel="Loading…" />);
    expect(container.querySelectorAll(".rebar-reading-view-line").length).toBe(0);
    const part = container.querySelector('[data-rebar-part="loading"]')!;
    expect(part).toHaveTextContent("Loading…");
    expect(part).toHaveAttribute("aria-busy", "true");
  });

  it("verseActions=below is a marker; the default leaves it off", () => {
    const verses = [{ num: 1, text: "In the beginning" }];
    const { container, rerender } = render(<ReadingView verses={verses} onVerseAction={() => {}} verseActions="below" />);
    expect(container.firstElementChild).toHaveAttribute("data-rebar-verse-actions", "below");
    rerender(<ReadingView verses={verses} onVerseAction={() => {}} />);
    expect(container.firstElementChild).not.toHaveAttribute("data-rebar-verse-actions");
  });

  it("below: a verse with extra shows it instead of the action pill; inline keeps both", () => {
    const verses = [{ num: 1, text: "In the beginning", extra: <textarea aria-label="note" /> }];
    const { container, rerender } = render(<ReadingView verses={verses} onVerseAction={() => {}} verseActions="below" />);
    expect(container.querySelector('[data-rebar-part="verse-action"]')).toBeNull();
    expect(container.querySelector('[data-rebar-part="verse-extra"] textarea')).not.toBeNull();
    rerender(<ReadingView verses={verses} onVerseAction={() => {}} />);
    expect(container.querySelector('[data-rebar-part="verse-action"]')).not.toBeNull();
  });

  it("every metric is an opt-in property whose fallback is the previous value", () => {
    for (const re of [
      /gap: var\(--rebar-reading-view-panel-gap, var\(--rebar-space-md\)\)/,
      /font-size: var\(--rebar-reading-view-citation-size, var\(--rebar-font-size-xs\)\)/,
      /letter-spacing: var\(--rebar-reading-view-citation-tracking, 0\.06em\)/,
      /padding: var\(--rebar-reading-view-message-padding, var\(--rebar-space-md\)\)/,
      /text-align: var\(--rebar-reading-view-message-align, center\)/,
      /max-width: var\(--rebar-reading-view-body-max-width, 34em\)/,
      /grid-template-columns: var\(--rebar-reading-view-verse-columns, 1\.6em 1fr\)/,
      /min-height: var\(--rebar-reading-view-pill-min-height, 44px\)/,
      /text-decoration: var\(--rebar-reading-view-pill-decoration, underline\)/,
    ]) expect(block).toMatch(re);
  });
});

describe("parity-r3: Card orientation=feature", () => {
  it("marks the card; the default has no orientation mark", () => {
    const { container, rerender } = render(<Card orientation="feature" title="Quiet morning" eyebrow="Reflection">Body</Card>);
    expect(container.firstElementChild).toHaveAttribute("data-rebar-orientation", "feature");
    rerender(<Card title="Quiet morning">Body</Card>);
    expect(container.firstElementChild).not.toHaveAttribute("data-rebar-orientation");
  });

  it("keeps the eyebrow, title and body parts", () => {
    render(<Card orientation="feature" href="/x" title="Quiet morning" eyebrow="Reflection">A note</Card>);
    expect(screen.getByRole("link")).toHaveTextContent("ReflectionQuiet morningA note");
  });

  it("is sized by opt-in properties", () => {
    for (const re of [/--rebar-card-feature-cover-radius, 26px/, /--rebar-card-feature-gap, 12px/, /--rebar-card-feature-chip-size, 11px/]) expect(block).toMatch(re);
  });
});

describe("parity-r3: ListItem tone", () => {
  it("marks a toned row; untoned rows have no tone mark", () => {
    render(
      <List>
        <ListItem title="Done" tone={1} />
        <ListItem title="Open" />
      </List>,
    );
    const items = document.querySelectorAll("li");
    expect(items[0]).toHaveAttribute("data-rebar-tone", "1");
    expect(items[1]).not.toHaveAttribute("data-rebar-tone");
  });

  it("the leading control box and the title wrap are opt-in properties with the previous fallbacks", () => {
    for (const re of [
      /min-width: var\(--rebar-list-item-leading-min-width, 44px\)/,
      /padding: var\(--rebar-list-item-leading-padding, 0 0 0 8px\)/,
      /text-wrap: var\(--rebar-list-item-title-text-wrap, pretty\)/,
      /gap: var\(--rebar-list-plain-gap, 0\)/,
      /white-space: var\(--rebar-list-item-description-white-space, normal\)/,
    ]) expect(block).toMatch(re);
  });
});

describe("parity-r3: Statistic titlePlacement", () => {
  it("bottom marks the placement; the default keeps the title above", () => {
    const { container, rerender } = render(<Statistic title="Attended" value={3} titlePlacement="bottom" />);
    expect(container.firstElementChild).toHaveAttribute("data-rebar-title-placement", "bottom");
    rerender(<Statistic title="Attended" value={3} />);
    expect(container.firstElementChild).not.toHaveAttribute("data-rebar-title-placement");
  });
});

describe("parity-r3: section label, Button, Tag and heatmap properties", () => {
  it("fall back to the previous values", () => {
    for (const re of [
      /font-size: var\(--rebar-section-label-size, 12px\)/,
      /letter-spacing: var\(--rebar-section-label-tracking, 0\.16em\)/,
      /font-family: var\(--rebar-button-font-family, inherit\)/,
      /font-family: var\(--rebar-tag-font-family, inherit\)/,
      /width: var\(--rebar-calendar-heatmap-cell-size, 22px\)/,
      /flex-basis: var\(--rebar-calendar-heatmap-month-width, 56px\)/,
      /padding: var\(--rebar-calendar-heatmap-body-padding, 0\)/,
    ]) expect(block).toMatch(re);
  });
});
