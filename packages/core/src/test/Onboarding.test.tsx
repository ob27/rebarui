import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Onboarding } from "../components/Onboarding";

afterEach(cleanup);

const slides = [
  { title: "Today’s readings", description: "Open Athic each day.", tint: "tint-1", icon: <svg data-testid="ic1" /> },
  { title: "Ask about the faith", description: "Answers with sources." },
  { title: "A private journal", description: "Encrypted on this device.", note: "Independent" },
];

describe("Onboarding", () => {
  it("shows the first slide as active and the others hidden from assistive tech", () => {
    render(<Onboarding slides={slides} data-testid="o" />);
    expect(screen.getByTestId("o")).toHaveAttribute("data-rebar-component", "onboarding");
    expect(screen.getByRole("heading", { name: "Today’s readings" })).toBeVisible();
    const slideEls = document.querySelectorAll('[data-rebar-part="slide"]');
    expect(slideEls[0]).not.toHaveAttribute("aria-hidden");
    expect(slideEls[1]).toHaveAttribute("aria-hidden", "true");
  });

  it("Next and Back move through slides (uncontrolled) and fire onIndexChange", async () => {
    const onIndexChange = vi.fn();
    const user = userEvent.setup();
    render(<Onboarding slides={slides} onIndexChange={onIndexChange} />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole("tab", { name: "Slide 2" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("tab", { name: "Slide 1" })).toHaveAttribute("aria-selected", "true");
  });

  it("controlled index only moves when the parent changes it", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Onboarding slides={slides} index={0} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("tab", { name: "Slide 1" })).toHaveAttribute("aria-selected", "true");
    rerender(<Onboarding slides={slides} index={2} />);
    expect(screen.getByRole("tab", { name: "Slide 3" })).toHaveAttribute("aria-selected", "true");
  });

  it("the last slide's button reads Get started and calls onDone; Skip is hidden there", async () => {
    const onDone = vi.fn();
    const user = userEvent.setup();
    render(<Onboarding slides={slides} defaultIndex={2} onDone={onDone} />);
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Get started" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("Skip calls onDone on earlier slides and can be turned off", async () => {
    const onDone = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Onboarding slides={slides} onDone={onDone} />);
    await user.click(screen.getByRole("button", { name: "Skip" }));
    expect(onDone).toHaveBeenCalledTimes(1);
    rerender(<Onboarding slides={slides} onDone={onDone} skippable={false} />);
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
  });

  it("custom labels replace the button copy", () => {
    render(<Onboarding slides={slides} labels={{ next: "Continue", skip: "Not now" }} />);
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Not now" })).toBeInTheDocument();
  });

  it("dots jump to a slide", async () => {
    const user = userEvent.setup();
    render(<Onboarding slides={slides} />);
    await user.click(screen.getByRole("tab", { name: "Slide 3" }));
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });

  it("arrow keys on the region change slide", async () => {
    const user = userEvent.setup();
    render(<Onboarding slides={slides} data-testid="o" />);
    screen.getByTestId("o").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Slide 2" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Slide 1" })).toHaveAttribute("aria-selected", "true");
  });

  it("a swipe past the threshold changes slide; a short drag does not", () => {
    render(<Onboarding slides={slides} />);
    const viewport = document.querySelector('[data-rebar-part="viewport"]')!;
    // jsdom has no PointerEvent (clientX is dropped), so drive the handlers with MouseEvents of the same type
    const drag = (from: number, to: number) => {
      act(() => {
        viewport.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: from }));
        viewport.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: to }));
        viewport.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: to }));
      });
    };
    drag(300, 280);
    expect(screen.getByRole("tab", { name: "Slide 1" })).toHaveAttribute("aria-selected", "true");
    drag(300, 200);
    expect(screen.getByRole("tab", { name: "Slide 2" })).toHaveAttribute("aria-selected", "true");
    drag(100, 220);
    expect(screen.getByRole("tab", { name: "Slide 1" })).toHaveAttribute("aria-selected", "true");
  });

  it("finishing puts the last button into its loading state and hides Back", () => {
    render(<Onboarding slides={slides} defaultIndex={2} finishing data-testid="o" />);
    expect(screen.getByTestId("o")).toHaveAttribute("data-rebar-state", "finishing");
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    expect(screen.getByRole("button", { name: /Get started/ })).toBeDisabled();
  });

  it("renders icon tint and note", () => {
    render(<Onboarding slides={slides} defaultIndex={2} />);
    expect(screen.getByText("Independent")).toBeInTheDocument();
    expect(document.querySelector('[data-rebar-part="icon"]')).toHaveStyle({ background: "var(--rebar-color-tint-1)" });
  });
});
