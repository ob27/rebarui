import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { buildTruncated, Ellipsis } from "../components/Ellipsis";

afterEach(cleanup);

describe("buildTruncated", () => {
  const content = "abcdefghij";

  it("returns the full content unchanged once keep reaches its length", () => {
    expect(buildTruncated(content, 10, "end")).toBe(content);
    expect(buildTruncated(content, 20, "end")).toBe(content);
  });

  it("direction='end' keeps the first N chars and appends an ellipsis", () => {
    expect(buildTruncated(content, 4, "end")).toBe("abcd…");
  });

  it("direction='start' keeps the last N chars and prepends an ellipsis", () => {
    expect(buildTruncated(content, 4, "start")).toBe("…ghij");
  });

  it("direction='middle' splits the kept chars across the front and back, ellipsis in between", () => {
    expect(buildTruncated(content, 4, "middle")).toBe("ab…ij");
  });

  it("keep<=0 collapses to a bare ellipsis", () => {
    expect(buildTruncated(content, 0, "end")).toBe("…");
  });
});

describe("Ellipsis", () => {
  // jsdom reports every element's scrollHeight as 0, so the real measure-and-truncate effect
  // can never detect overflow in a unit test — content always renders in full here, the same
  // documented limitation NoticeBar's own marquee-measurement tests already accept. The
  // truncation math itself is covered directly above, against the real `buildTruncated`.
  it("renders the full content (jsdom can't measure real overflow)", () => {
    render(<Ellipsis content="Some short text" />);
    expect(screen.getByText("Some short text")).toBeInTheDocument();
  });

  it("renders no expand/collapse button when content isn't measured as overflowing", () => {
    render(<Ellipsis content="Some short text" expandText="More" collapseText="Less" />);
    expect(screen.queryByRole("button", { name: "More" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Less" })).not.toBeInTheDocument();
  });

  it("calls onContentClick when the rendered text is clicked", async () => {
    const user = userEvent.setup();
    const onContentClick = vi.fn();
    render(<Ellipsis content="Some short text" onContentClick={onContentClick} />);
    await user.click(screen.getByText("Some short text"));
    expect(onContentClick).toHaveBeenCalled();
  });

  it("accepts controlled open/onOpenChange without throwing", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Ellipsis content="Some short text" open={false} onOpenChange={onOpenChange} />);
    rerender(<Ellipsis content="Some short text" open onOpenChange={onOpenChange} />);
    expect(screen.getByText("Some short text")).toBeInTheDocument();
  });
});

describe("Ellipsis truncation and layout", () => {
  afterEach(() => vi.restoreAllMocks());

  it("the stylesheet gives .rebar-ellipsis block display so it has a measurable width", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    const rule = css.match(/\.rebar-ellipsis\s*\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    expect(rule![1]).toMatch(/display:\s*block/);
  });

  it("truncates with a real ellipsis and offers the expand button once the measurer overflows", () => {
    // jsdom has no layout: fake a 200px container and a measurer that wraps to a second line past 20 characters.
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLElement) {
      return (this.textContent ?? "").length > 24 ? 40 : 20;
    });
    const content = "Interview 11: the crew keep a paper copy of the rota in the cab";
    const { container } = render(<Ellipsis content={content} rows={1} expandText="More" />);
    const shown = container.querySelector('[data-rebar-part="content"]')!.textContent!;
    expect(shown.endsWith("\u2026")).toBe(true);
    expect(shown.length).toBeLessThan(content.length);
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
  });
});