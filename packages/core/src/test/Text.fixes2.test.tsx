import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Text } from "../components/Text";
import { Heading } from "../components/Heading";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Text polymorphic props", () => {
  it("as=label accepts a typed htmlFor and renders a label bound to its control", () => {
    render(
      <>
        <Text as="label" htmlFor="name-input" size="sm">
          Name
        </Text>
        <input id="name-input" />
      </>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByText("Name").tagName).toBe("LABEL");
  });
  it("as=span and the default p keep working, and the ref reaches the element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <>
        <Text as="span" ref={ref} title="t">inline</Text>
        <Text>block</Text>
      </>,
    );
    expect(ref.current?.tagName).toBe("SPAN");
    expect(screen.getByText("block").tagName).toBe("P");
  });
  it("type-level: htmlFor is rejected on a plain Text", () => {
    // @ts-expect-error htmlFor only exists when as="label"
    const el = <Text htmlFor="x">nope</Text>;
    expect(el).toBeTruthy();
  });
});

describe("Heading base size rules", () => {
  const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
  it("wraps the three size selectors in :where() so a plain class can override them", () => {
    for (const level of [1, 2, 3]) {
      expect(css.replace(/\r\n/g, "\n")).toContain(`:where(.rebar-heading[data-rebar-level="${level}"]) {\n  font-size:`);
    }
  });
  it("does not set a font-size on a normal-specificity heading selector", () => {
    const m = css.match(/^\.rebar-heading\[data-rebar-level="[123]"\] \{[^}]*font-size/gm);
    expect(m).toBeNull();
  });
  it("still renders the level data attribute", () => {
    render(<Heading level={2}>H</Heading>);
    expect(screen.getByRole("heading")).toHaveAttribute("data-rebar-level", "2");
  });
});
