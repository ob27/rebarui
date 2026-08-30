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

  it("tags every top-level block with a schema-shaped data-rebar-block-path", () => {
    const blocks: Block[] = [
      { type: "header", title: "Preview" },
      { type: "checklist", items: ["A", "B"] },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(document.querySelector('[data-rebar-block-path="blocks[0]"]')).not.toBeNull();
    expect(document.querySelector('[data-rebar-block-path="blocks[1]"]')).not.toBeNull();
  });

  it("tags individual checklist items with an item-level path and label", () => {
    const blocks: Block[] = [{ type: "checklist", items: ["First item", "Second item"] }];
    render(<BlockRenderer blocks={blocks} />);
    const first = document.querySelector('[data-rebar-block-path="blocks[0].items[0]"]');
    const second = document.querySelector('[data-rebar-block-path="blocks[0].items[1]"]');
    expect(first).toHaveAttribute("data-rebar-block-item-label", "First item");
    expect(second).toHaveAttribute("data-rebar-block-item-label", "Second item");
  });

  it("nests the path through tabs and modal, matching the real schema shape", () => {
    const blocks: Block[] = [
      {
        type: "tabs",
        tabs: [
          {
            label: "Team",
            blocks: [
              {
                type: "modal",
                title: "Confirm",
                blocks: [{ type: "callout", tone: "info", title: "Are you sure?" }],
              },
            ],
          },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    // blocks[0] (tabs) -> tabs[0] (Team) -> blocks[0] (modal) -> blocks[0] (callout)
    expect(
      document.querySelector('[data-rebar-block-path="blocks[0].tabs[0].blocks[0].blocks[0]"]'),
    ).not.toBeNull();
  });

  it("tags a form field with its path and label", () => {
    const blocks: Block[] = [
      { type: "form", fields: [{ kind: "text", label: "Project name" }] },
    ];
    render(<BlockRenderer blocks={blocks} />);
    const field = document.querySelector('[data-rebar-block-path="blocks[0].fields[0]"]');
    expect(field).toHaveAttribute("data-rebar-block-item-label", "Project name");
  });

  it("renders a hero block with badge, title, subtitle, actions, and a code snippet", () => {
    const blocks: Block[] = [
      {
        type: "hero",
        badge: "v0.1",
        title: "Rebar UI",
        subtitle: "Headless-first, low-fidelity components.",
        actions: [
          { label: "Getting Started", href: "/docs/getting-started", variant: "primary" },
          { label: "Design Heuristics", href: "/docs/theming" },
        ],
        codeSnippet: "npm install rebar-ui",
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("heading", { name: "Rebar UI", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("v0.1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Getting Started" })).toHaveAttribute(
      "href",
      "/docs/getting-started",
    );
    expect(screen.getByText("npm install rebar-ui")).toBeInTheDocument();
  });

  it("renders a section-header block with kicker, title, and subtitle", () => {
    const blocks: Block[] = [
      { type: "section-header", kicker: "Theme customization", title: "Sketch today, anything tomorrow", subtitle: "No code changes, just a theme swap." },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("Theme customization")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sketch today, anything tomorrow" })).toBeInTheDocument();
    expect(screen.getByText("No code changes, just a theme swap.")).toBeInTheDocument();
  });

  it("renders a doc-section block's prose, code, and list nodes in order", () => {
    const blocks: Block[] = [
      {
        type: "doc-section",
        heading: "1. Install",
        body: [
          { kind: "code", code: "npm install rebar-ui" },
          { kind: "text", text: "Swap `@rebar-ui/theme-sketch` for a different theme any time." },
          { kind: "list", items: ["First step", "Second step"] },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    const root = screen.getByText("1. Install").closest("[data-rebar-placement-block='doc-section']") as HTMLElement;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    let node: Node | null;
    // eslint-disable-next-line no-cond-assign
    while ((node = walker.nextNode())) {
      const value = node.textContent?.trim();
      if (value) texts.push(value);
    }
    expect(texts).toEqual([
      "1. Install",
      "npm install rebar-ui",
      "Swap",
      "@rebar-ui/theme-sketch",
      "for a different theme any time.",
      "First step",
      "Second step",
    ]);
  });

  it("parses inline backtick-code and markdown-style links in doc-section prose", () => {
    const blocks: Block[] = [
      {
        type: "doc-section",
        body: [{ kind: "text", text: "See the [component reference](/components) for details." }],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole("link", { name: "component reference" })).toHaveAttribute(
      "href",
      "/components",
    );
  });

  it("renders a props-table block with prop rows", () => {
    const blocks: Block[] = [
      {
        type: "props-table",
        rows: [
          { name: "variant", type: '"primary" | "secondary"', required: false, defaultValue: '"secondary"', description: null },
          { name: "onClick", type: "() => void", required: true, defaultValue: null, description: null },
        ],
      },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText("variant")).toBeInTheDocument();
    expect(screen.getByText('"secondary"')).toBeInTheDocument();
    expect(screen.getAllByText("Yes")).toHaveLength(1);
    expect(screen.getAllByText("No")).toHaveLength(1);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders a fallback message for a props-table block with no rows", () => {
    const blocks: Block[] = [{ type: "props-table", rows: [] }];
    render(<BlockRenderer blocks={blocks} />);
    expect(
      screen.getByText("No component-specific props (only standard HTML/ARIA attributes, forwarded as-is)."),
    ).toBeInTheDocument();
  });

  it("tags a props-table block with its schema-shaped path", () => {
    const blocks: Block[] = [{ type: "props-table", rows: [{ name: "x", type: "string", required: false, defaultValue: null, description: null }] }];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container.querySelector('[data-rebar-placement-block="props-table"]')).toHaveAttribute(
      "data-rebar-block-path",
      "blocks[0]",
    );
  });
});
