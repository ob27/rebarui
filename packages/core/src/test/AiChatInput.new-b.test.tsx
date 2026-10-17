import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiChatInput } from "../components/AiChatInput";

afterEach(cleanup);

describe("AiChatInput additions", () => {
  it("morph mode: empty field shows the mic, which calls onDictate", async () => {
    const onDictate = vi.fn();
    const user = userEvent.setup();
    render(<AiChatInput onDictate={onDictate} />);
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Dictate" }));
    expect(onDictate).toHaveBeenCalledTimes(1);
  });

  it("morph mode: typing morphs the mic into Send, which sends", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<AiChatInput onDictate={() => {}} onSend={onSend} />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(screen.queryByRole("button", { name: "Dictate" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("hello");
  });

  it("recording replaces the field with a Listening bar, a timer and a Stop button", async () => {
    const onDictate = vi.fn();
    const user = userEvent.setup();
    render(<AiChatInput onDictate={onDictate} recording={{ seconds: 75 }} data-testid="x" />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByRole("status", { name: "Listening" })).toHaveTextContent("1:15");
    await user.click(screen.getByRole("button", { name: "Stop recording" }));
    expect(onDictate).toHaveBeenCalledTimes(1);
  });

  it("recording true shows no timer", () => {
    render(<AiChatInput onDictate={() => {}} recording />);
    expect(document.querySelector('[data-rebar-part="timer"]')).toBeNull();
    expect(document.querySelector("[data-rebar-state='recording']")).not.toBeNull();
  });

  it("transcribing shows a spinner, marks the field busy and disables the mic", () => {
    render(<AiChatInput onDictate={() => {}} transcribing />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Transcribing…");
    expect(screen.getByRole("button", { name: "Dictate" })).toBeDisabled();
    expect(document.querySelector('[data-rebar-part="spinner"]')).not.toBeNull();
  });

  it("a ReactNode disabled value becomes the placeholder and disables everything", () => {
    render(<AiChatInput onDictate={() => {}} disabled="Catechist is replying…" />);
    const field = screen.getByRole("textbox");
    expect(field).toBeDisabled();
    expect(field).toHaveAttribute("placeholder", "Catechist is replying…");
    expect(screen.getByRole("button", { name: "Dictate" })).toBeDisabled();
  });

  it("disabled works in classic mode too", () => {
    render(<AiChatInput disabled="Offline" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Offline");
  });

  it("banner renders above the bar in both modes", () => {
    const { rerender } = render(<AiChatInput onDictate={() => {}} banner={<span>You're offline <button>Retry</button></span>} />);
    expect(screen.getByRole("status")).toHaveTextContent("You're offline");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    rerender(<AiChatInput banner="Quota used up" />);
    expect(screen.getByRole("status")).toHaveTextContent("Quota used up");
  });

  it("sendIcon and micIcon replace the glyphs", async () => {
    const user = userEvent.setup();
    render(<AiChatInput onDictate={() => {}} micIcon={<i data-testid="mic" />} sendIcon={<i data-testid="send" />} />);
    expect(screen.getByTestId("mic")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "a");
    expect(screen.getByTestId("send")).toBeInTheDocument();
  });

  it("without onDictate the classic Send button and dictation toggle are unchanged", () => {
    render(<AiChatInput dictation />);
    expect(screen.getByRole("button", { name: "Start dictation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(document.querySelector('[data-rebar-mode="morph"]')).toBeNull();
  });
});
