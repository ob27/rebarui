import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { BlockRenderer } from "../BlockRenderer";
import type { Construct } from "../schema";

const MEGA: Construct = {
  type: "mega-menu",
  columns: [
    { heading: "Product", items: [{ label: "Tasks", href: "/tasks", description: "A board" }, { label: "Files", href: "/files" }] },
    { heading: "Company", items: [{ label: "About", href: "/about", external: true }] },
  ],
};

const ENTRY: Construct = {
  type: "construct-entry",
  id: "MegaMenu",
  measured: false,
  description: "A multi-column panel",
  shape: "{ type: 'mega-menu' }",
  blocks: [MEGA, { type: "callout", tone: "info", title: "Note", subtitle: "Second child" }],
};

describe("BlockRenderer list keys", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders sibling mega-menu and construct-entry blocks without a React key warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<BlockRenderer blocks={[MEGA, ENTRY, MEGA, ENTRY]} />);
    const keyWarnings = error.mock.calls.filter((args) => args.some((a) => typeof a === "string" && /unique "key" prop/.test(a)));
    expect(keyWarnings).toEqual([]);
  });
});