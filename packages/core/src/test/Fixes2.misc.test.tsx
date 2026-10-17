import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "../components/SegmentedControl";
import { Progress } from "../components/Progress";
import { AiChatInput } from "../components/AiChatInput";
import { ChatThread } from "../components/ChatThread";
import { BackdropSection } from "../components/BackdropSection";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

afterEach(cleanup);
const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");

describe("SegmentedControl scrollable", () => {
  const options = Array.from({ length: 8 }, (_, i) => ({ value: `v${i}`, label: `Long label number ${i}` }));
  it("marks the group scrollable, keeps radio semantics, and has no-wrap snap CSS", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl options={options} scrollable onValueChange={onValueChange} aria-label="Many" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-rebar-scrollable", "true");
    await user.click(screen.getByRole("radio", { name: "Long label number 3" }));
    expect(onValueChange).toHaveBeenCalledWith("v3");
    expect(css).toMatch(/\[data-rebar-scrollable="true"\] \{[^}]*overflow-x: auto/);
    expect(css).toMatch(/scroll-snap-type: x proximity/);
    expect(css).toMatch(/\[data-rebar-scrollable="true"\] \.rebar-segmented-control-item \{[^}]*white-space: nowrap/);
  });
  it("scrolls the active segment into view when it changes", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    (HTMLElement.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView = spy;
    render(<SegmentedControl options={options} scrollable />);
    spy.mockClear();
    await user.click(screen.getByRole("radio", { name: "Long label number 5" }));
    expect(spy).toHaveBeenCalled();
    delete (HTMLElement.prototype as unknown as { scrollIntoView?: unknown }).scrollIntoView;
  });
  it("default is not scrollable", () => {
    render(<SegmentedControl options={options} />);
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("data-rebar-scrollable");
  });
});

describe("Progress warning", () => {
  it("sets the warning status and styles it with the warning token", () => {
    render(<Progress value={40} status="warning" aria-label="Quota" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-rebar-status", "warning");
    expect(css).toContain('.rebar-progress[data-rebar-status="warning"] .rebar-progress-indicator');
  });
});

describe("AiChatInput maxLength, counter and submitOnEnter", () => {
  it("applies maxLength to the field and shows a live counter that flags the limit", async () => {
    const user = userEvent.setup();
    render(<AiChatInput maxLength={10} showCounter />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveAttribute("maxlength", "10");
    expect(screen.getByText("0 / 10")).toBeInTheDocument();
    await user.type(field, "abcdefghi");
    const counter = screen.getByText("9 / 10");
    expect(counter).toHaveAttribute("data-rebar-near-limit", "true");
    await user.type(field, "jkl");
    expect(screen.getByText("10 / 10")).toBeInTheDocument();
  });
  it("no counter unless asked; works in morph mode too", () => {
    const { rerender } = render(<AiChatInput maxLength={10} />);
    expect(document.querySelector('[data-rebar-part="counter"]')).toBeNull();
    rerender(<AiChatInput maxLength={10} showCounter onDictate={() => {}} />);
    expect(document.querySelector('[data-rebar-part="counter"]')).not.toBeNull();
  });
  it("Enter sends by default; submitOnEnter={false} leaves Enter as a newline and the button still sends", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const { rerender } = render(<AiChatInput onSend={onSend} />);
    await user.type(screen.getByRole("textbox"), "hi{Enter}");
    expect(onSend).toHaveBeenCalledWith("hi");
    onSend.mockClear();
    rerender(<AiChatInput onSend={onSend} submitOnEnter={false} defaultValue="" />);
    const field = screen.getByRole("textbox") as HTMLTextAreaElement;
    await user.type(field, "a{Enter}b");
    expect(onSend).not.toHaveBeenCalled();
    expect(field.value).toBe("a\nb");
    await user.click(screen.getByRole("button", { name: /Send/ }));
    expect(onSend).toHaveBeenCalledWith("a\nb");
  });
});

describe("ChatThread afterMessages", () => {
  const messages = [
    { id: "1", role: "user" as const, content: "Hello" },
    { id: "2", role: "assistant" as const, content: "Hi there" },
  ];
  it("renders inside the scroller after the last message", () => {
    render(<ChatThread messages={messages} afterMessages={<button type="button">Suggest</button>} />);
    const scroller = document.querySelector('[data-rebar-part="scroll"]')!;
    const after = screen.getByRole("button", { name: "Suggest" });
    expect(scroller.contains(after)).toBe(true);
    const last = scroller.querySelectorAll('[data-rebar-part="message"]');
    expect(last[last.length - 1]!.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("renders after the typing indicator", () => {
    render(<ChatThread messages={messages} isTyping afterMessages={<i data-testid="a" />} />);
    const typing = document.querySelector('[data-rebar-part="typing-indicator"]')!;
    expect(typing.compareDocumentPosition(screen.getByTestId("a")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("nothing extra without the prop", () => {
    render(<ChatThread messages={messages} />);
    expect(document.querySelector('[data-rebar-part="after-messages"]')).toBeNull();
  });
});

describe("BackdropSection inset", () => {
  it("defaults to the current behaviour and inset={false} marks the drop of margin and padding", () => {
    const { rerender } = render(<BackdropSection image={{ src: "a.jpg" }} data-testid="b">x</BackdropSection>);
    expect(screen.getByTestId("b")).not.toHaveAttribute("data-rebar-inset");
    rerender(<BackdropSection image={{ src: "a.jpg" }} rounded inset={false} data-testid="b">x</BackdropSection>);
    expect(screen.getByTestId("b")).toHaveAttribute("data-rebar-inset", "false");
    expect(css).toMatch(/\.rebar-backdrop-section\[data-rebar-inset="false"\] \{\s*margin-inline: 0;\s*padding: 0;/);
  });
});
