import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Textarea } from "../components/Textarea";

describe("Textarea", () => {
  it("renders a labelled textbox with data attributes and default rows", () => {
    render(<Textarea aria-label="Reflection" />);
    const box = screen.getByRole("textbox", { name: "Reflection" });
    expect(box.tagName).toBe("TEXTAREA");
    expect(box).toHaveAttribute("data-rebar-component", "textarea");
    expect(box).toHaveAttribute("rows", "3");
  });

  it("is uncontrolled and calls onChange", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="r" defaultValue="Hi" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "!");
    expect(screen.getByRole("textbox")).toHaveValue("Hi!");
    expect(onChange).toHaveBeenCalled();
  });

  it("is controlled", async () => {
    function Host() {
      const [v, setV] = useState("");
      return <Textarea aria-label="r" value={v} onChange={(e) => setV(e.target.value.toUpperCase())} />;
    }
    render(<Host />);
    await userEvent.type(screen.getByRole("textbox"), "ab");
    expect(screen.getByRole("textbox")).toHaveValue("AB");
  });

  it("shows a count with maxLength and flags the limit", async () => {
    render(<Textarea aria-label="r" maxLength={5} showCount />);
    const count = () => document.querySelector('[data-rebar-part="count"]') as HTMLElement;
    expect(count()).toHaveTextContent("0 / 5");
    expect(count()).not.toHaveAttribute("data-rebar-at-limit");
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(count()).toHaveTextContent("5 / 5");
    expect(count()).toHaveAttribute("data-rebar-at-limit", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", count().id);
  });

  it("count without maxLength shows the length", async () => {
    render(<Textarea aria-label="r" showCount />);
    await userEvent.type(screen.getByRole("textbox"), "abc");
    expect(document.querySelector('[data-rebar-part="count"]')).toHaveTextContent("3");
  });

  it("invalid sets aria-invalid", () => {
    render(<Textarea aria-label="r" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("data-rebar-invalid", "true");
  });

  it("marks autoSize, size and resize", () => {
    render(<Textarea aria-label="r" autoSize={{ minRows: 2, maxRows: 4 }} size="lg" resize="vertical" />);
    const box = screen.getByRole("textbox");
    expect(box).toHaveAttribute("data-rebar-autosize", "true");
    expect(box).toHaveAttribute("data-rebar-size", "lg");
    expect(box).toHaveAttribute("data-rebar-resize", "vertical");
  });

  it("disabled and readOnly pass through", () => {
    const { rerender } = render(<Textarea aria-label="r" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    rerender(<Textarea aria-label="r" readOnly />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });
});
