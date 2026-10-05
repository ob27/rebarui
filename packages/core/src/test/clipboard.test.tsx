import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { copyToClipboard } from "../clipboard";
import { CodeBlock } from "../components/CodeBlock";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.assign(navigator, { clipboard: undefined });
  Reflect.deleteProperty(document, "execCommand");
});

const noClipboardApi = () => Object.assign(navigator, { clipboard: undefined }); // what a plain-http page has
const withExecCommand = (result: boolean) => {
  const fn = vi.fn(() => result);
  Object.defineProperty(document, "execCommand", { configurable: true, value: fn });
  return fn;
};

describe("copyToClipboard", () => {
  it("uses the clipboard API where it exists", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    expect(await copyToClipboard("hello")).toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to a hidden textarea and execCommand on a page with no clipboard API (plain http)", async () => {
    noClipboardApi();
    const exec = withExecCommand(true);
    let copied = "";
    exec.mockImplementation(() => { copied = (document.querySelector("textarea") as HTMLTextAreaElement).value; return true; });
    expect(await copyToClipboard("curl -s http://192.168.0.54:3202/join")).toBe(true);
    expect(exec).toHaveBeenCalledWith("copy");
    expect(copied).toBe("curl -s http://192.168.0.54:3202/join");
    expect(document.querySelector("textarea")).toBeNull(); // the helper cleans up after itself
  });

  it("falls back when the clipboard API exists but refuses", async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    withExecCommand(true);
    expect(await copyToClipboard("x")).toBe(true);
  });

  it("says false, and never throws, when nothing works", async () => {
    noClipboardApi();
    expect(await copyToClipboard("x")).toBe(false); // no execCommand at all
    withExecCommand(false);
    expect(await copyToClipboard("x")).toBe(false);
  });
});

describe("CodeBlock copy button", () => {
  it("copies on a page with no clipboard API, confirms it, and reports success through onCopy", async () => {
    noClipboardApi();
    withExecCommand(true);
    const onCopy = vi.fn();
    render(<CodeBlock code="npm install" onCopyResult={onCopy} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("does not claim success when the copy failed", async () => {
    noClipboardApi();
    const onCopy = vi.fn();
    render(<CodeBlock code="npm install" onCopyResult={onCopy} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument();
  });
});
