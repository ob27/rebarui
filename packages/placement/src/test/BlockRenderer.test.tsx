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

  it("renders a form block with each field kind and a submit button", () => {
    const blocks: Block[] = [
      {
        type: "form",
        heading: "Account Settings",
        fields: [
          { kind: "text", label: "Display name", placeholder: "e.g. Jane Doe" },
          { kind: "email", label: "Email address" },
          { kind: "textarea", label: "Bio" },
          { kind: "select", label: "Role", options: ["Admin", "Member"] },
          { kind: "checkbox", label: "Email me updates", checked: true },
        ],
        submitLabel: "Save changes",
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("heading", { name: "Account Settings" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Bio")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Email me updates" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("omits the submit button when a form has no submitLabel (e.g. nested inside a modal)", () => {
    const blocks: Block[] = [
      { type: "form", fields: [{ kind: "text", label: "Project name" }] },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Project name")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders a table block with columns, rows, and a per-row action", () => {
    const blocks: Block[] = [
      {
        type: "table",
        columns: ["Team", "Lead"],
        rows: [
          { cells: ["Engineering", "Priya Shah"], actionLabel: "Select" },
          { cells: ["Design", "Marcus Webb"], actionLabel: "Select" },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Priya Shah")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Select" })).toHaveLength(2);
  });

  it("renders a data-list block with a badge per item", () => {
    const blocks: Block[] = [
      {
        type: "data-list",
        items: [
          { title: "Marketing Site Redesign", badge: "Active" },
          { title: "Legacy API Migration", badge: "Archived" },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Marketing Site Redesign")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("renders a filter-bar block with search, a select, and an action button", () => {
    const blocks: Block[] = [
      {
        type: "filter-bar",
        searchPlaceholder: "Search projects…",
        filterOptions: ["All", "Active", "Archived"],
        actionLabel: "New Project",
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByPlaceholderText("Search projects…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Project" })).toBeInTheDocument();
  });

  it("renders a tabs block, showing the first tab's blocks by default", () => {
    const blocks: Block[] = [
      {
        type: "tabs",
        tabs: [
          { label: "Team", blocks: [{ type: "callout", tone: "info", title: "Team panel" }] },
          { label: "Details", blocks: [{ type: "callout", tone: "info", title: "Details panel" }] },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("tab", { name: "Team" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByText("Team panel")).toBeInTheDocument();
  });

  it("renders a modal block as an open dialog with its own blocks and footer actions", () => {
    const blocks: Block[] = [
      {
        type: "modal",
        title: "New Project",
        blocks: [{ type: "form", fields: [{ kind: "text", label: "Project name" }] }],
        confirmLabel: "Create",
        cancelLabel: "Cancel",
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("heading", { name: "New Project" })).toBeInTheDocument();
    expect(screen.getByText("Project name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
