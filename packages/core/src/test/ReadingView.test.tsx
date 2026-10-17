import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadingView } from "../components/ReadingView";

afterEach(cleanup);

const verses = [
  { num: 1, text: "O senseless Galatians" },
  { num: 2, text: "This only would I learn of you" },
  { num: 3, text: "Are you so foolish" },
];

describe("ReadingView", () => {
  it("renders title, citation, numbered verses, media, actions and footer", () => {
    render(
      <ReadingView title="Galatians 3" citation="First reading" verses={verses} media={<div>Narration</div>} actions={<button>Reflect</button>} footer="Douay-Rheims" data-testid="r" />,
    );
    expect(screen.getByTestId("r")).toHaveAttribute("data-rebar-component", "reading-view");
    expect(screen.getByRole("heading", { level: 2, name: "Galatians 3" })).toBeInTheDocument();
    expect(screen.getByText("First reading")).toBeInTheDocument();
    expect(screen.getByText("Narration")).toBeInTheDocument();
    expect(screen.getByText("Are you so foolish")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reflect" })).toBeInTheDocument();
    expect(screen.getByText("Douay-Rheims")).toBeInTheDocument();
    expect(document.querySelectorAll('[data-rebar-part="verse-number"]')).toHaveLength(3);
  });

  it("highlights a verse or an inclusive range", () => {
    const { rerender } = render(<ReadingView verses={verses} highlight={2} />);
    expect(document.querySelectorAll("[data-rebar-highlighted]")).toHaveLength(1);
    rerender(<ReadingView verses={verses} highlight={[2, 3]} />);
    expect(document.querySelectorAll("[data-rebar-highlighted]")).toHaveLength(2);
  });

  it("verse action pills report the verse and switch to Note added", async () => {
    const onVerseAction = vi.fn();
    const user = userEvent.setup();
    render(<ReadingView verses={verses} onVerseAction={onVerseAction} notedVerses={[1]} />);
    expect(screen.getByRole("button", { name: "Note added, verse 1" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add Note, verse 2" }));
    expect(onVerseAction).toHaveBeenCalledWith(verses[1]);
  });

  it("verseActionLabel renames the pill; no handler means no pills", () => {
    const { rerender } = render(<ReadingView verses={verses} onVerseAction={() => {}} verseActionLabel="Bookmark" />);
    expect(screen.getByRole("button", { name: "Bookmark, verse 1" })).toBeInTheDocument();
    rerender(<ReadingView verses={verses} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders free text children for non-verse readings", () => {
    render(<ReadingView>Plain reading text</ReadingView>);
    expect(screen.getByText("Plain reading text")).toBeInTheDocument();
  });

  it("loading shows skeleton lines and hides actions", () => {
    render(<ReadingView loading verses={verses} actions={<button>Reflect</button>} />);
    expect(screen.getByLabelText("Loading reading")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Are you so foolish")).toBeNull();
    expect(screen.queryByRole("button", { name: "Reflect" })).toBeNull();
  });

  it("error is an alert; empty shows the message", () => {
    const { rerender } = render(<ReadingView error="Translation unavailable" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Translation unavailable");
    rerender(<ReadingView empty="No reading for this date" />);
    expect(screen.getByText("No reading for this date")).toBeInTheDocument();
  });

  it("tone sets the panel attribute and defaults to tint-2", () => {
    const { rerender } = render(<ReadingView verses={verses} data-testid="r" />);
    expect(screen.getByTestId("r")).toHaveAttribute("data-rebar-tone", "tint-2");
    rerender(<ReadingView verses={verses} tone="plain" data-testid="r" />);
    expect(screen.getByTestId("r")).toHaveAttribute("data-rebar-tone", "plain");
  });
});
