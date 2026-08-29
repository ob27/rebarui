import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlockRenderer } from "../BlockRenderer";
import type { Block } from "../schema";

describe("BlockRenderer", () => {
  it("renders a header block with title and close action", () => {
    const blocks: Block[] = [{ type: "header", title: "Preview", action: { icon: "close" } }];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders a banner block with an action label", () => {
    const blocks: Block[] = [
      { type: "banner", tone: "info", icon: "info", text: "Nothing saved", action: { label: "Reset" } },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Nothing saved")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("renders a checklist block with one card per item, in order", () => {
    const blocks: Block[] = [
      { type: "checklist", heading: "Checklist", items: ["First item", "Second item"] },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("heading", { name: "Checklist" })).toBeInTheDocument();
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
  });

  it("renders a callout block with title and subtitle", () => {
    const blocks: Block[] = [
      { type: "callout", tone: "warning", icon: "clock", title: "In progress", subtitle: "Some items incomplete" },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Some items incomplete")).toBeInTheDocument();
  });

  it("renders a feature-grid block with one entry per item", () => {
    const blocks: Block[] = [
      {
        type: "feature-grid",
        items: [
          { title: "Headless", body: "Radix underneath" },
          { title: "Replaceable", body: "CSS-variable theming" },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Headless")).toBeInTheDocument();
    expect(screen.getByText("Radix underneath")).toBeInTheDocument();
    expect(screen.getByText("Replaceable")).toBeInTheDocument();
  });

  it("renders a pillar-grid block, linking each card's CTA via renderLink", () => {
    const blocks: Block[] = [
      {
        type: "pillar-grid",
        items: [{ title: "Components", body: "The reference", href: "/components", cta: "Browse" }],
      },
    ];
    render(
      <BlockRenderer
        blocks={blocks}
        renderLink={({ href, children }) => <a href={href} data-testid="pillar-link">{children}</a>}
      />,
    );
    const link = screen.getByTestId("pillar-link");
    expect(link).toHaveAttribute("href", "/components");
    expect(screen.getByRole("button", { name: "Browse" })).toBeInTheDocument();
  });

  it("keeps DOM order equal to document order regardless of block type mix", () => {
    const blocks: Block[] = [
      { type: "header", title: "Preview" },
      { type: "banner", tone: "info", text: "First" },
      { type: "checklist", items: ["A", "B"] },
      { type: "callout", tone: "warning", title: "Last" },
    ];
    render(<BlockRenderer blocks={blocks} />);
    const root = screen.getByText("Preview").closest("[data-rebar-placement-root]") as HTMLElement;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    let node: Node | null;
    // eslint-disable-next-line no-cond-assign
    while ((node = walker.nextNode())) {
      const value = node.textContent?.trim();
      if (value) texts.push(value);
    }
    expect(texts).toEqual(["Preview", "First", "A", "B", "Last"]);
  });

  it("falls back to a plain anchor when no renderLink is supplied", () => {
    const blocks: Block[] = [
      {
        type: "pillar-grid",
        items: [{ title: "Docs", body: "Read them", href: "/docs", cta: "Go" }],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/docs");
  });
});
