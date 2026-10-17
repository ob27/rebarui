import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatThread } from "../components/ChatThread";

afterEach(cleanup);

function setScroll(el: HTMLElement, { top, height, client }: { top: number; height: number; client: number }) {
  Object.defineProperty(el, "scrollHeight", { configurable: true, value: height });
  Object.defineProperty(el, "clientHeight", { configurable: true, value: client });
  el.scrollTop = top;
}

describe("ChatThread additions", () => {
  it("renders messages[].footer under the bubble", () => {
    render(<ChatThread messages={[{ id: "1", role: "assistant", content: "Answer", footer: <button>Share answer</button> }]} />);
    const footer = document.querySelector('[data-rebar-part="footer"]')!;
    expect(footer).toContainElement(screen.getByRole("button", { name: "Share answer" }));
  });

  it("hides the footer on crisis and blocked messages", () => {
    render(
      <ChatThread
        messages={[
          { id: "1", role: "assistant", content: "Crisis", tone: "crisis", footer: <button>Thumbs</button> },
          { id: "2", role: "assistant", content: "Blocked", tone: "blocked", footer: <button>Thumbs</button> },
          { id: "3", role: "assistant", content: "Fine", footer: <button>Thumbs ok</button> },
        ]}
      />,
    );
    expect(screen.queryAllByRole("button", { name: "Thumbs" })).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Thumbs ok" })).toBeInTheDocument();
  });

  it("crisis tone is an alert with its own tone attribute; blocked has a tone attribute but no alert", () => {
    render(
      <ChatThread
        messages={[
          { id: "1", role: "assistant", content: "Please call someone", tone: "crisis" },
          { id: "2", role: "assistant", content: "Cannot help with that", tone: "blocked" },
        ]}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Please call someone");
    expect(screen.getByRole("alert")).toHaveAttribute("data-rebar-tone", "crisis");
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(document.querySelector('[data-rebar-tone="blocked"]')).not.toBeNull();
  });

  it("highlight tone is unchanged", () => {
    render(<ChatThread messages={[{ id: "1", role: "user", content: "hi", tone: "highlight" }]} />);
    expect(document.querySelector('[data-rebar-tone="highlight"]')).not.toBeNull();
  });

  it("citation detail becomes the pill's title", () => {
    render(<ChatThread messages={[{ id: "1", role: "assistant", content: "x", citations: [{ label: "CCC 1461", detail: "Catechism of the Catholic Church" }] }]} />);
    expect(screen.getByText("CCC 1461")).toHaveAttribute("title", "Catechism of the Catholic Church");
  });

  it("scrollToLatest shows a Latest pill only while the reader is above the newest message, then scrolls and reports", async () => {
    const onReachLatest = vi.fn();
    const user = userEvent.setup();
    const messages = [
      { id: "1", role: "user" as const, content: "one" },
      { id: "2", role: "assistant" as const, content: "two" },
    ];
    render(<ChatThread messages={messages} scrollToLatest onReachLatest={onReachLatest} />);
    expect(screen.queryByRole("button", { name: /Latest/ })).toBeNull();
    const scroller = document.querySelector('[data-rebar-part="scroll"]') as HTMLElement;
    scroller.scrollTo = vi.fn() as unknown as typeof scroller.scrollTo;
    setScroll(scroller, { top: 0, height: 1000, client: 300 });
    fireEvent.scroll(scroller);
    const pill = screen.getByRole("button", { name: /Latest/ });
    expect(pill).toHaveAttribute("data-rebar-part", "latest");
    await user.click(pill);
    expect(scroller.scrollTo).toHaveBeenCalled();
    expect(onReachLatest).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: /Latest/ })).toBeNull();
  });

  it("scrolling back to the bottom hides the pill and calls onReachLatest", () => {
    const onReachLatest = vi.fn();
    render(<ChatThread messages={[{ id: "1", role: "user", content: "one" }]} scrollToLatest={{ label: "Newest" }} onReachLatest={onReachLatest} />);
    const scroller = document.querySelector('[data-rebar-part="scroll"]') as HTMLElement;
    setScroll(scroller, { top: 0, height: 1000, client: 300 });
    fireEvent.scroll(scroller);
    expect(screen.getByRole("button", { name: /Newest/ })).toBeInTheDocument();
    setScroll(scroller, { top: 700, height: 1000, client: 300 });
    fireEvent.scroll(scroller);
    expect(screen.queryByRole("button", { name: /Newest/ })).toBeNull();
    expect(onReachLatest).toHaveBeenCalledTimes(1);
  });

  it("without scrollToLatest no Latest pill ever appears", () => {
    render(<ChatThread messages={[{ id: "1", role: "user", content: "one" }]} />);
    const scroller = document.querySelector('[data-rebar-part="scroll"]') as HTMLElement;
    setScroll(scroller, { top: 0, height: 1000, client: 300 });
    fireEvent.scroll(scroller);
    expect(document.querySelector('[data-rebar-part="latest"]')).toBeNull();
  });
});
