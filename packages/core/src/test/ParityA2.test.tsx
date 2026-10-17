import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiChatInput } from "../components/AiChatInput";
import { ChatThread } from "../components/ChatThread";
import type { ChatMessage } from "../components/ChatThread";
import { Chip } from "../components/Chip";
import { NoticeBar } from "../components/NoticeBar";

afterEach(cleanup);

describe("AiChatInput variant=boxed (parity A2)", () => {
  it("is unchanged by default: no variant attribute", () => {
    const { container } = render(<AiChatInput />);
    expect(container.querySelector('[data-rebar-component="ai-chat-input"]')).not.toHaveAttribute("data-rebar-variant");
  });

  it("marks the boxed variant and renders a round Send (disabled while empty) without onDictate", () => {
    const { container } = render(<AiChatInput variant="boxed" />);
    expect(container.querySelector('[data-rebar-variant="boxed"]')).toBeInTheDocument();
    const send = screen.getByRole("button", { name: "Send" });
    expect(send).toBeDisabled();
    expect(send).toHaveClass("rebar-ai-chat-input-round");
  });

  it("singleLine renders an <input>: Enter sends, the field never grows", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<AiChatInput variant="boxed" singleLine onSend={onSend} />);
    const field = screen.getByRole("textbox", { name: "Chat message" });
    expect(field.tagName).toBe("INPUT");
    await user.type(field, "Hello{Enter}");
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("sends from the round button once there is text, with the custom glyph", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<AiChatInput variant="boxed" singleLine onSend={onSend} defaultValue="Hi" sendIcon={<i data-testid="glyph" />} />);
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("Hi");
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });

  it("with onDictate: mic while empty; recording keeps the field and turns the button into Stop (no Listening pill)", async () => {
    const user = userEvent.setup();
    const onDictate = vi.fn();
    const { rerender, container } = render(<AiChatInput variant="boxed" singleLine onDictate={onDictate} />);
    await user.click(screen.getByRole("button", { name: "Dictate" }));
    expect(onDictate).toHaveBeenCalledTimes(1);
    rerender(<AiChatInput variant="boxed" singleLine onDictate={onDictate} recording={{ seconds: 2 }} micIcon={<i data-testid="mic" />} />);
    expect(container.querySelector('[data-rebar-part="listening"]')).toBeNull();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    const stop = screen.getByRole("button", { name: "Stop recording" });
    expect(stop).toHaveAttribute("data-rebar-tone", "stop");
    expect(screen.getByTestId("mic")).toBeInTheDocument();
  });

  it("transcribing shows the busy glyph in a disabled round button and leaves the field editable", () => {
    render(<AiChatInput variant="boxed" singleLine onDictate={() => {}} transcribing busyIcon={<i data-testid="busy" />} />);
    expect(screen.getByRole("button", { name: "Transcribing…" })).toBeDisabled();
    expect(screen.getByTestId("busy")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).not.toHaveAttribute("readonly");
  });

  it("disabled disables the field and the round button", () => {
    render(<AiChatInput variant="boxed" singleLine disabled defaultValue="hi" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("the default (pill) composer still uses a textarea", () => {
    render(<AiChatInput />);
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });
});

const msgs = (extra: Partial<ChatMessage> = {}): ChatMessage[] => [
  { id: "u", role: "user", content: "What is grace?" },
  { id: "a", role: "assistant", content: "plain text", ...extra },
];

describe("ChatThread variant=bubbles (parity A2)", () => {
  it("is unchanged by default: no variant attribute, citations stay pills", () => {
    const { container } = render(<ChatThread messages={msgs({ citations: [{ label: "CCC 1996" }] })} />);
    expect(container.querySelector("[data-rebar-variant]")).toBeNull();
    expect(container.querySelector('[data-rebar-part="citations"] .rebar-chat-message-citation')).toBeInTheDocument();
    expect(container.querySelector(".rebar-chat-citation-card")).toBeNull();
  });

  it("marks the variant and renders `body` in place of the content", () => {
    const { container } = render(<ChatThread variant="bubbles" messages={msgs({ body: <strong data-testid="body">bold</strong> })} />);
    expect(container.querySelector('[data-rebar-variant="bubbles"]')).toBeInTheDocument();
    expect(screen.getByTestId("body")).toBeInTheDocument();
    expect(screen.queryByText("plain text")).toBeNull();
  });

  it("renders citations as cards with a link label, a note and the snippet; extra ones fold behind a summary", () => {
    const { container } = render(
      <ChatThread
        variant="bubbles"
        moreCitationsLabel={(n) => `${n} more Catechism citations`}
        messages={msgs({
          citations: [
            { label: "CCC 1996", note: "— Grace", detail: "Grace is favor.", href: "https://example.org/1996" },
            { label: "CCC 2006", detail: "Merit." },
            { label: "CCC 1987" },
          ],
        })}
      />,
    );
    const cards = container.querySelectorAll(".rebar-chat-citation-card");
    expect(cards).toHaveLength(3);
    expect(screen.getByRole("link", { name: "CCC 1996" })).toHaveAttribute("href", "https://example.org/1996");
    expect(screen.getByText("Grace is favor.")).toBeInTheDocument();
    expect(container.querySelector(".rebar-chat-citation-card-title")?.textContent).toBe("CCC 1996 — Grace");
    expect(container.querySelector("details.rebar-chat-citation-more summary")?.textContent).toBe("2 more Catechism citations");
    expect(container.querySelector("details")?.contains(cards[0] ?? null)).toBe(false);
    expect(container.querySelector("details")?.contains(cards[1] ?? null)).toBe(true);
  });

  it("shows citationsEmptyNote only when there are no citations", () => {
    const { rerender } = render(<ChatThread variant="bubbles" messages={msgs({ citations: [], citationsEmptyNote: "No Catechism citation" })} />);
    expect(screen.getByText("No Catechism citation")).toBeInTheDocument();
    rerender(<ChatThread variant="bubbles" messages={msgs({ citations: [{ label: "CCC 1" }], citationsEmptyNote: "No Catechism citation" })} />);
    expect(screen.queryByText("No Catechism citation")).toBeNull();
  });

  it("puts bodyFooter inside the bubble and floating actions on the bubble", () => {
    const { container } = render(
      <ChatThread
        variant="bubbles"
        messages={[{ id: "u", role: "user", content: "hi", actions: <button type="button">retry</button>, bodyFooter: <span>fold</span> }]}
      />,
    );
    const bubble = container.querySelector(".rebar-chat-message-bubble");
    expect(bubble?.contains(screen.getByText("fold"))).toBe(true);
    expect(bubble?.contains(screen.getByRole("button", { name: "retry" }))).toBe(true);
    expect(container.querySelector(".rebar-chat-message-actions-floating")).toBeInTheDocument();
  });

  it("scrollToLatest takes a threshold and icon: a round, labelled button", () => {
    const messages: ChatMessage[] = Array.from({ length: 4 }, (_, i) => ({ id: `m${i}`, role: i % 2 ? "assistant" : "user", content: `message ${i}` }));
    const { container } = render(<ChatThread variant="bubbles" messages={messages} scrollToLatest={{ label: "Scroll to latest", threshold: 120, icon: <i data-testid="arrow" /> }} />);
    const scroller = container.querySelector('[data-rebar-part="scroll"]') as HTMLElement;
    Object.defineProperty(scroller, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(scroller, "clientHeight", { value: 300, configurable: true });
    scroller.scrollTop = 500; // 200px from the bottom: past the 120px threshold
    fireEvent.scroll(scroller);
    const button = screen.getByRole("button", { name: "Scroll to latest" });
    expect(button).toContainElement(screen.getByTestId("arrow"));
    scroller.scrollTop = 600; // 100px from the bottom: inside the threshold, so the button goes away
    fireEvent.scroll(scroller);
    expect(screen.queryByRole("button", { name: "Scroll to latest" })).toBeNull();
  });

  it("a streaming message with empty content shows the waiting dots (the typing indicator)", () => {
    const { container } = render(<ChatThread variant="bubbles" messages={[{ id: "s", role: "assistant", content: "", status: "streaming" }]} />);
    expect(container.querySelectorAll(".rebar-chat-message-waiting .rebar-chat-typing-dot")).toHaveLength(3);
  });
});

describe("Chip (parity A2)", () => {
  it("is a button with variant and size marks, defaulting to tonal md", () => {
    render(<Chip>Share answer</Chip>);
    const chip = screen.getByRole("button", { name: "Share answer" });
    expect(chip).toHaveAttribute("type", "button");
    expect(chip).toHaveAttribute("data-rebar-variant", "tonal");
    expect(chip).not.toHaveAttribute("data-rebar-size");
    expect(chip).not.toHaveAttribute("aria-pressed");
  });

  it("sm size, outline variant and the pressed state reach the DOM", () => {
    render(<Chip variant="outline" size="sm" pressed aria-label="Helpful" />);
    const chip = screen.getByRole("button", { name: "Helpful" });
    expect(chip).toHaveAttribute("data-rebar-size", "sm");
    expect(chip).toHaveAttribute("data-rebar-variant", "outline");
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onClick and honours disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Chip onClick={onClick}>Read more</Chip>);
    await user.click(screen.getByRole("button", { name: "Read more" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Chip onClick={onClick} disabled>Read more</Chip>);
    await user.click(screen.getByRole("button", { name: "Read more" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("NoticeBar variant=banner (parity A2)", () => {
  it("is unchanged by default", () => {
    const { container } = render(<NoticeBar content="hi" />);
    expect(container.querySelector("[data-rebar-variant]")).toBeNull();
  });

  it("marks the banner variant", () => {
    const { container } = render(<NoticeBar tone="warning" variant="banner" wrap content="You're offline." />);
    expect(container.querySelector('[data-rebar-variant="banner"]')).toBeInTheDocument();
    expect(screen.getByText("You're offline.")).toBeInTheDocument();
  });
});
