import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BlockRenderer } from "../BlockRenderer";
import { isOpinionConstructType } from "../opinions";
import type { Construct } from "../schema";

const img = (alt: string) => ({ src: "/x.png", alt });

// Captured from the hero renderer before the media/backgroundSrc/align fields existed.
const LEGACY_HERO_MIN: string = "<div class=\"rebar-box\" data-rebar-component=\"box\" data-rebar-placement-root=\"true\"><div class=\"rebar-stack\" data-rebar-component=\"stack\" data-rebar-direction=\"column\" style=\"gap: var(--rebar-space-lg, 24px);\"><div class=\"rebar-stack\" data-rebar-component=\"stack\" data-rebar-direction=\"column\" style=\"gap: var(--rebar-space-lg, 24px); align-items: center; text-align: center;\" data-rebar-placement-block=\"hero\" data-rebar-block-path=\"blocks[0]\"><h1 class=\"rebar-heading\" data-rebar-component=\"heading\" data-rebar-level=\"1\" style=\"font-size: 56px; line-height: 1.1;\">Welcome</h1><p class=\"rebar-text\" data-rebar-component=\"text\" data-rebar-size=\"md\" data-rebar-color=\"secondary\" style=\"max-width: 560px;\">Build <span><a href=\"/docs\" class=\"rebar-link\">docs</a></span> now.</p></div></div></div>";
const LEGACY_HERO_FULL: string = "<div class=\"rebar-box\" data-rebar-component=\"box\" data-rebar-placement-root=\"true\"><div class=\"rebar-stack\" data-rebar-component=\"stack\" data-rebar-direction=\"column\" style=\"gap: var(--rebar-space-lg, 24px);\"><div class=\"rebar-stack\" data-rebar-component=\"stack\" data-rebar-direction=\"column\" style=\"gap: var(--rebar-space-lg, 24px); align-items: center; text-align: center;\" data-rebar-placement-block=\"hero\" data-rebar-block-path=\"blocks[0]\"><div class=\"rebar-box\" data-rebar-component=\"box\" style=\"display: inline-block; padding: var(--rebar-space-xs) var(--rebar-space-md); background: var(--rebar-color-bg-secondary, #f5f5f5); border: var(--rebar-border-width, 1px) solid var(--rebar-color-border, #e0e0e0); border-radius: 999px; font-size: var(--rebar-font-size-xs);\">New</div><img src=\"/l.svg\" alt=\"Welcome\" class=\"rebar-theme-image-light\" style=\"display: block; width: auto; height: 40px;\"><img src=\"/d.svg\" alt=\"Welcome\" class=\"rebar-theme-image-dark\" style=\"display: none; width: auto; height: 40px;\"><p class=\"rebar-text\" data-rebar-component=\"text\" data-rebar-size=\"md\" data-rebar-color=\"secondary\" style=\"max-width: 560px;\">Sub</p><div class=\"rebar-stack\" data-rebar-component=\"stack\" data-rebar-direction=\"row\" style=\"gap: var(--rebar-space-sm, 8px);\"><span><a href=\"/go\" class=\"rebar-link\"><button type=\"button\" class=\"rebar-button\" data-rebar-component=\"button\" data-rebar-variant=\"primary\" data-rebar-size=\"lg\" data-rebar-state=\"idle\">Go</button></a></span><span><button type=\"button\" class=\"rebar-button\" data-rebar-component=\"button\" data-rebar-variant=\"secondary\" data-rebar-size=\"lg\" data-rebar-state=\"idle\">Other</button></span></div><code class=\"rebar-box\" data-rebar-component=\"box\" style=\"display: inline-block; padding: var(--rebar-space-sm) var(--rebar-space-md); background: var(--rebar-color-bg-secondary, #f5f5f5); border-radius: 4px; font-family: monospace;\">npm i x</code></div></div></div>";

describe("hero regression: unchanged when the new fields are unset", () => {
  it("renders byte-for-byte what it did before (minimal)", () => {
    const { container } = render(
      <BlockRenderer blocks={[{ type: "hero", title: "Welcome", subtitle: "Build [docs](/docs) now." }]} />,
    );
    expect(container.innerHTML).toBe(LEGACY_HERO_MIN);
  });

  it("renders byte-for-byte what it did before (all legacy fields)", () => {
    const { container } = render(
      <BlockRenderer
        blocks={[
          {
            type: "hero",
            badge: "New",
            title: "Welcome",
            subtitle: "Sub",
            actions: [{ label: "Go", href: "/go", variant: "primary" }, { label: "Other" }],
            codeSnippet: "npm i x",
            imageSrc: "/l.svg",
            imageSrcDark: "/d.svg",
            imageHeight: 40,
          },
        ]}
      />,
    );
    expect(container.innerHTML).toBe(LEGACY_HERO_FULL);
  });
});

describe("hero: media, backgroundSrc, align", () => {
  const hero = (extra: Partial<Extract<Construct, { type: "hero" }>>): Construct => ({
    type: "hero",
    title: "Welcome",
    subtitle: "Sub",
    ...extra,
  });

  it("renders media in a phone DeviceFrame by default, after the text", () => {
    const { container } = render(<BlockRenderer blocks={[hero({ media: img("App") })]} />);
    const root = container.querySelector('[data-rebar-placement-block="hero"]') as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-hero-layout", "media");
    expect(root.querySelector('[data-rebar-component="device-frame"]')).toHaveAttribute("data-rebar-variant", "phone");
    expect(screen.getByRole("img", { name: "App" })).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    const frame = root.querySelector('[data-rebar-component="device-frame"]')!;
    expect(heading.compareDocumentPosition(frame) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("supports other devices and device none", () => {
    const { container, rerender } = render(<BlockRenderer blocks={[hero({ media: { ...img("A"), device: "browser" } })]} />);
    expect(container.querySelector('[data-rebar-variant="browser"]')).not.toBeNull();
    rerender(<BlockRenderer blocks={[hero({ media: { ...img("A"), device: "none" } })]} />);
    expect(container.querySelector('[data-rebar-component="device-frame"]')).toBeNull();
    expect(screen.getByRole("img", { name: "A" })).toBeInTheDocument();
  });

  it("renders a decorative background image and scrim behind the text", () => {
    const { container } = render(<BlockRenderer blocks={[hero({ backgroundSrc: "/bg.jpg" })]} />);
    const bg = container.querySelector('[data-rebar-part="background"]') as HTMLElement;
    expect(bg).toHaveAttribute("src", "/bg.jpg");
    expect(bg).toHaveAttribute("alt", "");
    expect(bg).toHaveAttribute("aria-hidden", "true");
    const scrim = container.querySelector('[data-rebar-part="scrim"]') as HTMLElement;
    expect(scrim.getAttribute("style")).toContain("--rebar-hero-scrim");
    expect(screen.getByRole("heading", { level: 1 }).getAttribute("style")).toContain("--rebar-hero-text");
    expect(container.querySelector('[data-rebar-placement-block="hero"]')).toHaveAttribute("data-rebar-hero-layout", "background");
  });

  it("align start left-aligns the text", () => {
    const { container } = render(<BlockRenderer blocks={[hero({ align: "start" })]} />);
    const root = container.querySelector('[data-rebar-placement-block="hero"]') as HTMLElement;
    expect(root.style.alignItems).toBe("flex-start");
    expect(root.style.textAlign).toBe("start");
  });

  it("align center keeps the default", () => {
    const { container } = render(<BlockRenderer blocks={[hero({ align: "center" })]} />);
    const root = container.querySelector('[data-rebar-placement-block="hero"]') as HTMLElement;
    expect(root.style.alignItems).toBe("center");
  });
});

describe("feature-grid icons", () => {
  it("is unchanged when no icon is given", () => {
    const { container } = render(<BlockRenderer blocks={[{ type: "feature-grid", items: [{ title: "A", body: "b" }] }]} />);
    expect(container.querySelector('[data-rebar-part="icon"]')).toBeNull();
  });

  it("resolves icon names from core's icon sets", async () => {
    const { container } = render(
      <BlockRenderer
        blocks={[{ type: "feature-grid", items: [{ title: "A", body: "b", icon: "calendar" }, { title: "B", body: "b", icon: "LockIcon" }] }]}
      />,
    );
    await waitFor(() => expect(container.querySelectorAll('[data-rebar-part="icon"] svg')).toHaveLength(2));
    const icons = container.querySelectorAll('[data-rebar-part="icon"] svg');
    expect(icons[0]).toHaveAttribute("data-rebar-icon", "CalendarIcon");
    expect(icons[1]).toHaveAttribute("data-rebar-icon", "LockIcon");
  });

  it("renders an inline iconPath with a custom viewBox, taking priority over icon", () => {
    const { container } = render(
      <BlockRenderer
        blocks={[{ type: "feature-grid", items: [{ title: "A", body: "b", icon: "calendar", iconPath: "M0 0h10v10z", iconViewBox: "0 0 10 10" }] }]}
      />,
    );
    const svg = container.querySelector('[data-rebar-part="icon"] svg') as SVGElement;
    expect(svg).toHaveAttribute("viewBox", "0 0 10 10");
    expect(svg.querySelector("path")).toHaveAttribute("d", "M0 0h10v10z");
    expect(svg).not.toHaveAttribute("data-rebar-icon");
  });

  it("renders nothing for an unknown icon, without crashing, and warns in development", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <BlockRenderer blocks={[{ type: "feature-grid", items: [{ title: "A", body: "b", icon: "no-such-icon" }] }]} />,
    );
    await waitFor(() => expect(warn).toHaveBeenCalledWith(expect.stringContaining("no-such-icon")));
    expect(container.querySelector('[data-rebar-part="icon"]')).toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
    warn.mockRestore();
  });
});

describe("feature-showcase", () => {
  it("renders a FeatureShowcase with a phone frame by default", () => {
    const { container } = render(
      <BlockRenderer
        blocks={[{ type: "feature-showcase", eyebrow: "Plan", title: "Plan it", body: "See [docs](/d).", image: img("Week view"), reverse: true, tone: "inverse" }]}
      />,
    );
    const root = container.querySelector('[data-rebar-placement-block="feature-showcase"]') as HTMLElement;
    expect(root).toHaveAttribute("data-rebar-component", "feature-showcase");
    expect(root).toHaveAttribute("data-rebar-tone", "inverse");
    expect(root).toHaveAttribute("data-rebar-reverse", "true");
    expect(screen.getByRole("heading", { level: 2, name: "Plan it" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "docs" })).toHaveAttribute("href", "/d");
    expect(root.querySelector('[data-rebar-variant="phone"]')).not.toBeNull();
    expect(screen.getByRole("img", { name: "Week view" })).toBeInTheDocument();
  });

  it("honours device and deviceTitle, and device none drops the frame", () => {
    const { container, rerender } = render(
      <BlockRenderer blocks={[{ type: "feature-showcase", title: "T", image: img("S"), device: "browser", deviceTitle: "app.example.com" }]} />,
    );
    expect(container.querySelector('[data-rebar-part="toolbar"]')).toHaveTextContent("app.example.com");
    rerender(<BlockRenderer blocks={[{ type: "feature-showcase", title: "T", image: img("S"), device: "none" }]} />);
    expect(container.querySelector('[data-rebar-component="device-frame"]')).toBeNull();
  });

  it("is Synthetic (no live binding)", () => {
    expect(isOpinionConstructType("feature-showcase")).toBe(false);
  });
});

describe("scroll-rail", () => {
  const items = [
    { image: img("One"), title: "First", eyebrow: "Essay", href: "/one" },
    { image: img("Two"), title: "Second" },
  ];

  it("renders a named ScrollRail with one list item per card", () => {
    render(<BlockRenderer blocks={[{ type: "scroll-rail", label: "Perspectives", items, itemWidth: "12rem" }]} />);
    const region = screen.getByRole("region", { name: "Perspectives" });
    expect(region).toHaveAttribute("data-rebar-component", "scroll-rail");
    expect(region).toHaveAttribute("data-rebar-placement-block", "scroll-rail");
    expect(region.style.getPropertyValue("--rebar-scroll-rail-item-width")).toBe("12rem");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Essay")).toBeInTheDocument();
  });

  it("renders an item as a link only when href is set", () => {
    render(<BlockRenderer blocks={[{ type: "scroll-rail", label: "P", items }]} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/one");
  });

  it("passes controls=false and autoScroll through", () => {
    const { rerender } = render(<BlockRenderer blocks={[{ type: "scroll-rail", label: "P", items, controls: false }]} />);
    expect(screen.queryByRole("button", { name: "Next items" })).toBeNull();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} }) as unknown as typeof window.matchMedia;
    rerender(<BlockRenderer blocks={[{ type: "scroll-rail", label: "P", items, autoScroll: true, loop: true }]} />);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(document.querySelectorAll('[data-rebar-clone="true"]')).toHaveLength(2);
  });

  it("is Synthetic (no live binding)", () => {
    expect(isOpinionConstructType("scroll-rail")).toBe(false);
  });
});

describe("email-capture", () => {
  const block: Construct = { type: "email-capture", label: "Your email", submitLabel: "Join", helperText: "No spam.", successMessage: "Welcome!", onSubmit: "join" };

  it("is an Opinion", () => {
    expect(isOpinionConstructType("email-capture")).toBe(true);
  });

  it("renders an EmailCapture with the given copy", () => {
    const { container } = render(<BlockRenderer blocks={[block]} />);
    expect(container.querySelector('[data-rebar-placement-block="email-capture"]')).toHaveAttribute("data-rebar-component", "email-capture");
    expect(screen.getByLabelText("Your email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
    expect(screen.getByText("No spam.")).toBeInTheDocument();
  });

  it("calls the handler keyed by onSubmit with the validated address", async () => {
    const join = vi.fn().mockResolvedValue(undefined);
    render(<BlockRenderer blocks={[block]} handlers={{ join }} />);
    fireEvent.change(screen.getByLabelText("Your email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Welcome!"));
    expect(join).toHaveBeenCalledWith("ada@example.com");
  });

  it("shows the error state when the live handler rejects", async () => {
    const join = vi.fn().mockRejectedValue(new Error("x"));
    render(<BlockRenderer blocks={[block]} handlers={{ join }} />);
    fireEvent.change(screen.getByLabelText("Your email"), { target: { value: "ada@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Something went wrong"));
  });

  it("with no handler wired, submitting shows the success state (demo)", async () => {
    render(<BlockRenderer blocks={[{ type: "email-capture", successMessage: "Demo ok" }]} />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "ada@example.com" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Notify me" }));
    });
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Demo ok"));
  });
});
