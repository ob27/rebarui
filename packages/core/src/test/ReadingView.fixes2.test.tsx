import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ReadingView } from "../components/ReadingView";

afterEach(cleanup);
const verses = [
  { num: 1, text: "In the beginning", extra: <textarea aria-label="Note for verse 1" /> },
  { num: 2, text: "And the earth" },
];

describe("ReadingView fixes-2", () => {
  it("renders a verse's extra slot under its text, inside that verse only", () => {
    render(<ReadingView verses={verses} onVerseAction={() => {}} />);
    const rows = document.querySelectorAll('[data-rebar-part="verse"]');
    expect(rows[0]!.querySelector('[data-rebar-part="verse-extra"] textarea')).not.toBeNull();
    expect(rows[1]!.querySelector('[data-rebar-part="verse-extra"]')).toBeNull();
    const text = rows[0]!.querySelector(".rebar-reading-view-text")!;
    const extra = rows[0]!.querySelector('[data-rebar-part="verse-extra"]')!;
    expect(text.compareDocumentPosition(extra) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("renderVerse replaces the row content and receives the context", () => {
    render(
      <ReadingView
        verses={verses}
        highlight={2}
        notedVerses={[1]}
        renderVerse={(v, ctx) => (
          <div data-testid={`rv-${v.num}`} data-hl={String(ctx.highlighted)} data-noted={String(ctx.noted)}>
            custom {v.num}
            {ctx.content}
          </div>
        )}
      />,
    );
    expect(screen.getByTestId("rv-1")).toHaveAttribute("data-noted", "true");
    expect(screen.getByTestId("rv-2")).toHaveAttribute("data-hl", "true");
    expect(screen.getByTestId("rv-1")).toHaveTextContent("custom 1In the beginning");
    // the number and the row marks stay
    const row = screen.getByTestId("rv-2").closest('[data-rebar-part="verse"]')!;
    expect(row.querySelector('[data-rebar-part="verse-number"]')).toHaveTextContent("2");
    expect(row).toHaveAttribute("data-rebar-highlighted", "true");
  });
  it("renderVerse can drop the default content entirely", () => {
    render(<ReadingView verses={verses} renderVerse={(v) => <b>only {v.num}</b>} />);
    expect(screen.queryByText("In the beginning")).toBeNull();
    expect(screen.getByText("only 2")).toBeInTheDocument();
  });
  it("verseFont sets a marker; unset leaves it off", () => {
    const { container, rerender } = render(<ReadingView verses={verses} verseFont="sans" />);
    expect(container.firstElementChild).toHaveAttribute("data-rebar-verse-font", "sans");
    rerender(<ReadingView verses={verses} />);
    expect(container.firstElementChild).not.toHaveAttribute("data-rebar-verse-font");
  });
});
